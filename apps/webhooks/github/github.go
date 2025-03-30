package github

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/SquaredMade2/squared/apps/webhooks/helpers"
)

// LogLevel controls how verbose the logging is
type LogLevel int

const (
	LogLevelQuiet LogLevel = iota
	LogLevelBasic
	LogLevelFull
)

// Current log level - set to Basic by default
var currentLogLevel = LogLevelBasic

// SetLogLevel allows changing the logging verbosity
func SetLogLevel(level LogLevel) {
	currentLogLevel = level
}

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
	helpers.LoadEnv()

	webhookSecret := os.Getenv("WEBHOOK_SECRET")
	if webhookSecret == "" {
		log.Println("WEBHOOK_SECRET is not set")
		http.Error(w, "Server error", http.StatusInternalServerError)
		return
	}

	// Read the request body for logging
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	// Conditional logging based on log level
	if currentLogLevel == LogLevelFull {
		// Log the full payload for debugging
		log.Printf("GitHub webhook payload: %s", string(body))
	} else if currentLogLevel == LogLevelBasic {
		// Log just basic info about the webhook
		event := r.Header.Get("X-GitHub-Event")
		delivery := r.Header.Get("X-GitHub-Delivery")

		// If it's a pull request or push event, extract some key info
		var shortInfo string
		if event == "pull_request" && len(body) > 0 {
			// Try to extract PR number and title without full JSON parsing
			prNumStart := strings.Index(string(body), `"number":`)
			prTitleStart := strings.Index(string(body), `"title":`)

			if prNumStart > 0 && prTitleStart > 0 {
				// Extract a small snippet
				prNumEnd := strings.Index(string(body)[prNumStart+9:], ",")
				prTitleEnd := strings.Index(string(body)[prTitleStart+9:], ",")

				if prNumEnd > 0 && prTitleEnd > 0 {
					prNum := strings.TrimSpace(string(body)[prNumStart+9 : prNumStart+9+prNumEnd])
					prTitle := strings.TrimSpace(strings.Trim(string(body)[prTitleStart+9:prTitleStart+9+prTitleEnd], `"'`))
					shortInfo = "PR#" + prNum + ": " + prTitle
				}
			}
		} else if event == "push" && len(body) > 0 {
			// Try to extract branch ref
			refStart := strings.Index(string(body), `"ref":`)
			if refStart > 0 {
				refEnd := strings.Index(string(body)[refStart+7:], `"`)
				if refEnd > 0 {
					ref := string(body)[refStart+7 : refStart+7+refEnd]
					// Extract branch name from ref (refs/heads/branch-name)
					parts := strings.Split(ref, "/")
					if len(parts) > 2 {
						shortInfo = "Branch: " + parts[len(parts)-1]
					} else {
						shortInfo = "Ref: " + ref
					}
				}
			}
		}

		if shortInfo != "" {
			log.Printf("Received GitHub %s event (id: %s): %s", event, delivery, shortInfo)
		} else {
			log.Printf("Received GitHub %s event (id: %s)", event, delivery)
		}
	}

	// Restore the body for further processing
	r.Body = io.NopCloser(bytes.NewReader(body))

	githubService := rpc.NewGithubService(os.Getenv("SERVER_URL") + "/rpc")
	if r.URL.Query().Get("installation_id") != "" {
		handleInstallEvent(githubService, r, w)
		return
	}

	headers := getGitHubWebhookHeaders(r)
	if !verifySignature256(r, webhookSecret, headers) {
		log.Println("X-Hub-Signature-256 is incorrect")
		http.Error(w, "Error verifying request signature", http.StatusBadRequest)
		return
	}

	// Re-read body since it was consumed by signature verification
	body, err = io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, fmt.Sprintf("Error reading request body: %v", err), http.StatusInternalServerError)
		return
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
