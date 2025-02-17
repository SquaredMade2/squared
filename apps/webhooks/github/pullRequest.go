package github

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/google/go-github/v69/github"
)

const (
	PRIVATE_KEY_PATH = "githubAppPrivateKey.pem"
	APP_ID           = "your-app-id"
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

	tasks, err := githubService.UpsertPullRequest(context.TODO(), request)
	if err != nil {
		log.Printf("Error upserting pull request: %v", err)
		http.Error(w, "Error upserting pull request", http.StatusInternalServerError)
		return
	}

	// If the action is "edited" and the body has changed, update the PR description
	if webhookEvent.Action == "edited" && webhookEvent.Changes != nil && webhookEvent.Changes.Body != nil {
		if err := updatePullRequestDescription(&github.PullRequest{
			Body:    &pullRequest.Body,
			Number:  &pullRequest.Number,
			State:   &pullRequest.State,
			Title:   &pullRequest.Title,
			HTMLURL: &pullRequest.HTMLUrl,
			Base: &github.PullRequestBranch{
				Repo: &github.Repository{
					NodeID:      &pullRequest.Base.Repo.NodeId,
					Name:        &pullRequest.Base.Repo.Name,
					URL:         &pullRequest.Base.Repo.Url,
					Description: pullRequest.Base.Repo.Description,
					Private:     &pullRequest.Base.Repo.Private,
					Owner: &github.User{
						Login: &pullRequest.Base.Repo.Owner.Login,
					},
				},
			},
		}, *tasks); err != nil {

			log.Printf("Error updating pull request description: %v", err)
			http.Error(w, "Error updating pull request description", http.StatusInternalServerError)
			return
		}
	}
}

func updatePullRequestDescription(pr *github.PullRequest, tasks rpc.UpsertPullRequestResponse) error {
	// Create a GitHub client using the App's JWT
	ctx := context.Background()
	client, err := createGitHubClient()
	if err != nil {
		return err
	}

	baseUrl := os.Getenv("APP_URL")

	// Generate task links
	var taskLinks strings.Builder
	for _, task := range tasks.Tasks {
		taskLinks.WriteString(fmt.Sprintf("\n[%s]: %s", task.Identifier, baseUrl+task.Url))
	}

	// Combine original body with task links
	updatedBody := pr.GetBody() + taskLinks.String()

	// Update the pull request
	updatedPR, _, err := client.PullRequests.Edit(ctx, pr.Base.Repo.Owner.GetLogin(), pr.Base.Repo.GetName(), int(pr.GetNumber()), &github.PullRequest{
		Body: github.Ptr(updatedBody),
	})
	if err != nil {
		return err
	}

	log.Printf("Updated PR #%d: %s with %d task links", updatedPR.GetNumber(), updatedPR.GetTitle(), len(tasks.Tasks))
	return nil
}
