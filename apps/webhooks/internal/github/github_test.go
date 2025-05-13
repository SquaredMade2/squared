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

	"github.com/SquaredMade2/squared/apps/webhooks/internal/config"
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

func TestWebhookHandler_PullRequest(t *testing.T) {
	// Load sample pull request payload from file
	config.LoadEnv()
	pullRequestPayload, err := os.ReadFile("./testdata/pull_request_payload.json")
	if err != nil {
		fmt.Println("Error reading pull request payload:", err)
		t.Fatalf("Error reading pull request payload: %v", err)
		return
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
		t.Logf("Response body: %s", rr.Body.String())
	}
}

func TestWebhookHandler_PushCommit(t *testing.T) {
	// Load sample push commit payload from file
	pushPayload, err := os.ReadFile("./testdata/push_payload.json")
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
