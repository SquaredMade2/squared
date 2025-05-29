# Build stage
FROM golang:1.24-alpine AS builder

# Build argument to specify which app to build (default: webhooks)
ARG APP=webhooks

# Set the working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY cmd/ ./cmd/
COPY internal/ ./internal/

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -o main ./cmd/${APP}

# Final stage
FROM gcr.io/distroless/static-debian12:latest-amd64

# Set the working directory
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose the port the app runs on
# Note: You may want to adjust this based on which app you're building
EXPOSE 3131

# Command to run the executable
CMD ["./main"]