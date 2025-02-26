package github

import (
	"fmt"
	"net/http"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v69/github"
)

func createGitHubClient(installationId int64) (*github.Client, error) {
	appID := int64(1145320)

	privateKeyFile := "githubAppPrivateKey.pem"

	itr, err := ghinstallation.NewKeyFromFile(http.DefaultTransport, appID, installationId, privateKeyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	return github.NewClient(&http.Client{Transport: itr}), nil
}
