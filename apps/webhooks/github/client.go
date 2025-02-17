package github

import (
	"context"
	"fmt"
	"net/http"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v69/github"
)

func createGitHubClient() (*github.Client, error) {
	installationID, err := getInstallationID()
	if err != nil {
		fmt.Printf("Error getting installation ID: %v\n", err)
		return nil, err
	}
	appID := int64(1145320)

	privateKeyFile := "githubAppPrivateKey.pem"

	itr, err := ghinstallation.NewKeyFromFile(http.DefaultTransport, appID, installationID, privateKeyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	return github.NewClient(&http.Client{Transport: itr}), nil
}

func getInstallationID() (int64, error) {
	// Your App ID and private key file
	appID := int64(1145320)
	privateKeyFile := "githubAppPrivateKey.pem"

	// Create a new app transport
	itr, err := ghinstallation.NewAppsTransportKeyFromFile(http.DefaultTransport, appID, privateKeyFile)
	if err != nil {
		return 0, fmt.Errorf("failed to create app transport: %w", err)
	}

	// Create a new client
	client := github.NewClient(&http.Client{Transport: itr})

	// List installations
	installations, _, err := client.Apps.ListInstallations(context.Background(), &github.ListOptions{})
	if err != nil {
		return 0, fmt.Errorf("failed to list installations: %w", err)
	}

	if len(installations) == 0 {
		return 0, fmt.Errorf("no installations found")
	}

	// Return the ID of the first installation (you might want to handle multiple installations differently)
	return installations[0].GetID(), nil
}
