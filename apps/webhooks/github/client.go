package github

import (
	"encoding/base64"
	"fmt"
	"net/http"
	"os"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v69/github"
)

func createGitHubClient(installationId int64) (*github.Client, error) {
	appID := int64(1145320)
	var itr *ghinstallation.Transport
	var err error

	// Get base64 encoded private key from environment
	encodedKey := os.Getenv("GITHUB_APP_PRIVATE_KEY")
	if encodedKey != "" {
		// Decode the base64 encoded key
		privateKey, err := base64.StdEncoding.DecodeString(encodedKey)
		if err != nil {
			return nil, fmt.Errorf("failed to decode private key: %w", err)
		}

		itr, err = ghinstallation.New(http.DefaultTransport, appID, installationId, privateKey)
	} else {
		// Fall back to file
		privateKeyPath := os.Getenv("PRIVATE_KEY_PATH")
		if privateKeyPath == "" {
			return nil, fmt.Errorf("neither GITHUB_APP_PRIVATE_KEY nor PRIVATE_KEY_PATH environment variables are set")
		}
		itr, err = ghinstallation.NewKeyFromFile(http.DefaultTransport, appID, installationId, privateKeyPath)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to create installation transport: %w", err)
	}

	return github.NewClient(&http.Client{Transport: itr}), nil
}
