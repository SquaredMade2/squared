package github

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/integrations/src/gen/rpc"
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
	}
}

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}
	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	headers := getGitHubWebhookHeaders(r)
	if headers.XHubSignature != webhookSecret {
		log.Printf("X-Hub-Signature is missing")
		http.Error(w, "Error reading request body", http.StatusBadRequest)
		return
	}

	githubService := rpc.NewGithubService(os.Getenv("SERVER_URL"))

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
	w.WriteHeader(http.StatusOK)
}

func handlePullRequestEvent(body []byte, githubService *rpc.GithubService, w http.ResponseWriter) {
	var webhookEvent WebhookPullRequest
	err := json.Unmarshal(body, &webhookEvent)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
	}

	pullRequest := webhookEvent.PullRequest
	request := rpc.UpsertPullRequestRequest{
		Author:    pullRequest.User.Login,
		Body:      pullRequest.Body,
		Branch:    pullRequest.Head.Ref,
		Id:        pullRequest.NodeId,
		Number:    pullRequest.Number,
		RepoId:    pullRequest.Base.Repo.NodeId,
		State:     pullRequest.State,
		Title:     pullRequest.Title,
		Url:       pullRequest.HTMLUrl,
		Timestamp: pullRequest.CreatedAt,
	}
	if _, err := githubService.UpsertPullRequest(context.TODO(), request); err != nil {
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
	if _, err := githubService.PushCommit(context.TODO(), request); err != nil {
		log.Printf("Error uploading commit: %v", err)
		http.Error(w, "Error uploading commit", http.StatusInternalServerError)
		return
	}
}
