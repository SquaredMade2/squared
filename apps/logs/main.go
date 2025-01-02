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
	ID        string    `json:"id"`
	Timestamp int64     `json:"timestamp"`
	ProjectID string    `json:"projectId"`
	Message   string    `json:"message"`
	Proxy     ProxyInfo `json:"proxy"`
}

type ProxyInfo struct {
	StatusCode int `json:"statusCode"`
}

const (
	vercelVerificationHeader = "X-Vercel-Verify-Request"
	infoColor                = "\x1b[38;2;99;101;12m"
	errorColor               = "\x1b[38;2;220;50;47m"
	resetColor               = "\x1b[0m"
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

	host := r.Host
	isStaging := strings.Contains(host, "dev") || strings.Contains(host, "stag")

	if strings.HasPrefix(contentType, "text/plain") {
		handleVerification(w)
	} else if strings.HasPrefix(contentType, "application/json") {
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
	appName := "my-app" // You might want to make this configurable
	logLevel := getLogLevel(log.Proxy.StatusCode)
	coloredLogLevel := colorize(logLevel, log.Proxy.StatusCode)

	return fmt.Sprintf("%s %s %s [%s] %s",
		appName,
		timestamp.Format("Jan 02 15:04:05"),
		coloredLogLevel,
		appName,
		log.Message)
}

func getLogLevel(statusCode int) string {
	if statusCode >= 400 {
		return "error:"
	}
	return "info:"
}

func colorize(logLevel string, statusCode int) string {
	if statusCode >= 400 {
		return fmt.Sprintf("%s%s%s", errorColor, logLevel, resetColor)
	}
	return fmt.Sprintf("%s%s%s", infoColor, logLevel, resetColor)
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
