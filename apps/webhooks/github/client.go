package github

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v69/github"
)

func createGitHubClient(installationId int64) (*github.Client, error) {
	appID := int64(1145320)

	base64EncodedKey := os.Getenv("GITHUB_APP_PRIVATE_KEY_BASE64")

	if base64EncodedKey == "" {
		return nil, fmt.Errorf("GITHUB_APP_PRIVATE_KEY_BASE64 is not set")
	}

	decodedKey, err := base64.StdEncoding.DecodeString(base64EncodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decode base64 private key: %w", err)
	}

	// Create an app-level transport for authentication
	atr, err := ghinstallation.NewAppsTransport(http.DefaultTransport, appID, decodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create app transport: %w", err)
	}

	// Create the app client
	appClient := github.NewClient(&http.Client{Transport: atr})

	// Validate app authentication
	valid, err := validateGitHubAuth(appClient)
	if err != nil {
		return nil, fmt.Errorf("failed to validate GitHub app authentication: %w", err)
	}

	if !valid {
		return nil, fmt.Errorf("GitHub app authentication validation failed")
	}

	// Now create an installation token transport
	itr, err := ghinstallation.NewKeyFromFile(http.DefaultTransport, appID, installationId, "private-key.pem")
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	// Create the installation client
	installClient := github.NewClient(&http.Client{Transport: itr})

	return installClient, nil
}

// validateGitHubAuth makes a simple API call to verify that the client
// is authenticated properly. It returns true if authentication is successful,
// and false with an error message otherwise.
func validateGitHubAuth(client *github.Client) (bool, error) {
	ctx := context.Background()

	// Try to get the authenticated app information
	app, _, err := client.Apps.Get(ctx, "")
	if err != nil {
		return false, fmt.Errorf("authentication validation failed: %w", err)
	}

	// If we get here, authentication worked
	if app != nil && app.GetName() != "" {
		return true, nil
	}

	return false, fmt.Errorf("authentication validation failed: unable to retrieve app information")
}
