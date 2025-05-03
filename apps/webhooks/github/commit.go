package github

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/google/go-github/v71/github"
)

func handlePushCommitEvent(webhookEvent *github.PushEvent, githubService *rpc.GithubService, w http.ResponseWriter) {
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
