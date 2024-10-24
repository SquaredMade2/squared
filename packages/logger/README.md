# @squared/logger

A flexible and customizable logging utility built on top of Winston for Node.js applications.

## Features

- Supports all Winston log levels (error, warn, info, http, verbose, debug)
- Allows for custom prefixes and service names
- File logging for errors and combined logs
- Console output in non-production environments
- Customizable log formats
- String interpolation support using Node.js `util.format`

## Usage

### Basic Usage

```typescript
import createCustomLogger from "@squared/logger";

// Create a logger with default options
const logger = createCustomLogger("example");

// Use the logger
logger.info("This is an info message");
logger.error("An error occurred", { errorCode: 500 });
```

### String Interpolation

To support string interpolation in log messages, use Node.js's built-in `util.format`. You can include placeholders (`%s`, `%d`, etc.) in your log messages and pass additional arguments, just like with `console.log`:

```typescript
import util from "util";
import createCustomLogger from "@squared/logger";

const logger = createCustomLogger();

const userId = 123;
logger.info(util.format("User %d logged in", userId));
// Output: 2023-05-01T12:34:56.789Z INFO: User 123 logged in
```

## Log Levels

Each log level represents the **severity** or **type of event** being logged. The logger will only output messages at the current log level and those with a higher severity (lower numerical value). For example, if the log level is set to `info`, it will include `info`, `warn`, and `error` messages, but not `debug` or `verbose` messages.

1. **`error` (Level 0)**:

   - **Purpose**: Logs critical failures or errors that prevent a system or application from functioning properly.
   - **Use Cases**: When a request fails, an uncaught exception occurs, or a critical issue impacts the system's ability to operate.
   - **Example**:

     ```typescript
     logger.error("Database connection failed", { errorCode: 500 });
     ```

2. **`warn` (Level 1)**:

   - **Purpose**: Logs potential issues that could become problems in the future but don't stop the system from functioning.
   - **Use Cases**: When something unexpected happens, or when the application is functioning but at risk.
   - **Example**:

     ```typescript
     logger.warn("Memory usage is nearing the limit", {
       memoryUsage: "90%",
     });
     ```

3. **`info` (Level 2)**:

   - **Purpose**: Logs general information about the application's operation, such as state changes or major events.
   - **Use Cases**: Informational messages about application events, such as successful requests, system startups, or configurations.
   - **Example**:

     ```typescript
     logger.info("User logged in", { userId: 123 });
     ```

4. **`http` (Level 3)**:

   - **Purpose**: Logs HTTP requests and responses, often used to track API traffic or web server interactions.
   - **Use Cases**: Logging incoming requests, response times, or status codes for monitoring web server activity.
   - **Example**:

     ```typescript
     logger.http("GET /api/users - 200 OK", { duration: "200ms" });
     ```

5. **`verbose` (Level 4)**:

   - **Purpose**: Logs detailed messages for tracing the flow through the application, providing insight into application behavior.
   - **Use Cases**: Useful during development or debugging when you need more detailed information about the app's inner workings.
   - **Example**:

     ```typescript
     logger.verbose("Processing user login", { userId: 123 });
     ```

6. **`debug` (Level 5)**:

   - **Purpose**: Logs information helpful for debugging, such as detailed state changes, variable values, or function calls.
   - **Use Cases**: Typically used for debugging the codebase to help pinpoint issues during development or while diagnosing production problems.
   - **Example**:

     ```typescript
     logger.debug("Variable x has value", { x: 42 });
     ```

### How to Use Log Levels

You can set the log level by configuring the `LOG_LEVEL` environment variable. If it is not set, it defaults to `info`, which means `info`, `warn`, and `error` messages will be logged, but not `debug` or `verbose`.

- **Production**: Commonly set to `warn` or `error` to reduce noise and focus on issues.
- **Development**: Often set to `debug` or `verbose` for detailed logging of application behavior.

By adjusting the log level, you can control how much information is logged and prevent excessive or irrelevant logging in certain environments (e.g., production vs. development).

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
