package main

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"strings"
	"testing"
)

var testInfo = `[
  {
    "id": "14200428160173611673229830100000",
    "message": "START RequestId: ea90391d-17db-4dd7-80b3-a96ae1f2c5d9\n[POST] /api/auth/_log?nxtPnextauth=_log status=200\nEND RequestId: ea90391d-17db-4dd7-80b3-a96ae1f2c5d9\nREPORT RequestId: ea90391d-17db-4dd7-80b3-a96ae1f2c5d9 Duration: 10 ms Billed Duration: 11 ms Memory Size: 1769 MB Max Memory Used: 105 MB",
    "timestamp": 1736116732298,
    "type": "stdout",
    "requestId": "5ls5b-1736116732233-c4964b146b0d",
    "executionRegion": "iad1",
    "statusCode": 200,
    "level": "info",
    "proxy": {
      "timestamp": 1736116732233,
      "method": "POST",
      "host": "app-develop.squaredmade.com",
      "path": "/api/auth/_log",
      "statusCode": 200,
      "scheme": "https",
      "userAgent": [
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1"
      ],
      "referer": "https://app-develop.squaredmade.com/join/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3b3Jrc3BhY2VJZCI6IjNmMTAyYTA2LTkxNjMtNDIxNy04N2E3LWQ4N2NiYmFmN2FlMyIsImVtYWlsIjpbIkJyZXQubWlsbGVyMjAxMEBnbWFpbC5jb20iXSwiaWF0IjoxNzM1Nzc1NjUwLCJleHAiOjE3MzU3NzkyNTB9.UxZMWYXg1S71LBhPj1rY0aghqcNvDZSVWs8h6FVDZl8",
      "clientIp": "98.215.224.111",
      "region": "cle1",
      "lambdaRegion": "iad1",
      "vercelCache": "MISS",
      "pathType": "streaming_func"
    },
    "projectId": "prj_HZL7X5W1EBoQXDU1Hvt7DRUiOybn",
    "projectName": "web",
    "deploymentId": "dpl_DCYJDwZqh3YN7TxSPpZpC3QoWcTB",
    "source": "lambda",
    "host": "app-develop.squaredmade.com",
    "path": "/api/auth/[...nextauth]",
    "environment": "preview",
    "branch": "develop"
  }
]`

var testWarning = `[{
    "id": "48908794170173621812800240300000",
    "timestamp": 1736218128002,
    "requestId": "bqnxl-1736218127989-178a04392bcc",
    "message": "START RequestId: 94bfce28-30d9-46bf-8553-bb81de2ed082\n[GET] /api/auth/link status=403\nEND RequestId: 94bfce28-30d9-46bf-8553-bb81de2ed082\nREPORT RequestId: 94bfce28-30d9-46bf-8553-bb81de2ed082 Duration: 217 ms Billed Duration: 218 ms Memory Size: 1024 MB Max Memory Used: 124 MB",
    "proxy": {
        "timestamp": 1736218127989,
        "region": "syd1",
        "method": "GET",
        "statusCode": 403,
        "referer": "",
        "path": "/api/auth/link",
        "host": "web-ordering-a545a5h3i-loke.vercel.app",
        "scheme": "https",
        "clientIp": "120.148.192.127",
        "userAgent": [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ],
        "wafAction": "",
        "wafRuleId": ""
    },
    "projectId": "QmWoAtyPjr3Prb7CcCGn6jEmLKe6wsGHDcha13AdvMsmmW",
    "deploymentId": "dpl_9yAQy2fFxLwqiJEWThWQnU4seEMQ",
    "source": "lambda",
    "host": "web-ordering-a545a5h3i-loke.vercel.app",
    "path": "/api/auth/link",
    "ja4Digest": "",
    "level": "warning",
    "statusCode": 403,
    "projectName": "web-ordering"
}]`

var testError = `[{
    "id": "23170378480173621896732031900000",
    "timestamp": 1736218967320,
    "requestId": "bb2qd-1736218967185-2e59be4983da",
    "message": "Authentication error: Error: Invalid state parameter\n    at t_ (.next/server/app/api/auth/callback/route.js:1:31378) {\n  statusCode: 400\n}",
    "proxy": {
        "timestamp": 1736218967185,
        "region": "syd1",
        "method": "GET",
        "statusCode": 0,
        "referer": "",
        "path": "/api/auth/callback?code=rbqtb9RmNB_N2kFIy1d_ROpHufq1GaCEJ9hN1G9yKak.vxcoO52DZn76i4J2cxPkmxKcV_VBB-dKW7ILyCzIUf0\u0026scope=openid\u0026state=jZ786QTA2YRNgdQg0UVGovWSLpVg_vd7YMUvCWb5p_s",
        "host": "manager.loke.global",
        "scheme": "https",
        "clientIp": "120.148.192.127",
        "userAgent": [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
        ],
        "wafAction": "",
        "wafRuleId": ""
    },
    "projectId": "prj_KXug9DFhXp2WLVrKn0kWe3P53WQq",
    "deploymentId": "dpl_Dv4CkEEm3hkw5VPxHcKKMZ8JPvuQ",
    "source": "lambda",
    "host": "manager.loke.global",
    "path": "/api/auth/callback",
    "ja4Digest": "",
    "level": "error",
    "statusCode": 0,
    "projectName": "loke-manager"
}]`

func TestMain(m *testing.M) {
	// Setup
	os.Setenv("PORT", "3131")
	os.Setenv("VERCEL_SIGNATURE", "test-signature")
	os.Setenv("STAGING_PAPERTRAIL_URL", "staging.logs.papertrailapp.com:12345")
	os.Setenv("PROD_PAPERTRAIL_URL", "prod.logs.papertrailapp.com:12345")

	// Run tests
	code := m.Run()

	// Teardown
	os.Unsetenv("PORT")
	os.Unsetenv("VERCEL_SIGNATURE")
	os.Unsetenv("STAGING_PAPERTRAIL_URL")
	os.Unsetenv("PROD_PAPERTRAIL_URL")

	os.Exit(code)
}

func TestHandleRequest(t *testing.T) {
	tests := []struct {
		name            string
		method          string
		contentType     string
		vercelSignature string
		body            string
		expectedStatus  int
	}{
		{"Valid Verification", "GET", "text/plain", "test-signature", "", http.StatusOK},
		{"Valid JSON Info", "POST", "application/json", "test-signature", testInfo, http.StatusOK},
		{"Valid JSON Warning", "POST", "application/json", "test-signature", testWarning, http.StatusOK},
		{"Valid JSON Error", "POST", "application/json", "test-signature", testError, http.StatusOK},
		{"Unsupported Content-Type", "POST", "application/xml", "test-signature", "", http.StatusUnsupportedMediaType},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			var body io.Reader
			if tt.body != "" {
				body = strings.NewReader(tt.body)
			} else {
				body = strings.NewReader("")
			}

			req, err := http.NewRequest(tt.method, "/", body)
			if err != nil {
				t.Fatal(err)
			}

			req.Header.Set("Content-Type", tt.contentType)

			if tt.body != "" {
				req.Header.Set(vercelSignature, computeHMAC(tt.body, "test-signature"))
			} else {
				req.Header.Set(vercelSignature, computeHMAC("", "test-signature"))
			}

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(handleRequest)

			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("Request handler returned wrong status code: got %v want %v", status, tt.expectedStatus)
			}
		})
	}
}

func TestHandleLogs(t *testing.T) {
	tests := []struct {
		name           string
		body           string
		expectedStatus int
	}{
		{"Info Log", testInfo, http.StatusOK},
		{"Warning Log", testWarning, http.StatusOK},
		{"Error Log", testError, http.StatusOK},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, err := http.NewRequest("POST", "/", strings.NewReader(tt.body))
			if err != nil {
				t.Fatal(err)
			}

			req.Header.Set("Content-Type", "application/json")
			req.Header.Set(vercelSignature, "test-signature")

			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				body, err := io.ReadAll(r.Body)
				if err != nil {
					http.Error(w, "Failed to read request body", http.StatusInternalServerError)
					return
				}
				handleLogs(w, body)
			})

			handler.ServeHTTP(rr, req)

			if status := rr.Code; status != tt.expectedStatus {
				t.Errorf("Log handler returned wrong status code: got %v want %v", status, tt.expectedStatus)
			}
		})
	}
}

func TestFormatLog(t *testing.T) {
	var logs []VercelLog
	err := json.Unmarshal([]byte(testInfo), &logs)
	if err != nil {
		t.Fatalf("Failed to unmarshal testInfo: %v", err)
	}

	if len(logs) == 0 {
		t.Fatalf("No log entries in testInfo data")
	}

	log := logs[0]

	formatted := formatLog(log)
	expected := "Jan 02 15:04:05 \x1b[32minfo:\x1b[0m [GET] /21213/cart/pay status=200"

	if formatted != expected {
		t.Errorf("formatLog() = %v, want %v", formatted, expected)
	}
}

func TestGetPapertrailAddr(t *testing.T) {
	tests := []struct {
		name        string
		isStaging   bool
		expectedURL string
	}{
		{"Staging URL", true, "staging.logs.papertrailapp.com:12345"},
		{"Production URL", false, "prod.logs.papertrailapp.com:12345"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			url := getPapertrailAddr(tt.isStaging)
			if url != tt.expectedURL {
				t.Errorf("getPapertrailAddr() = %v, want %v", url, tt.expectedURL)
			}
		})
	}
}

func computeHMAC(body, secret string) string {
	h := hmac.New(sha1.New, []byte(secret))
	h.Write([]byte(body))
	return hex.EncodeToString(h.Sum(nil))
}
