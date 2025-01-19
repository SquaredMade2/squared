# Vercel Log Processor

## Overview

The **Vercel Log Processor** is a Go application that handles logs from Vercel deployments. It validates incoming requests, processes log entries, formats them with color-coded log levels, and forwards them to Papertrail for centralized log storage and analysis.

## Features

- **Request Validation**: Verifies incoming requests using HMAC signatures.
- **Log Processing**: Parses and formats logs with colored log levels (`info`, `warning`, `error`).
- **Environment-Specific Routing**: Sends logs to staging or production Papertrail servers based on the deployment branch.
- **Papertrail Integration**: Forwards logs to Papertrail via syslog over UDP.

## Installation

### Prerequisites

- Go 1.18 or later
- Environment variables set up for:
  - `PORT`: Port number for the application (default is `3131`).
  - `VERCEL_SIGNATURE`: Shared secret for HMAC validation.
  - `STAGING_PAPERTRAIL_URL`: Papertrail URL for staging logs.
  - `PROD_PAPERTRAIL_URL`: Papertrail URL for production logs.

### Build Application

```bash
go build -o vercel-log-processor
```

## Running the Application

1. Start the application:

   ```bash
   ./vercel-log-processor
   ```

2. The server will listen on the port specified in the `PORT` environment variable (default is `3131`).

## Environment Variables

| Variable Name            | Description                                           |
|--------------------------|-------------------------------------------------------|
| `PORT`                   | Port for the application (default: `3131`).          |
| `VERCEL_SIGNATURE`       | Shared secret for validating HMAC signatures.        |
| `STAGING_PAPERTRAIL_URL` | Papertrail server address for staging logs.          |
| `PROD_PAPERTRAIL_URL`    | Papertrail server address for production logs.       |

## API Endpoints

### `/`

#### Methods

- **GET**: Verifies the integration with Vercel logs.
- **POST**: Processes logs and forwards them to Papertrail.

#### Headers

- `Content-Type`: `application/json` or `text/plain`.
- `X-Vercel-Signature`: HMAC signature of the request body.
- `X-Vercel-Verify-Request`: Token for verification.

#### Request Body

- **JSON Logs**: Array of logs in Vercel's JSON format.

#### Response Codes

| Code | Description                  |
|------|------------------------------|
| 200  | Request processed successfully. |
| 400  | Invalid JSON payload.        |
| 401  | Invalid HMAC signature.      |
| 415  | Unsupported content type.    |
| 500  | Internal server error.       |

## Log Formatting

Logs are formatted with color-coded log levels:

- **Info**: Green (`[32m`).
- **Warning**: Yellow (`[33m`).
- **Error**: Red (`[31m`).

Example formatted log:

```
Jan 02 15:04:05 [32minfo:[0m [GET] /path/to/resource status=200
```

## Development

### Running Tests

The project includes unit tests for request handling, log processing, and formatting.

1. Run the tests:

   ```bash
   go test ./...
   ```

2. Check the output to ensure all tests pass.

### Test Coverage

Key test cases include:

- Validation of HMAC signatures.
- Log formatting with colored levels.
- Routing logs to the appropriate Papertrail server.
- Error handling for invalid requests and payloads.
