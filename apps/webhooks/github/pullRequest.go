package github

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
)

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
	if _, err := githubService.UpsertPullRequest(context.TODO(), request); err != nil {
		log.Printf("Error upserting pull request: %v", err)
		http.Error(w, "Error upserting pull request", http.StatusInternalServerError)
		return
	}
}
