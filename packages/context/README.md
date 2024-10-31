# @squared/context

## Introduction

`@squared/context` is a TypeScript package that provides a lightweight, Go-inspired context implementation for managing request-scoped data, cancellation signals, and deadlines in JavaScript/TypeScript applications. This package is particularly useful for handling asynchronous operations, timeouts, and propagating request-specific information throughout your application.

## Concepts

### Context

A Context is an immutable object that carries request-scoped values, cancellation signals, and deadlines across API boundaries and between processes. It allows you to:

- Pass request-scoped values through your application
- Cancel operations when they're no longer needed
- Set deadlines for operations to complete

### Key Features

1. **Immutability**: Contexts are immutable. When you need to add or modify values, you create a new context derived from an existing one.
2. **Cancellation**: Contexts can be associated with cancellation signals, allowing you to propagate cancellation through your application.
3. **Deadlines**: You can set deadlines on contexts, automatically cancelling operations that exceed the specified time limit.
4. **Request ID**: Contexts can carry a unique request ID, useful for tracing and logging.

## API Reference

### Types

- `Context`: The main context type.
- `Abortable`: A type representing a context with an abort function.

### Constants

- `background`: A root context with no values or cancellation.
- `TODO`: A placeholder context for when it's unclear which context to use.

### Functions

- `withValues(parent: Context, values: object): Context`: Creates a new context with additional values.
- `withAbort(parent: Context): Abortable`: Creates a new context with a cancellation signal.
- `withDeadline(parent: Context, deadline: Date | number): Abortable`: Creates a new context with a deadline.
- `withTimeout(parent: Context, duration: number): Abortable`: Creates a new context with a timeout.
- `getRequestId(ctx: Context): string | undefined`: Retrieves the request ID from a context.

## Usage Examples

### Basic Usage

```typescript
import {
  background,
  withValues,
  withTimeout,
  getRequestId,
} from "@squared/context";

// Create a context with a request ID
const ctx1 = withValues(background, { [requestIdKey]: "req-001" });

console.log(getRequestId(ctx1)); // Output: req-001

// Create a context with a timeout
const { ctx: ctx2, abort } = withTimeout(ctx1, 5000); // 5 seconds timeout

// Use the context in an async operation
async function fetchData(ctx: Context) {
  try {
    const response = await fetch("https://api.example.com/data", {
      signal: ctx.signal,
    });
    const data = await response.json();
    console.log("Data fetched:", data);
  } catch (error) {
    if (ctx.signal?.aborted) {
      console.log("Operation was aborted");
    } else {
      console.error("Error fetching data:", error);
    }
  }
}

fetchData(ctx2);

// Optionally, abort the operation manually
// abort();
```

### Using Contexts with Deadlines

```typescript
import { background, withDeadline } from "@squared/context";

const deadline = Date.now() + 10000; // 10 seconds from now
const { ctx, abort } = withDeadline(background, deadline);

async function longRunningOperation(ctx: Context) {
  for (let i = 0; i < 100; i++) {
    if (ctx.signal?.aborted) {
      console.log("Operation aborted");
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    console.log("Step", i + 1);
  }
}

longRunningOperation(ctx);
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT License](LICENSE)
