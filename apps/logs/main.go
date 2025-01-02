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

func main() {
	http.HandleFunc("/", handleLogs)
	port := os.Getenv("PORT")
	if port == "" {
		port = "3131"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func handleLogs(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}

	var logs []VercelLog
	err = json.Unmarshal(body, &logs)
	if err != nil {
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		return
	}

	for _, logEntry := range logs {
		papertrailAddr := getPapertrailAddr(logEntry.Type)
		if papertrailAddr == "" {
			log.Printf("No Papertrail address found for environment: %s", logEntry.Type)
			continue
		}

		formattedLog := formatLog(logEntry)
		err = sendToPapertrail(papertrailAddr, formattedLog)
		if err != nil {
			log.Printf("Error sending log to Papertrail: %v", err)
		}
	}

	w.WriteHeader(http.StatusOK)
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
