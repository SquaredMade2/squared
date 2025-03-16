package github

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/bradleyfalzon/ghinstallation/v2"
	"github.com/google/go-github/v69/github"
)

func createGitHubClient(installationId int64) (*github.Client, error) {
	appID := int64(1145320)
	var itr *ghinstallation.Transport
	var err error

	privateKeyEnv := os.Getenv("GITHUB_APP_PRIVATE_KEY")
	if privateKeyEnv != "" {
		// Replace escaped newlines with actual newlines
		privateKeyEnv = strings.ReplaceAll(privateKeyEnv, "\\n", "\n")
		itr, err = ghinstallation.New(http.DefaultTransport, appID, installationId, []byte(privateKeyEnv))
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
