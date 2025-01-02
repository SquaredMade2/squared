package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

type VercelLog struct {
	ID           string    `json:"id"`
	Timestamp    int64     `json:"timestamp"`
	RequestID    string    `json:"requestId"`
	Message      string    `json:"message"`
	Proxy        ProxyInfo `json:"proxy"`
	ProjectID    string    `json:"projectId"`
	DeploymentID string    `json:"deploymentId"`
	Source       string    `json:"source"`
	Host         string    `json:"host"`
	Path         string    `json:"path"`
	Ja4Digest    string    `json:"ja4Digest"`
}

type ProxyInfo struct {
	Timestamp  int64    `json:"timestamp"`
	Region     string   `json:"region"`
	Method     string   `json:"method"`
	StatusCode int      `json:"statusCode"`
	Referer    string   `json:"referer"`
	Path       string   `json:"path"`
	Host       string   `json:"host"`
	Scheme     string   `json:"scheme"`
	ClientIP   string   `json:"clientIp"`
	UserAgent  []string `json:"userAgent"`
	WafAction  string   `json:"wafAction"`
	WafRuleID  string   `json:"wafRuleId"`
}

const (
	vercelVerificationHeader = "X-Vercel-Verify-Request"
	stagingPath              = "/staging"
)

func main() {
	http.HandleFunc("/", handleRequest)
	port := os.Getenv("PORT")
	if port == "" {
		port = "3131"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleRequest(w http.ResponseWriter, r *http.Request) {
	verifyToken := r.Header.Get(vercelVerificationHeader)
	expectedToken := os.Getenv("VERCEL_OWNERSHIP_TOKEN")

	if verifyToken != expectedToken {
		http.Error(w, "Invalid verification token", http.StatusUnauthorized)
		return
	}

	contentType := r.Header.Get("Content-Type")
	log.Printf("Received request with Content-Type: %s", contentType)
	log.Printf("Received request: %s %s", r.Method, r.URL.Path)

	if strings.HasPrefix(contentType, "text/plain") {
		handleVerification(w)
	} else if strings.HasPrefix(contentType, "application/json") {
		isStaging := r.URL.Path == stagingPath
		handleLogs(w, r, isStaging)
	} else {
		http.Error(w, "Unsupported Content-Type", http.StatusUnsupportedMediaType)
	}
}

func handleVerification(w http.ResponseWriter) {
	w.Header().Set("x-vercel-verify", os.Getenv("VERCEL_OWNERSHIP_TOKEN"))
	w.WriteHeader(http.StatusOK)
}

func handleLogs(w http.ResponseWriter, r *http.Request, isStaging bool) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	log.Printf("Request body: %s", string(body))

	var logs []VercelLog
	err = json.Unmarshal(body, &logs)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		return
	}

	papertrailAddr := getPapertrailAddr(isStaging)
	if papertrailAddr == "" {
		log.Printf("No Papertrail address found")
		http.Error(w, "No Papertrail address configured", http.StatusInternalServerError)
		return
	}

	for _, logEntry := range logs {
		formattedLog := formatLog(logEntry)
		err = sendToPapertrail(papertrailAddr, formattedLog)
		if err != nil {
			log.Printf("Error sending log to Papertrail: %v", err)
		}
	}

	w.WriteHeader(http.StatusOK)
}

func getPapertrailAddr(isStaging bool) string {
	if isStaging {
		return os.Getenv("STAGING_PAPERTRAIL_URL")
	}
	return os.Getenv("PROD_PAPERTRAIL_URL")
}

func formatLog(log VercelLog) string {
	timestamp := time.Unix(0, log.Timestamp*int64(time.Millisecond))
	return fmt.Sprintf("[%s] %s - %s - %s - %s", timestamp.Format(time.RFC3339), log.ProjectID, log.Source, log.Path, log.Message)
}

func sendToPapertrail(addr string, message string) error {
	conn, err := net.Dial("udp", addr)
	if err != nil {
		return fmt.Errorf("error connecting to Papertrail: %v", err)
	}
	defer conn.Close()

	_, err = fmt.Fprintf(conn, "%s", message)
	if err != nil {
		return fmt.Errorf("error sending log to Papertrail: %v", err)
	}

	return nil
}
