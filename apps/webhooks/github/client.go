package github

import (
	"encoding/base64"
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

	// Get base64 encoded private key from environment
	encodedKey := os.Getenv("GITHUB_APP_PRIVATE_KEY")
	if encodedKey != "" {
		// Log the length of the encoded key
		keyLength := len(encodedKey)
		if keyLength < 10 {
			return nil, fmt.Errorf("private key environment variable is too short (length: %d)", keyLength)
		}

		// Decode the base64 encoded key
		privateKey, err := base64.StdEncoding.DecodeString(encodedKey)
		if err != nil {
			return nil, fmt.Errorf("failed to decode private key: %w", err)
		}

		// Verify the key format
		keyStr := string(privateKey)
		if !strings.Contains(keyStr, "-----BEGIN") || !strings.Contains(keyStr, "-----END") {
			// Log just enough information to debug without exposing the key
			beginIndex := strings.Index(keyStr, "-----BEGIN")
			endIndex := strings.Index(keyStr, "-----END")

			return nil, fmt.Errorf("private key format is invalid: BEGIN header found: %v, END header found: %v",
				beginIndex >= 0,
				endIndex >= 0)
		}

		// Create the transport with properly decoded key
		itr, err = ghinstallation.New(http.DefaultTransport, appID, installationId, privateKey)
		if err != nil {
			return nil, fmt.Errorf("failed to create installation transport with decoded key: %w", err)
		}
	} else {
		// Fall back to file
		privateKeyPath := os.Getenv("PRIVATE_KEY_PATH")
		if privateKeyPath == "" {
			return nil, fmt.Errorf("neither GITHUB_APP_PRIVATE_KEY nor PRIVATE_KEY_PATH environment variables are set")
		}

		// Check if the file exists before attempting to use it
		if _, statErr := os.Stat(privateKeyPath); statErr != nil {
			return nil, fmt.Errorf("private key file not found or inaccessible at path %s: %w", privateKeyPath, statErr)
		}

		itr, err = ghinstallation.NewKeyFromFile(http.DefaultTransport, appID, installationId, privateKeyPath)
		if err != nil {
			return nil, fmt.Errorf("failed to create installation transport from file: %w", err)
		}
	}

	// Validate the transport was created
	if itr == nil {
		return nil, fmt.Errorf("installation transport is nil after initialization")
	}

	// Create and return the GitHub client
	return github.NewClient(&http.Client{Transport: itr}), nil
}
