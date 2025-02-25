package github

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
)

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
