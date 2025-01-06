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
	JA4Digest    string    `json:"ja4Digest"`
	Level        LogLevel  `json:"level"`
	StatusCode   int       `json:"statusCode"`
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
	WAFAction  string   `json:"wafAction"`
	WAFRuleID  string   `json:"wafRuleId"`
}

const (
	vercelVerificationHeader = "X-Vercel-Verify-Request"
	infoColor                = "\x1b[32m" // Green
	errorColor               = "\x1b[31m" // Red
	warnColor                = "\x1b[33m" // Yellow
	resetColor               = "\x1b[0m"
)

type LogLevel string

const (
	LogLevelError LogLevel = "error"
	LogLevelWarn  LogLevel = "warn"
	LogLevelInfo  LogLevel = "info"
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
		domain := os.Getenv("DOMAIN")
		appName := strings.Split(logEntry.Host, "."+domain)[0]
		err = sendToPapertrail(papertrailAddr, formattedLog, appName)
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
	coloredLogLevel := colorize(log.Level)

	// Extract message between START and END
	message := log.Message
	startIndex := strings.Index(message, "START")
	endIndex := strings.LastIndex(message, "END")
	if startIndex != -1 && endIndex != -1 && startIndex < endIndex {
		startIndex = startIndex + len("START")
		message = strings.TrimSpace(message[startIndex:endIndex])
	}

	return fmt.Sprintf("%s %s %s",
		timestamp.Format("Jan 02 15:04:05"),
		coloredLogLevel,
		message)
}

func getColorForLevel(level LogLevel) string {
	switch level {
	case LogLevelError:
		return errorColor
	case LogLevelWarn:
		return warnColor
	default:
		return infoColor
	}
}

func colorize(level LogLevel) string {
	return fmt.Sprintf("%s%s:%s", getColorForLevel(level), level, resetColor)
}

func sendToPapertrail(addr string, message string, program string) error {
	conn, err := net.Dial("udp", addr)
	if err != nil {
		return fmt.Errorf("error connecting to Papertrail: %v", err)
	}
	defer conn.Close()

	hostname, err := os.Hostname()
	if err != nil {
		hostname = "unknown"
	}

	timestamp := time.Now().Format(time.RFC3339)

	syslogMessage := fmt.Sprintf("<%d>%s %s %s: %s", 22, timestamp, hostname, program, message)

	_, err = fmt.Fprintf(conn, "%s", syslogMessage)
	if err != nil {
		return fmt.Errorf("error sending log to Papertrail: %v", err)
	}

	return nil
}
