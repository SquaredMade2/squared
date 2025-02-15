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

func webhookHandler(r *http.Request, w http.ResponseWriter, rpc *rpc.Services) {
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error loading .env file")
	}
	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	headers := getGitHubWebhookHeaders(r)
	if headers.XHubSignature != webhookSecret {
		log.Printf("X-Hub-Signature is missing")
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
	}

	switch headers.XGitHubEvent {
	case "pull_request":
		handlePullRequestEvent(body, rpc.GithubService)
	default:
		log.Printf("Unsupported event: %s", headers.XGitHubEvent)
	}
}

func handlePullRequestEvent(body []byte, githubService *rpc.GithubService) {
	var webhookEvent WebhookPullRequest
	err := json.Unmarshal(body, &webhookEvent)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
	}

	pullRequest := webhookEvent.PullRequest
	request := rpc.UpsertPullRequestRequest{
		Author: pullRequest.User.Login,
		Body:   pullRequest.Body,
		Branch: pullRequest.Head.Ref,
		Id:     pullRequest.NodeId,
		Number: pullRequest.Number,
	}
	githubService.UpsertPullRequest(context.TODO(), request)
}
