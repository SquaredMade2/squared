# Go project Makefile

# Load environment variables from .env file if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

# Variables
WEBHOOKS_APP_NAME = webhooks
WEBHOOKS_APP_PATH = ./cmd/webhooks
BOT_APP_NAME = bot
BOT_APP_PATH = ./cmd/bot
GO_CMD = go
GO_BUILD = $(GO_CMD) build
GO_CLEAN = $(GO_CMD) clean
GO_TEST = $(GO_CMD) test
GO_GET = $(GO_CMD) get
GO_MOD = $(GO_CMD) mod
WEBHOOKS_BINARY = $(WEBHOOKS_APP_NAME)
BOT_BINARY = $(BOT_APP_NAME)
WEBHOOKS_BINARY_UNIX = $(WEBHOOKS_APP_NAME)_unix
BOT_BINARY_UNIX = $(BOT_APP_NAME)_unix

# Default target
.PHONY: all
all: test build

# Build both applications
.PHONY: build
build: build-webhooks build-bot

# Build webhooks app
.PHONY: build-webhooks
build-webhooks:
	$(GO_BUILD) -o $(WEBHOOKS_BINARY) $(WEBHOOKS_APP_PATH)

# Build bot app
.PHONY: build-bot
build-bot:
	$(GO_BUILD) -o $(BOT_BINARY) $(BOT_APP_PATH)

# Build for multiple platforms
.PHONY: build-linux
build-linux: build-webhooks-linux build-bot-linux

# Build webhooks for Linux
.PHONY: build-webhooks-linux
build-webhooks-linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GO_BUILD) -o $(WEBHOOKS_BINARY_UNIX) $(WEBHOOKS_APP_PATH)

# Build bot for Linux
.PHONY: build-bot-linux
build-bot-linux:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 $(GO_BUILD) -o $(BOT_BINARY_UNIX) $(BOT_APP_PATH)

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
	rm -f $(WEBHOOKS_BINARY)
	rm -f $(BOT_BINARY)
	rm -f $(WEBHOOKS_BINARY_UNIX)
	rm -f $(BOT_BINARY_UNIX)
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

# Run staticcheck (replaces golint which is deprecated)
.PHONY: lint
lint:
	staticcheck ./...

# Run webhooks application
.PHONY: run-webhooks
run-webhooks:
	$(GO_CMD) run $(WEBHOOKS_APP_PATH)/main.go

# Run bot application
.PHONY: run-bot
run-bot:
	$(GO_CMD) run $(BOT_APP_PATH)/main.go

# Legacy run command (runs bot for backward compatibility)
.PHONY: run
run: run-bot

# Run with explicit environment file
.PHONY: run-with-env
run-with-env:
	@if [ ! -f .env ]; then echo "Warning: .env file not found"; fi
	$(MAKE) run

# Run webhooks in development mode with hot reload
.PHONY: dev-webhooks
dev-webhooks:
	@which air > /dev/null || (echo "Installing air..." && go install github.com/air-verse/air@latest)
	@export PATH="$(shell go env GOPATH)/bin:$$PATH" && air -c .air.webhooks.toml

# Run bot in development mode with hot reload
.PHONY: dev-bot
dev-bot:
	@which air > /dev/null || (echo "Installing air..." && go install github.com/air-verse/air@latest)
	@export PATH="$(shell go env GOPATH)/bin:$$PATH" && air -c .air.bot.toml

# Legacy dev command (runs webhooks dev for backward compatibility)
.PHONY: dev
dev: dev-webhooks

# Start webhooks server in background
.PHONY: start-webhooks
start-webhooks: build-webhooks
	./$(WEBHOOKS_BINARY) &

# Start bot in background
.PHONY: start-bot
start-bot: build-bot
	./$(BOT_BINARY) &

# Legacy start command (starts bot)
.PHONY: start
start: start-bot

# Stop webhooks server
.PHONY: stop-webhooks
stop-webhooks:
	pkill -f $(WEBHOOKS_BINARY) || true

# Stop bot
.PHONY: stop-bot
stop-bot:
	pkill -f $(BOT_BINARY) || true

# Stop all applications
.PHONY: stop
stop: stop-webhooks stop-bot

# Restart webhooks server
.PHONY: restart-webhooks
restart-webhooks: stop-webhooks start-webhooks

# Restart bot
.PHONY: restart-bot
restart-bot: stop-bot start-bot

# Restart all applications
.PHONY: restart
restart: stop start-webhooks start-bot

# Check if webhooks is running
.PHONY: status-webhooks
status-webhooks:
	pgrep -f $(WEBHOOKS_BINARY) || echo "Webhooks server not running"

# Check if bot is running
.PHONY: status-bot
status-bot:
	pgrep -f $(BOT_BINARY) || echo "Bot not running"

# Check status of all applications
.PHONY: status
status: status-webhooks status-bot

# Create a release build for both apps
.PHONY: release
release: clean test
	CGO_ENABLED=0 $(GO_BUILD) -ldflags="-w -s" -o $(WEBHOOKS_BINARY) -v $(WEBHOOKS_APP_PATH)
	CGO_ENABLED=0 $(GO_BUILD) -ldflags="-w -s" -o $(BOT_BINARY) -v $(BOT_APP_PATH)

# Generate documentation
.PHONY: docs
docs:
	@echo "Starting documentation server on http://localhost:6060"
	@echo "Press Ctrl+C to stop"
	@which pkgsite > /dev/null || (echo "Installing pkgsite..." && go install golang.org/x/pkgsite/cmd/pkgsite@latest)
	pkgsite -http=:6060

# Security check with gosec
.PHONY: security
security:
	@which gosec > /dev/null || (echo "Installing gosec..." && go install github.com/securecodewarrior/gosec/v2/cmd/gosec@latest)
	gosec ./...

# Update all dependencies
.PHONY: update
update:
	$(GO_GET) -u ./...
	$(GO_MOD) tidy

# Install both binaries to GOPATH/bin
.PHONY: install
install: build
	$(GO_CMD) install $(WEBHOOKS_APP_PATH)
	$(GO_CMD) install $(BOT_APP_PATH)

# Docker targets
.PHONY: docker-build-webhooks
docker-build-webhooks:
	docker build --build-arg APP=webhooks -t $(WEBHOOKS_APP_NAME) .

.PHONY: docker-build-bot
docker-build-bot:
	docker build --build-arg APP=bot -t $(BOT_APP_NAME) .

.PHONY: docker-build
docker-build: docker-build-webhooks docker-build-bot

.PHONY: docker-up
docker-up:
	docker-compose up -d

.PHONY: docker-down
docker-down:
	docker-compose down

# Show help
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  all               - Run tests and build both apps"
	@echo "  build             - Build both applications"
	@echo "  build-webhooks    - Build webhooks app"
	@echo "  build-bot         - Build bot app"
	@echo "  build-linux       - Build both apps for Linux"
	@echo "  build-webhooks-linux - Build webhooks for Linux"
	@echo "  build-bot-linux   - Build bot for Linux"
	@echo "  test              - Run tests"
	@echo "  test-coverage     - Run tests with coverage"
	@echo "  test-race         - Run tests with race detector"
	@echo "  clean             - Clean build artifacts"
	@echo "  deps              - Download dependencies"
	@echo "  tidy              - Tidy go modules"
	@echo "  fmt               - Format code"
	@echo "  lint              - Run staticcheck"
	@echo "  run-webhooks      - Run webhooks application"
	@echo "  run-bot           - Run bot application"
	@echo "  run               - Run bot (legacy, same as run-bot)"
	@echo "  dev-webhooks      - Run webhooks with hot reload"
	@echo "  dev-bot           - Run bot with hot reload"
	@echo "  dev               - Run bot with hot reload (legacy)"
	@echo "  start-webhooks    - Start webhooks in background"
	@echo "  start-bot         - Start bot in background"
	@echo "  start             - Start bot in background (legacy)"
	@echo "  stop-webhooks     - Stop webhooks server"
	@echo "  stop-bot          - Stop bot"
	@echo "  stop              - Stop all applications"
	@echo "  restart-webhooks  - Restart webhooks"
	@echo "  restart-bot       - Restart bot"
	@echo "  restart           - Restart all applications"
	@echo "  status-webhooks   - Check webhooks status"
	@echo "  status-bot        - Check bot status"
	@echo "  status            - Check status of all apps"
	@echo "  install           - Install both binaries"
	@echo "  release           - Create release builds"
	@echo "  docs              - Generate documentation"
	@echo "  security          - Run security check"
	@echo "  update            - Update all dependencies"
	@echo "  help              - Show this help message"