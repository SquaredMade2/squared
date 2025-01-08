package main

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"log/syslog"
	"net/http"
	"os"
	"strings"
	"time"
)

type VercelLog struct {
	ID              string    `json:"id"`
	Timestamp       int64     `json:"timestamp"`
	RequestID       string    `json:"requestId"`
	Message         string    `json:"message"`
	Proxy           ProxyInfo `json:"proxy"`
	ProjectID       string    `json:"projectId"`
	DeploymentID    string    `json:"deploymentId"`
	Source          string    `json:"source"`
	Host            string    `json:"host"`
	Path            string    `json:"path"`
	Level           LogLevel  `json:"level"`
	StatusCode      int       `json:"statusCode"`
	ProjectName     string    `json:"projectName"`
	ExecutionRegion string    `json:"executionRegion"`
	Branch          string    `json:"branch"`
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
	vercelSignature          = "X-Vercel-Signature"
	infoColor                = "\x1b[32m" // Green
	errorColor               = "\x1b[31m" // Red
	warnColor                = "\x1b[33m" // Yellow
	resetColor               = "\x1b[0m"
)

type LogLevel string

const (
	LogLevelError LogLevel = "error"
	LogLevelWarn  LogLevel = "warning"
	LogLevelInfo  LogLevel = "info"
	defaultLevel           = LogLevelInfo
)

var logLevelToPriority = map[LogLevel]syslog.Priority{
	LogLevelError: syslog.LOG_ERR,
	LogLevelWarn:  syslog.LOG_WARNING,
	LogLevelInfo:  syslog.LOG_INFO,
}

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
	integrationSecret := os.Getenv("VERCEL_SIGNATURE")
	if integrationSecret == "" {
		log.Println("Missing integration secret")
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Read the raw request body
	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Error reading request body: %v", err)
		http.Error(w, "Error reading request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close()

	// Compute the HMAC
	signature := r.Header.Get(vercelSignature)
	if !verifyHMAC(body, signature, integrationSecret) {
		log.Println("Signature verification failed")
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	contentType := r.Header.Get("Content-Type")
	verificationToken := r.Header.Get(vercelVerificationHeader)

	if strings.HasPrefix(contentType, "text/plain") {
		w.Header().Set("x-vercel-verify", verificationToken)
		w.WriteHeader(http.StatusOK)
	} else if strings.HasPrefix(contentType, "application/json") {
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST method is allowed", http.StatusMethodNotAllowed)
			return
		}
		handleLogs(w, body)
	} else {
		http.Error(w, "Unsupported Content-Type", http.StatusUnsupportedMediaType)
	}
}

func verifyHMAC(body []byte, providedSignature, secret string) bool {
	h := hmac.New(sha1.New, []byte(secret))
	h.Write(body)
	expectedSignature := fmt.Sprintf("%x", h.Sum(nil))
	return hmac.Equal([]byte(providedSignature), []byte(expectedSignature))
}

func isStaging(branch string) bool {
	return !(branch == "main")
}

func handleLogs(w http.ResponseWriter, body []byte) {
	var logs []VercelLog
	err := json.Unmarshal(body, &logs)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		return
	}

	papertrailAddr := getPapertrailAddr(isStaging(logs[0].Branch))
	if papertrailAddr == "" {
		log.Printf("No Papertrail address found")
		http.Error(w, "No Papertrail address configured", http.StatusInternalServerError)
		return
	}

	for _, logEntry := range logs {
		formattedLog := formatLog(logEntry)
		priority, ok := logLevelToPriority[logEntry.Level]
		if !ok {
			priority = logLevelToPriority[defaultLevel]
		}

		writer, err := syslog.Dial("udp", papertrailAddr, priority|syslog.LOG_USER, logEntry.ProjectName)
		if err != nil {
			log.Printf("Error connecting to Papertrail: %v", err)
			continue
		}
		defer writer.Close()
		err = sendToPapertrail(writer, logEntry, formattedLog)
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

	if log.Level == "info" {
		parts := strings.Split(message, "\n")
		if len(parts) > 1 {
			message = strings.Join(parts[1:], "\n")
		}
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

func sendToPapertrail(writer *syslog.Writer, log VercelLog, message string) error {
	timestamp := time.Unix(0, log.Timestamp*int64(time.Millisecond)).Format(time.RFC3339)
	logMessage := fmt.Sprintf("%s: %s", timestamp, message)

	logFunc := getLogFunc(writer, log.Level)
	if err := logFunc(logMessage); err != nil {
		return fmt.Errorf("error sending log to Papertrail: %w", err)
	}

	return nil
}

func getLogFunc(writer *syslog.Writer, level LogLevel) func(string) error {
	switch level {
	case LogLevelError:
		return writer.Err
	case LogLevelWarn:
		return writer.Warning
	default:
		return writer.Info
	}
}
