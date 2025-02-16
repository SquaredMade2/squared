package github

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestWebhookHandler(t *testing.T) {
	// Test cases
	testCases := []struct {
		name           string
		event          string
		payload        interface{}
		expectedStatus int
	}{
		{
			name:  "Valid Pull Request Opened",
			event: "pull_request",
			payload: WebhookPullRequest{
				Action: "opened",
				PullRequest: PullRequest{
					Number: 1,
					Title:  "Test PR",
					User:   User{Login: "testuser"},
					Head: Head{
						Ref: "feature-branch",
					},
					Base: Base{
						Repo: Repo{
							NodeId: "repo-123",
							Name:   "test-repo",
						},
					},
				},
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:  "Valid Push Commit",
			event: "push",
			payload: WebhookPushCommit{
				HeadCommit: Commit{
					Id:      "abc123",
					Message: "Test commit",
					Author: User{
						Name: "Test Author",
					},
				},
				Repository: Repo{
					NodeId: "repo-456",
				},
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "Unsupported Event",
			event:          "issues",
			payload:        struct{}{},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a request with the test payload
			payload, _ := json.Marshal(tc.payload)
			req := httptest.NewRequest("POST", "/webhook", nil)
			req.Body = io.NopCloser(bytes.NewBuffer(payload))

			// Set headers
			req.Header.Set("X-GitHub-Event", tc.event)
			req.Header.Set("X-Test-Override", "squared123")

			// Create a response recorder
			rr := httptest.NewRecorder()

			// Call the webhook handler
			WebhookHandler(rr, req)

			// Check the status code
			if status := rr.Code; status != tc.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v", status, tc.expectedStatus)
			}
		})
	}
}

func TestVerifySignature256(t *testing.T) {
	secret := "test_secret"
	body := []byte("test_body")

	// Create a valid signature
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	validSignature := "sha256=" + hex.EncodeToString(mac.Sum(nil))

	testCases := []struct {
		name      string
		signature string
		expected  bool
	}{
		{
			name:      "Valid Signature",
			signature: validSignature,
			expected:  true,
		},
		{
			name:      "Invalid Signature",
			signature: "sha256=invalid_signature",
			expected:  false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest("POST", "/webhook", bytes.NewBuffer(body))
			req.Header.Set("X-Hub-Signature-256", tc.signature)

			headers := getGitHubWebhookHeaders(req)
			result := verifySignature256(req, secret, headers)

			if result != tc.expected {
				t.Errorf("verifySignature256() = %v, want %v", result, tc.expected)
			}
		})
	}
}
