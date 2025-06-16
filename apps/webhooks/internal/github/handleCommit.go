package github

import (
	"context"
	"log"
	"net/http"
	"strings"
	"time"

	"webhooks/internal/rpc"

	"github.com/google/go-github/v72/github"
)

func handlePushCommitEvent(webhookEvent *github.PushEvent, githubService *rpc.GithubService, w http.ResponseWriter) {
	commit := webhookEvent.HeadCommit

	// Extract branch from ref (refs/heads/main -> main)
	branch := webhookEvent.GetRef()
	if branch != "" && strings.HasPrefix(branch, "refs/heads/") {
		branch = branch[len("refs/heads/"):]
	}

	request := rpc.PushCommitRequest{
		Author:    *commit.Author.Name,
		Branch:    branch, // Use the actual branch name, not tree ID
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
