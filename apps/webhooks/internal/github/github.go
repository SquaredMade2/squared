package github

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/SquaredMade2/squared/apps/webhooks/internal/rpc"
	"github.com/google/go-github/v72/github"
)

// LogLevel controls how verbose the logging is
type LogLevel int

const (
	LogLevelQuiet LogLevel = iota
	LogLevelBasic
	LogLevelFull
)

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		log.Println("WEBHOOK_SECRET is not set")
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}
	// Read the request body for logging
	payload, err := github.ValidatePayload(r, []byte(webhookSecret))
	if err != nil {
		errMsg := err.Error()
		if strings.Contains(errMsg, "invalid byte") {
			log.Printf("Invalid Sha256 Signature: %v", err)
			http.Error(w, fmt.Sprintf("Invalid Sha256 Signature: %v", err), http.StatusBadRequest)
			return
		}

		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	githubService := rpc.NewGithubService(os.Getenv("SERVER_URL") + "/rpc")
	event, err := github.ParseWebHook(github.WebHookType(r), payload)

	if err != nil {
		errMsg := err.Error()
		if strings.Contains(errMsg, "unsupported") {
			log.Printf("Invalid webhook event type: %v", err)
			http.Error(w, fmt.Sprintf("Invalid webhook event type: %v", err), http.StatusBadRequest)
			return
		}

		log.Printf("Error parsing webhook: %v", err)
		http.Error(w, fmt.Sprintf("Error parsing webhook: %v", err), http.StatusInternalServerError)
		return
	}
	switch event := event.(type) {
	case *github.PullRequestEvent:
		handlePullRequestEvent(event, githubService, w)
	case *github.PushEvent:
		handlePushCommitEvent(event, githubService, w)
	default:
		http.Error(w, "Unsupported event", http.StatusBadRequest)
		return
	}
}
