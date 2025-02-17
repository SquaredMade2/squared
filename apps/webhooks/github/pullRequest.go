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

	if err := addCommentToPR(pullRequest.Base.Repo.Owner.Login, pullRequest.Base.Repo.Name, pullRequest.Number, *tasks); err != nil {
		log.Printf("Error adding comment to PR: %v", err)
		http.Error(w, "Error adding comment to PR", http.StatusInternalServerError)
		return
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

func addCommentToPR(owner, repo string, prNumber int, tasks rpc.UpsertPullRequestResponse) error {
	ctx := context.Background()
	baseUrl := os.Getenv("APP_URL")
	client, err := createGitHubClient()

	// Check if bot has already commented
	comments, _, err := client.Issues.ListComments(ctx, owner, repo, prNumber, nil)
	if err != nil {
		return fmt.Errorf("failed to list comments: %w", err)
	}

	botCommented := false
	for _, comment := range comments {
		if strings.Contains(comment.GetBody(), "🔗 Linked Task(s) Found") {
			botCommented = true
			break
		}
	}

	if botCommented {
		fmt.Println("Bot has already commented on this PR.")
		return nil
	}

	// Prepare comment body
	var taskList strings.Builder
	for _, task := range tasks.Tasks {
		taskList.WriteString(fmt.Sprintf("📌 [%s](%s) – %s\n", task.Identifier, baseUrl+task.Url, task.Title))
	}

	commentBody := fmt.Sprintf(`🔗 Linked Task(s) Found

This pull request is associated with the following task(s) in [External Project Management System]:

%s
Keeping tasks and PRs connected helps streamline progress and ensure visibility. If this is incorrect or missing tasks, please update the linked references accordingly.

🔍 Automated by Squared`, taskList.String())

	comment := &github.IssueComment{Body: github.String(commentBody)}
	_, _, err = client.Issues.CreateComment(ctx, owner, repo, prNumber, comment)
	if err != nil {
		return fmt.Errorf("failed to create comment: %w", err)
	}

	fmt.Println("Comment added successfully.")
	return nil
}
