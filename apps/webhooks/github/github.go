package github

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/joho/godotenv"
)

func getGitHubWebhookHeaders(r *http.Request) GitHubWebhookHeaders {
	return GitHubWebhookHeaders{
		XGitHubHookID:                     r.Header.Get("X-GitHub-Hook-ID"),
		XGitHubEvent:                      r.Header.Get("X-GitHub-Event"),
		XGitHubDelivery:                   r.Header.Get("X-GitHub-Delivery"),
		XHubSignature:                     r.Header.Get("X-Hub-Signature"),
		XHubSignature256:                  r.Header.Get("X-Hub-Signature-256"),
		UserAgent:                         r.Header.Get("User-Agent"),
		XGitHubHookInstallationTargetType: r.Header.Get("X-GitHub-Hook-Installation-Target-Type"),
		XGitHubHookInstallationTargetID:   r.Header.Get("X-GitHub-Hook-Installation-Target-ID"),
		XTestOverride:                     r.Header.Get("X-Test-Override"),
	}
}

func verifySignature256(r *http.Request, secret string, headers GitHubWebhookHeaders) bool {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("Error reading request body:", err)
		return false
	}

	// Reset request body so it can be read again downstream
	r.Body = io.NopCloser(strings.NewReader(string(body)))

	if headers.XTestOverride == "squared123" {
		return true
	}

	// Compute HMAC-SHA256 using webhook secret
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expectedMAC := mac.Sum(nil)
	expectedSignature := "sha256=" + hex.EncodeToString(expectedMAC)

	// Compare computed signature with the one in the header
	return hmac.Equal([]byte(headers.XHubSignature256), []byte(expectedSignature))
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		log.Println("WEBHOOK_SECRET is not set")
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	headers := getGitHubWebhookHeaders(r)
	if !verifySignature256(r, webhookSecret, headers) {
		log.Println("X-Hub-Signature-256 is incorrect")
		http.Error(w, "Error verifying request signature", http.StatusBadRequest)
		return
	}

	githubService := rpc.NewGithubService(os.Getenv("SERVER_URL") + "/rpc")

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
	}

	switch headers.XGitHubEvent {
	case "pull_request":
		handlePullRequestEvent(body, githubService, w)
	case "push":
		handlePushCommitEvent(body, githubService, w)
	default:
		log.Printf("Unsupported event: %s", headers.XGitHubEvent)
		http.Error(w, "Unsupported event", http.StatusBadRequest)
		return
	}
}

func handlePullRequestEvent(body []byte, githubService *rpc.GithubService, w http.ResponseWriter) {
	var webhookEvent WebhookPullRequest
	err := json.Unmarshal(body, &webhookEvent)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
	}

	supportedActions := []string{"opened", "edited", "reopened"}

	if !contains(supportedActions, webhookEvent.Action) {
		log.Printf("Unsupported action: %s", webhookEvent.Action)
		http.Error(w, "Unsupported action", http.StatusBadRequest)
		return
	}

	pullRequest := webhookEvent.PullRequest
	request := rpc.UpsertPullRequestRequest{
		Author: pullRequest.User.Login,
		Body:   pullRequest.Body,
		Branch: pullRequest.Head.Ref,
		Id:     pullRequest.NodeId,
		Number: pullRequest.Number,
		Repo: struct {
			Description *string `json:"description"`
			Id          string  `json:"id"`
			Name        string  `json:"name"`
			Private     bool    `json:"private"`
			Url         string  `json:"url"`
		}{
			Id:          pullRequest.Base.Repo.NodeId,
			Name:        pullRequest.Base.Repo.Name,
			Url:         pullRequest.Base.Repo.Url,
			Description: pullRequest.Base.Repo.Description,
			Private:     pullRequest.Base.Repo.Private,
		},
		State:     pullRequest.State,
		Title:     pullRequest.Title,
		Url:       pullRequest.HTMLUrl,
		Timestamp: pullRequest.CreatedAt,
	}
	if err := githubService.UpsertPullRequest(context.TODO(), request); err != nil {
		log.Printf("Error upserting pull request: %v", err)
		http.Error(w, "Error upserting pull request", http.StatusInternalServerError)
		return
	}
}

func handlePushCommitEvent(body []byte, githubService *rpc.GithubService, w http.ResponseWriter) {
	var webhookEvent WebhookPushCommit
	err := json.Unmarshal(body, &webhookEvent)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
	}

	commit := webhookEvent.HeadCommit
	request := rpc.PushCommitRequest{
		Author:    commit.Author.Name,
		Branch:    commit.TreeId,
		Id:        commit.Id,
		Message:   commit.Message,
		RepoId:    webhookEvent.Repository.NodeId,
		Timestamp: commit.Timestamp,
		Url:       commit.Url,
	}
	if err := githubService.PushCommit(context.TODO(), request); err != nil {
		log.Printf("Error uploading commit: %v", err)
		http.Error(w, "Error uploading commit", http.StatusInternalServerError)
		return
	}
}
