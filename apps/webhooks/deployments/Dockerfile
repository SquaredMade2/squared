# Build stage
FROM golang:1.24-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY main.go .
COPY gen/ ./gen/
COPY github/ ./github/
COPY vercel/ ./vercel/
COPY helpers/ ./helpers/

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