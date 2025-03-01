package github

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"io"
	"log"

	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

// MockRPCServer implements a mock server for GitHub RPC calls
type MockRPCServer struct {
	server *httptest.Server
}

func NewMockRPCServer() *MockRPCServer {
	mock := &MockRPCServer{}

	// Create a test server that returns appropriate responses
	mock.server = httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Only log request path for debugging, not the entire request body
		fmt.Printf("Received request to: %s\n", r.URL.Path)

		// Parse the endpoint path to determine which mock response to return
		endpoint := r.URL.Path

		switch {
		case strings.Contains(endpoint, "/github/upsertPullRequest"):
			// Mock response for pull request updates - just return a string directly
			// This matches what superjson expects
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`"{\"tasks\":[{\"identifier\":\"SQ-123\",\"title\":\"Test Task\",\"url\":\"/tasks/123\"}]}"`))

		case strings.Contains(endpoint, "/github/pushCommit"):
			// Mock response for commit pushes
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`"{}"`))

		case strings.Contains(endpoint, "/github/uploadOrg"):
			// Mock response for organization uploads
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
			w.Write([]byte(`"{}"`))

		default:
			// Unknown endpoint
			w.WriteHeader(http.StatusNotFound)
		}
	}))

	return mock
}

func (m *MockRPCServer) Close() {
	m.server.Close()
}

func (m *MockRPCServer) URL() string {
	return m.server.URL
}

func TestMain(m *testing.M) {
	// Setup
	os.Setenv("WEBHOOK_SECRET", "squared")
	os.Setenv("SERVER_URL", "http://localhost:5173")

	// Set log level to quiet for tests to reduce noise
	SetLogLevel(LogLevelQuiet)

	// Optionally capture log output to prevent it from cluttering test output
	originalOutput := log.Writer()
	log.SetOutput(io.Discard)

	// Run tests
	code := m.Run()

	// Restore log output
	log.SetOutput(originalOutput)

	// Teardown
	os.Unsetenv("WEBHOOK_SECRET")
	os.Unsetenv("SERVER_URL")

	os.Exit(code)
}

// Helper function to compute a valid signature
func computeSignature(body []byte, secret string) string {
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write(body)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

func TestVerifySignature256(t *testing.T) {
	testCases := []struct {
		name            string
		body            string
		secret          string
		signatureHeader string
		expected        bool
	}{
		{
			name:            "Valid signature",
			body:            `{"test":"data"}`,
			secret:          "squared",
			signatureHeader: "", // Will be computed
			expected:        true,
		},
		{
			name:            "Invalid signature",
			body:            `{"test":"data"}`,
			secret:          "squared",
			signatureHeader: "sha256=invalid",
			expected:        false,
		},
		{
			name:            "Test override",
			body:            `{"test":"data"}`,
			secret:          "squared",
			signatureHeader: "", // Doesn't matter, will use test override
			expected:        true,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			// Create a request with the specified body
			req := httptest.NewRequest("POST", "/", bytes.NewBufferString(tc.body))

			// Set up the headers
			var headers GitHubWebhookHeaders
			if tc.name == "Test override" {
				headers.XTestOverride = "squared123"
			} else {
				if tc.signatureHeader == "" {
					// Compute a valid signature
					tc.signatureHeader = computeSignature([]byte(tc.body), tc.secret)
				}
				headers.XHubSignature256 = tc.signatureHeader
			}

			// Test the verify function
			result := verifySignature256(req, tc.secret, headers)

			if result != tc.expected {
				t.Errorf("Expected %v but got %v", tc.expected, result)
			}
		})
	}
}

func TestWebhookHandler_PullRequest(t *testing.T) {
	// Load sample pull request payload from file
	pullRequestPayload, err := os.ReadFile("../testdata/pull_request_payload.json")
	if err != nil {
		// Use a minimal payload if file not available
		pullRequestPayload = []byte(`{"action":"opened","pull_request":{"number":1138,"html_url":"https://github.com/org/repo/pull/1138","title":"Test PR","body":"Test body","user":{"login":"testuser"},"head":{"ref":"feature-branch"},"base":{"repo":{"node_id":"R123","name":"repo","url":"https://api.github.com/repos/org/repo","description":"Test description","private":true}}},"repository":{"node_id":"R123","name":"repo"},"organization":{"node_id":"O123","login":"org"},"installation":{"id":12345}}`)
	}

	// Set up mock RPC server
	mockServer := NewMockRPCServer()
	defer mockServer.Close()

	// Set SERVER_URL to point to our mock server
	originalServerURL := os.Getenv("SERVER_URL")
	os.Setenv("SERVER_URL", mockServer.URL())
	defer os.Setenv("SERVER_URL", originalServerURL)

	// Create test request
	req := httptest.NewRequest("POST", "/github", bytes.NewBuffer(pullRequestPayload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Event", "pull_request")
	req.Header.Set("X-GitHub-Delivery", "test-delivery-id")
	req.Header.Set("X-GitHub-Hook-Installation-Target-Type", "integration")
	req.Header.Set("X-GitHub-Hook-Installation-Target-Id", "1145320")
	req.Header.Set("X-Hub-Signature-256", computeSignature(pullRequestPayload, "squared"))

	// Create response recorder
	rr := httptest.NewRecorder()

	// Call webhook handler
	WebhookHandler(rr, req)

	// Check response status
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}

func TestWebhookHandler_PushCommit(t *testing.T) {
	// Load sample push commit payload from file
	pushPayload, err := os.ReadFile("../testdata/push_payload.json")
	if err != nil {
		// Use a minimal payload if file not available
		pushPayload = []byte(`{"ref":"refs/heads/main","commits":[{"id":"abc123","message":"Test commit","timestamp":"2025-03-01T17:12:38+11:00","author":{"name":"Test User","email":"test@example.com"},"url":"https://github.com/org/repo/commit/abc123","tree_id":"def456"}],"repository":{"id":123,"node_id":"R123","name":"repo","created_at":1721593293},"head_commit":{"id":"abc123","message":"Test commit","timestamp":"2025-03-01T17:12:38+11:00","author":{"name":"Test User"},"tree_id":"def456"},"installation":{"id":12345}}`)
	}

	// Set up mock RPC server
	mockServer := NewMockRPCServer()
	defer mockServer.Close()

	// Set SERVER_URL to point to our mock server
	originalServerURL := os.Getenv("SERVER_URL")
	os.Setenv("SERVER_URL", mockServer.URL())
	defer os.Setenv("SERVER_URL", originalServerURL)

	// Create test request
	req := httptest.NewRequest("POST", "/github", bytes.NewBuffer(pushPayload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Event", "push")
	req.Header.Set("X-GitHub-Delivery", "test-delivery-id")
	req.Header.Set("X-Hub-Signature-256", computeSignature(pushPayload, "squared"))

	// Create response recorder
	rr := httptest.NewRecorder()

	// Call webhook handler
	WebhookHandler(rr, req)

	// Check response status
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}

func TestWebhookHandler_InvalidSignature(t *testing.T) {
	payload := []byte(`{"test":"data"}`)

	// Create test request with invalid signature
	req := httptest.NewRequest("POST", "/github", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Event", "push")
	req.Header.Set("X-GitHub-Delivery", "test-delivery-id")
	req.Header.Set("X-Hub-Signature-256", "sha256=invalid")

	// Create response recorder
	rr := httptest.NewRecorder()

	// Call webhook handler
	WebhookHandler(rr, req)

	// Check response status - should be bad request
	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

func TestWebhookHandler_UnsupportedEvent(t *testing.T) {
	payload := []byte(`{"test":"data"}`)

	// Create test request with valid signature but unsupported event
	req := httptest.NewRequest("POST", "/github", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-GitHub-Event", "unsupported_event")
	req.Header.Set("X-GitHub-Delivery", "test-delivery-id")
	req.Header.Set("X-Hub-Signature-256", computeSignature(payload, "squared"))

	// Create response recorder
	rr := httptest.NewRecorder()

	// Call webhook handler
	WebhookHandler(rr, req)

	// Check response status - should be bad request
	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

// Create test directories and files
func init() {
	// Create testdata directory if it doesn't exist
	if _, err := os.Stat("../testdata"); os.IsNotExist(err) {
		os.MkdirAll("../testdata", 0755)
	}

	// Create sample pull request payload file
	pullRequestPayload := `{
    "action": "opened",
    "number": 1138,
    "pull_request": {
        "url": "https://api.github.com/repos/SquaredMade2/squared/pulls/1138",
        "id": 2365680690,
        "node_id": "PR_kwDOMZUqa86NAWwy",
        "html_url": "https://github.com/SquaredMade2/squared/pull/1138",
        "number": 1138,
        "state": "open",
        "title": "feat: log webhook event payload for debugging",
        "user": {
            "login": "THEjacob1000",
            "id": 76940960,
            "node_id": "MDQ6VXNlcjc2OTQwOTYw"
        },
        "body": "# Pull Request\\r\\n\\r\\n## Description\\r\\n\\r\\nPlease include a summary of the change and which issue is fixed.",
        "created_at": "2025-03-01T02:01:26Z",
        "updated_at": "2025-03-01T02:01:26Z",
        "head": {
            "label": "SquaredMade2:feature/testing-for-webhooks",
            "ref": "feature/testing-for-webhooks",
            "sha": "135b80a8f4428187957941f0b091228ef466ddbd",
            "repo": {
                "id": 831859307,
                "node_id": "R_kgDOMZUqaw",
                "name": "squared",
                "full_name": "SquaredMade2/squared",
                "private": true,
                "description": null
            }
        },
        "base": {
            "label": "SquaredMade2:develop",
            "ref": "develop",
            "sha": "1bd5006891ce3c7c35659fdcec1dfed9b7240748",
            "repo": {
                "id": 831859307,
                "node_id": "R_kgDOMZUqaw",
                "name": "squared",
                "full_name": "SquaredMade2/squared",
                "private": true,
                "description": null
            }
        }
    },
    "repository": {
        "id": 831859307,
        "node_id": "R_kgDOMZUqaw",
        "name": "squared",
        "full_name": "SquaredMade2/squared"
    },
    "organization": {
        "login": "SquaredMade2",
        "id": 177484624,
        "node_id": "O_kgDOCpQzUA"
    },
    "installation": {
        "id": 61230953,
        "node_id": "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uNjEyMzA5NTM="
    }
}`

	if _, err := os.Stat("../testdata/pull_request_payload.json"); os.IsNotExist(err) {
		os.WriteFile("../testdata/pull_request_payload.json", []byte(pullRequestPayload), 0644)
	}

	// Create sample push payload file
	pushPayload := `{
    "ref": "refs/heads/feature/testing-for-webhooks",
    "before": "8082e210b56e6e6d7e5e608c9a5b421a6936a774",
    "after": "4b5f33b5e9af104097d73d94598b4724da7294bf",
    "repository": {
        "id": 831859307,
        "node_id": "R_kgDOMZUqaw",
        "name": "squared",
        "full_name": "SquaredMade2/squared",
        "private": true,
        "created_at": 1721593293
    },
    "pusher": {
        "name": "THEjacob1000",
        "email": "jacob@jacobdevelops.com"
    },
    "commits": [
        {
            "id": "4b5f33b5e9af104097d73d94598b4724da7294bf",
            "tree_id": "fec7b4407b7893c35b4e95877d83843336c4a924",
            "distinct": true,
            "message": "fix: add missing newline in main.go for code clarity",
            "timestamp": "2025-03-01T17:12:38+11:00",
            "url": "https://github.com/SquaredMade2/squared/commit/4b5f33b5e9af104097d73d94598b4724da7294bf",
            "author": {
                "name": "THEjacob1000",
                "email": "jacob@jacobdevelops.com",
                "username": "THEjacob1000"
            },
            "committer": {
                "name": "THEjacob1000",
                "email": "jacob@jacobdevelops.com",
                "username": "THEjacob1000"
            },
            "added": [],
            "removed": [],
            "modified": [
                "apps/webhooks/main.go"
            ]
        }
    ],
    "head_commit": {
        "id": "4b5f33b5e9af104097d73d94598b4724da7294bf",
        "tree_id": "fec7b4407b7893c35b4e95877d83843336c4a924",
        "distinct": true,
        "message": "fix: add missing newline in main.go for code clarity",
        "timestamp": "2025-03-01T17:12:38+11:00",
        "url": "https://github.com/SquaredMade2/squared/commit/4b5f33b5e9af104097d73d94598b4724da7294bf",
        "author": {
            "name": "THEjacob1000",
            "email": "jacob@jacobdevelops.com",
            "username": "THEjacob1000"
        },
        "committer": {
            "name": "THEjacob1000",
            "email": "jacob@jacobdevelops.com",
            "username": "THEjacob1000"
        },
        "added": [],
        "removed": [],
        "modified": [
            "apps/webhooks/main.go"
        ]
    },
    "installation": {
        "id": 61230953,
        "node_id": "MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uNjEyMzA5NTM="
    }
}`

	if _, err := os.Stat("../testdata/push_payload.json"); os.IsNotExist(err) {
		os.WriteFile("../testdata/push_payload.json", []byte(pushPayload), 0644)
	}
}
