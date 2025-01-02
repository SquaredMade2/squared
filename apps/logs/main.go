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
	Timestamp    time.Time `json:"timestamp"`
	ProjectID    string    `json:"projectId"`
	DeploymentID string    `json:"deploymentId"`
	Source       string    `json:"source"`
	Type         string    `json:"type"`
	Message      string    `json:"message"`
}

const vercelVerificationHeader = "X-Vercel-Verify-Request"

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
	if r.Header.Get(vercelVerificationHeader) != "" {
		verifyHandler(w, r)
		return
	}
	handleLogs(w, r)
}

func verifyHandler(w http.ResponseWriter, r *http.Request) {
	verifyToken := r.Header.Get(vercelVerificationHeader)
	if verifyToken == os.Getenv("VERCEL_OWNERSHIP_TOKEN") {
		w.Header().Set("x-vercel-verify", verifyToken)
		w.WriteHeader(http.StatusOK)
	} else {
		http.Error(w, "Invalid verification token", http.StatusUnauthorized)
	}
}

func handleLogs(w http.ResponseWriter, r *http.Request) {
	// Log request method and URL
	log.Printf("Received request: %s %s", r.Method, r.URL.Path)

	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		log.Printf("Rejected request with method: %s", r.Method)
		return
	}

	// Read the request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		log.Printf("Error reading request body: %v", err)
		return
	}
	log.Printf("Request body: %s", string(body))

	// Parse the JSON payload
	var logs []VercelLog
	err = json.Unmarshal(body, &logs)
	if err != nil {
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		log.Printf("Error parsing JSON: %v", err)
		return
	}
	log.Printf("Parsed logs: %+v", logs)

	// Process each log entry
	for _, logEntry := range logs {
		log.Printf("Processing log entry: %+v", logEntry)

		papertrailAddr := getPapertrailAddr(logEntry.Type)
		if papertrailAddr == "" {
			log.Printf("No Papertrail address found for environment: %s", logEntry.Type)
			continue
		}
		log.Printf("Papertrail address for type %s: %s", logEntry.Type, papertrailAddr)

		formattedLog := formatLog(logEntry)
		log.Printf("Formatted log: %s", formattedLog)

		// Send log to Papertrail
		err = sendToPapertrail(papertrailAddr, formattedLog)
		if err != nil {
			log.Printf("Error sending log to Papertrail: %v", err)
		} else {
			log.Printf("Log successfully sent to Papertrail at: %s", papertrailAddr)
		}
	}

	// Respond to the client
	w.WriteHeader(http.StatusOK)
	log.Printf("Response sent with status: %d", http.StatusOK)
}

func getPapertrailAddr(logType string) string {
	if strings.HasPrefix(logType, "production") {
		return os.Getenv("PROD_PAPERTRAIL_URL")
	} else if strings.HasPrefix(logType, "preview") {
		return os.Getenv("STAGING_PAPERTRAIL_URL")
	}
	return ""
}

func formatLog(log VercelLog) string {
	return fmt.Sprintf("[%s] %s - %s - %s", log.Timestamp.Format(time.RFC3339), log.ProjectID, log.Source, log.Message)
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
