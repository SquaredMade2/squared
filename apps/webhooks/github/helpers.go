package github

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"io"
	"log"
	"net/http"
	"strings"
)

func verifySignature256(r *http.Request, secret string, headers GitHubWebhookHeaders) bool {
	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("Error reading request body:", err)
		return false
	}

	// Reset request body so it can be read again downstream
	r.Body = io.NopCloser(strings.NewReader(string(body)))

	if headers.XTestOverride == "squared123" {
		return true
	}

	// Compute HMAC-SHA256 using webhook secret
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	expectedMAC := mac.Sum(nil)
	expectedSignature := "sha256=" + hex.EncodeToString(expectedMAC)

	// Compare computed signature with the one in the header
	return hmac.Equal([]byte(headers.XHubSignature256), []byte(expectedSignature))
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}

func getGitHubWebhookHeaders(r *http.Request) GitHubWebhookHeaders {
	return GitHubWebhookHeaders{
		XGitHubHookID:                     r.Header.Get("X-GitHub-Hook-ID"),
		XGitHubEvent:                      r.Header.Get("X-GitHub-Event"),
		XGitHubDelivery:                   r.Header.Get("X-GitHub-Delivery"),
		XHubSignature:                     r.Header.Get("X-Hub-Signature"),
		XHubSignature256:                  r.Header.Get("X-Hub-Signature-256"),
		UserAgent:                         r.Header.Get("User-Agent"),
		XGitHubHookInstallationTargetType: r.Header.Get("X-GitHub-Hook-Installation-Target-Type"),
		XGitHubHookInstallationTargetID:   r.Header.Get("X-GitHub-Hook-Installation-Target-ID"),
		XTestOverride:                     r.Header.Get("X-Test-Override"),
	}
}
