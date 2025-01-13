# Build stage
FROM golang:1.23-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy go mod file
COPY go.mod ./

# Copy the source code
COPY main.go .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -o main .

# Final stage
FROM gcr.io/distroless/static-debian12:latest-amd64

# Set the working directory
WORKDIR /root/

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose the port the app runs on
EXPOSE 3131

# Command to run the executable
CMD ["./main"]