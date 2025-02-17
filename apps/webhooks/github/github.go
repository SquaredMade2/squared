package github

import (
	"io"
	"log"
	"net/http"
	"os"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/SquaredMade2/squared/apps/webhooks/helpers"
)

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	helpers.LoadEnv()

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
