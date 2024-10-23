# @squared/logger

A flexible and customizable logging utility built on top of Winston for Node.js applications.

## Features

- Supports all Winston log levels (error, warn, info, http, verbose, debug, silly)
- Allows for custom prefixes and service names
- File logging for errors and combined logs
- Console output in non-production environments
- Customizable log formats

## Usage

### Basic Usage

```typescript
import createCustomLogger from "@squared/logger";

// Create a logger with default options
const logger = createCustomLogger();

// Use the logger
logger.info("This is an info message");
logger.error("An error occurred", { errorCode: 500 });
```

### Custom Configuration

You can customize the logger by providing options:

```typescript
import createCustomLogger from "@squared/logger";

const userLogger = createCustomLogger({
  service: "user-service",
  prefix: "USER",
});

userLogger.info("User logged in", { userId: 123 });
// Output: 2023-05-01T12:34:56.789Z INFO: [USER] User logged in {"userId":123,"service":"user-service"}
```

### Available Options

- `service`: A string to identify the service or module using the logger (default: "default-service")
- `prefix`: A string to prefix all log messages (default: "")

### Log Levels

The logger supports the following log levels (in order of priority):

1. error
2. warn
3. info
4. http
5. verbose
6. debug

You can set the log level using the `LOG_LEVEL` environment variable. If not set, it defaults to "info".

## File Logging

By default, the logger writes logs to two files:

- `error.log`: Contains only error-level logs
- `combined.log`: Contains all logs

These files are created in the root directory of the project.

## Console Output

In non-production environments (`NODE_ENV !== "production"`), logs are also output to the console with color-coding for better readability.

## Customization

If you need further customization, you can modify the `src/index.ts` file in this package. Remember to rebuild the package after making changes:

```bash
pnpm build
```
