# Go project Makefile

# Load environment variables from .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Variables
APP_NAME = webhooks
APP_PATH = cmd/webhooks
GO_CMD = go
GO_BUILD = $(GO_CMD) build
GO_CLEAN = $(GO_CMD) clean
GO_TEST = $(GO_CMD) test
GO_GET = $(GO_CMD) get
GO_MOD = $(GO_CMD) mod
BINARY_NAME = $(APP_NAME)
BINARY_UNIX = $(BINARY_NAME)_unix

# Default target
.PHONY: all
all: test build

# Build the binary
.PHONY: build
build:
	$(GO_BUILD) -o $(BINARY_NAME) $(APP_PATH)

# Build for multiple platforms
.PHONY: build-linux
build-linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GO_BUILD) -o $(BINARY_UNIX) $(APP_PATH)

# Test the project
.PHONY: test
test:
	$(GO_TEST) -v ./...

# Test with coverage
.PHONY: test-coverage
test-coverage:
	$(GO_TEST) -v -coverprofile=coverage.out ./...
	$(GO_CMD) tool cover -html=coverage.out

# Run tests with race detector
.PHONY: test-race
test-race:
	$(GO_TEST) -v -race ./...

# Clean build artifacts
.PHONY: clean
clean:
	$(GO_CLEAN)
	rm -f $(BINARY_NAME)
	rm -f $(BINARY_UNIX)
	rm -f coverage.out

# Install dependencies
.PHONY: deps
deps:
	$(GO_MOD) download
	$(GO_MOD) verify

# Tidy go modules
.PHONY: tidy
tidy:
	$(GO_MOD) tidy

# Format code
.PHONY: fmt
fmt:
	$(GO_CMD) fmt ./...

# Run golint (assumes golint is installed)
.PHONY: lint
lint:
	staticcheck ./...

# Run the application with environment variables
.PHONY: run
run:
	$(GO_CMD) run cmd/bot/main.go

# Run with explicit environment file
.PHONY: run-with-env
run-with-env:
	@if [ ! -f .env ]; then echo "Warning: .env file not found"; fi
	$(MAKE) run

# Run in development mode with environment
.PHONY: dev
dev:
	@which air > /dev/null || (echo "Installing air..." && go install github.com/air-verse/air@latest)
	air

# Start the server in background
.PHONY: start
start: build
	./$(BINARY_NAME) &

# Stop a running server
.PHONY: stop
stop:
	pkill -f $(BINARY_NAME) || true

# Restart the server
.PHONY: restart
restart: stop start

# Check if server is running
.PHONY: status
status:
	pgrep -f $(BINARY_NAME) || echo "Server not running"

# Create a release build
.PHONY: release
release: clean test
	CGO_ENABLED=0 $(GO_BUILD) -ldflags="-w -s" -o $(BINARY_NAME) -v ./...

# Generate documentation
.PHONY: docs
docs:
	@echo "Starting documentation server on http://localhost:6060"
	@echo "Press Ctrl+C to stop"
	@which pkgsite > /dev/null || (echo "Installing pkgsite..." && go install golang.org/x/pkgsite/cmd/pkgsite@latest)
	pkgsite -http=:6060

# Security check with gosec (assumes gosec is installed)
.PHONY: security
security:
	@which gosec > /dev/null || (echo "Installing gosec..." && go install github.com/securecodewarrior/gosec/v2/cmd/gosec@latest)
	gosec ./...

# Update all dependencies
.PHONY: update
update:
	$(GO_GET) -u ./...
	$(GO_MOD) tidy

# Show help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all           - Run tests and build"
	@echo "  build         - Build the binary"
	@echo "  build-linux   - Build for Linux"
	@echo "  test          - Run tests"
	@echo "  test-coverage - Run tests with coverage"
	@echo "  test-race     - Run tests with race detector"
	@echo "  clean         - Clean build artifacts"
	@echo "  deps          - Download dependencies"
	@echo "  tidy          - Tidy go modules"
	@echo "  fmt           - Format code"
	@echo "  lint          - Run golint"
	@echo "  staticcheck   - Run staticcheck"
	@echo "  golangci-lint - Run golangci-lint"
	@echo "  run           - Run the application"
	@echo "  dev           - Run with hot reload"
	@echo "  install       - Install the binary"
	@echo "  release       - Create a release build"
	@echo "  docs          - Generate documentation"
	@echo "  security      - Run security check"
	@echo "  update        - Update all dependencies"
	@echo "  help          - Show this help message"