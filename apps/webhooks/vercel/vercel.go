package vercel

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
	"regexp"
	"strconv"
	"strings"
	"time"
)

var logLevelToPriority = map[LogLevel]syslog.Priority{
	LogLevelError: syslog.LOG_ERR,
	LogLevelWarn:  syslog.LOG_WARNING,
	LogLevelInfo:  syslog.LOG_INFO,
}

func WebhookHandler(w http.ResponseWriter, r *http.Request) {
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

	contentType := r.Header.Get("Content-Type")
	verificationToken := r.Header.Get(vercelVerificationHeader)

	if strings.HasPrefix(contentType, "text/plain") {
		w.Header().Set("x-vercel-verify", verificationToken)
		w.WriteHeader(http.StatusOK)
	} else if strings.HasPrefix(contentType, "application/json") {
		// Compute the HMAC
		signature := r.Header.Get(vercelSignature)
		if !verifyHMAC(body, signature, integrationSecret) {
			log.Println("Signature verification failed")
			http.Error(w, "Invalid signature", http.StatusUnauthorized)
			return
		}
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

func handleLogs(w http.ResponseWriter, body []byte) {
	var logs []VercelLog
	err := json.Unmarshal(body, &logs)
	if err != nil {
		log.Printf("Error parsing JSON: %v", err)
		http.Error(w, "Error parsing JSON", http.StatusBadRequest)
		return
	}

	papertrailAddr := os.Getenv("PAPERTRAIL_URL")
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

func formatLog(log VercelLog) string {
	var status int
	var builder strings.Builder
	coloredLogLevel := colorize(log.Level)

	// Common parts for all log levels
	builder.WriteString(fmt.Sprintf(
		"%s ",
		coloredLogLevel,
	))

	if log.Level == "error" {
		// For error logs, extract statusCode from the message and add the full error message
		status = extractStatusCodeFromErrorMessage(log.Message)
		builder.WriteString(fmt.Sprintf("status=%d path=%s error_message=%s", status, log.Path, sanitizeErrorMessage(log.Message)))
	} else {
		// For non-error logs, use the statusCode from the log struct
		status = log.StatusCode
		builder.WriteString(fmt.Sprintf("status=%d ", status))
		// Add duration for non-error logs
		duration := extractDuration(log.Message)
		if duration != "" && log.Level == LogLevelInfo {
			builder.WriteString(fmt.Sprintf("time=%s ", duration))
		}
		builder.WriteString(fmt.Sprintf("[%s] path=%s", log.Proxy.Method, log.Proxy.Path))
	}

	// Remove trailing space and return the final string
	return strings.TrimSpace(builder.String())
}

var durationRegex = regexp.MustCompile(`Duration:\s*(\d+(\.\d+)?)\s*(ms|s|m|h)`)
var statusCodeValueRegex = regexp.MustCompile(`statusCode:\s*(\d+)`)
var statusCodeRemoveRegex = regexp.MustCompile(`\{\s*statusCode\s*:\s*\d+\s*\}$`)

func extractDuration(log string) string {
	// Use regex to find the first match for duration
	match := durationRegex.FindStringSubmatch(log)
	if len(match) > 2 {
		return fmt.Sprintf("%s%s", match[1], match[3])
	}
	return "-1ms"
}

func sanitizeErrorMessage(message string) string {
	// Replace newlines with spaces and remove trailing statusCode
	message = strings.ReplaceAll(message, "\n", " ")
	message = statusCodeRemoveRegex.ReplaceAllString(message, "")

	// Trim leading/trailing whitespace and normalize multiple spaces
	message = strings.TrimSpace(message)
	message = strings.Join(strings.Fields(message), " ")

	return message
}

func extractStatusCodeFromErrorMessage(message string) int {
	matches := statusCodeValueRegex.FindStringSubmatch(message)
	if len(matches) > 1 {
		statusCode, err := strconv.Atoi(matches[1])
		if err == nil {
			return statusCode
		}
	}
	return 0
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
	return fmt.Sprintf("%s%s%s:", getColorForLevel(level), level, resetColor)
}

func sendToPapertrail(writer *syslog.Writer, log VercelLog, message string) error {
	timestamp := time.Unix(0, log.Timestamp*int64(time.Millisecond)).Format("Jan 02 15:04:05")
	logMessage := fmt.Sprintf("%s %s", timestamp, message)

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
