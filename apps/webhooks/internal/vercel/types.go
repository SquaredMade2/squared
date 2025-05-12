package vercel

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
