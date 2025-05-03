package github

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/google/go-github/v69/github"
)

func handlePushCommitEvent(body []byte, githubService *rpc.GithubService, w http.ResponseWriter) {
	var webhookEvent github.PushEvent
	err := json.Unmarshal(body, &webhookEvent)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
		log.Printf("Raw webhook payload: %s", string(body))
	}

	commit := webhookEvent.HeadCommit
	request := rpc.PushCommitRequest{
		Author:    *commit.Author.Name,
		Branch:    *commit.TreeID,
		Id:        *commit.ID,
		Message:   *commit.Message,
		RepoId:    *webhookEvent.Repo.NodeID,
		Timestamp: commit.Timestamp.Format(time.RFC3339),
		Url:       *commit.URL,
	}
	if _, err := githubService.PushCommit(context.TODO(), request); err != nil {
		log.Printf("Error uploading commit: %v", err)
		http.Error(w, "Error uploading commit", http.StatusInternalServerError)
		return
	}
}
