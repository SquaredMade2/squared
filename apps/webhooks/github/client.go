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

func createGitHubInstallationClient(installationId int64) (*github.Client, error) {
	appID := int64(1145320)

	base64EncodedKey := os.Getenv("GITHUB_APP_PRIVATE_KEY_BASE64")

	if base64EncodedKey == "" {
		return nil, fmt.Errorf("GITHUB_APP_PRIVATE_KEY_BASE64 is not set")
	}

	decodedKey, err := base64.StdEncoding.DecodeString(base64EncodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decode base64 private key: %w", err)
	}

	// Now create an installation token transport
	itr, err := ghinstallation.New(http.DefaultTransport, appID, installationId, decodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	// Create the installation client
	installClient := github.NewClient(&http.Client{Transport: itr})
	valid, err := validateGitHubInstallationAuth(installClient)
	if err != nil {
		return nil, fmt.Errorf("failed to validate GitHub app authentication: %w", err)
	}

	if !valid {
		return nil, fmt.Errorf("GitHub app authentication validation failed")
	}

	return installClient, nil
}

func createGitHubAppClient() (*github.Client, error) {
	appID := int64(1145320)

	base64EncodedKey := os.Getenv("GITHUB_APP_PRIVATE_KEY_BASE64")

	if base64EncodedKey == "" {
		return nil, fmt.Errorf("GITHUB_APP_PRIVATE_KEY_BASE64 is not set")
	}

	decodedKey, err := base64.StdEncoding.DecodeString(base64EncodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to decode base64 private key: %w", err)
	}

	// Now create an installation token transport
	itr, err := ghinstallation.NewAppsTransport(http.DefaultTransport, appID, decodedKey)
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	// Create the installation client
	installClient := github.NewClient(&http.Client{Transport: itr})
	valid, err := validateGitHubAppAuth(installClient)
	if err != nil {
		return nil, fmt.Errorf("failed to validate GitHub app authentication: %w", err)
	}

	if !valid {
		return nil, fmt.Errorf("GitHub app authentication validation failed")
	}

	return installClient, nil
}

// validateGitHubAuth makes a simple API call to verify that the client
// is authenticated properly. It returns true if authentication is successful,
// and false with an error message otherwise.
func validateGitHubInstallationAuth(client *github.Client) (bool, error) {
	ctx := context.Background()
	// This call works with installation tokens
	_, _, err := client.Apps.ListRepos(ctx, nil)
	if err != nil {
		return false, fmt.Errorf("installation authentication validation failed: %w", err)
	}

	return true, nil
}

func validateGitHubAppAuth(client *github.Client) (bool, error) {
	ctx := context.Background()
	// This call works with installation tokens
	_, _, err := client.Apps.Get(ctx, "")
	if err != nil {
		return false, fmt.Errorf("installation authentication validation failed: %w", err)
	}

	return true, nil
}
