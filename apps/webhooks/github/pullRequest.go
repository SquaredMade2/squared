package github

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/SquaredMade2/squared/apps/webhooks/gen/rpc"
	"github.com/golang-jwt/jwt"
	"github.com/google/go-github/v45/github"
	"golang.org/x/oauth2"
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

	if _, err := githubService.UpsertPullRequest(context.TODO(), request); err != nil {
		log.Printf("Error upserting pull request: %v", err)
		http.Error(w, "Error upserting pull request", http.StatusInternalServerError)
		return
	}

	// If the action is "edited" and the body has changed, update the PR description
	if webhookEvent.Action == "edited" && webhookEvent.Changes != nil && webhookEvent.Changes.Body != nil {
		if err := updatePullRequestDescription(pullRequest); err != nil {
			log.Printf("Error updating pull request description: %v", err)
			http.Error(w, "Error updating pull request description", http.StatusInternalServerError)
			return
		}
	}
}

func updatePullRequestDescription(pr *github.PullRequest) error {
	// Create a GitHub client
	ctx := context.Background()
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: "YOUR_GITHUB_ACCESS_TOKEN"},
	)
	tc := oauth2.NewClient(ctx, ts)
	client := github.NewClient(tc)

	// Update the pull request
	updatedPR, _, err := client.PullRequests.Edit(ctx, pr.Base.Repo.Owner.GetLogin(), pr.Base.Repo.GetName(), int(pr.GetNumber()), &github.PullRequest{
		Body: github.String(pr.GetBody()),
	})
	if err != nil {
		return err
	}

	log.Printf("Updated PR #%d: %s", updatedPR.GetNumber(), updatedPR.GetTitle())
	return nil
}

func createGitHubClient(ctx context.Context) (*github.Client, error) {
	// Read the private key
	privateKey, err := os.ReadFile(PRIVATE_KEY_PATH)
	if err != nil {
		return nil, err
	}

	// Create the JWT
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iat": time.Now().Unix(),
		"exp": time.Now().Add(10 * time.Minute).Unix(),
		"iss": APP_ID,
	})

	// Sign the JWT with the private key
	signedToken, err := token.SignedString(privateKey)
	if err != nil {
		return nil, err
	}

	// Create a new OAuth2 client using the JWT
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: signedToken},
	)
	tc := oauth2.NewClient(ctx, ts)

	// Create and return the GitHub client
	return github.NewClient(tc), nil
}
