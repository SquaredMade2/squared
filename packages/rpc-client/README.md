# @squared/rpc-client

A lightweight, TypeScript-based rpc (Remote Procedure Call) client for modern Node.js applications. This client is designed to work seamlessly with the @squared/rpc server implementation.

## Features

- TypeScript-first implementation
- Context management using @squared/context
- Built-in error handling
- Support for request timeouts and deadlines
- Easy-to-use API for making RPC calls
- Axios-based HTTP requests

## Usage

### Basic Usage

Here's a simple example of how to use the RPCClient:

```typescript
import { RPCClient } from "@squared/rpc-client";

const client = new RPCClient("http://api.example.com", "userService");

async function getUser(userId: string) {
  try {
    const user = await client.request("getUser", { id: userId });
    console.log(user);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

getUser("123");
```

### Using Context

If you need to pass context (e.g., for request ID or deadline), you can use the RPCContextClient:

```typescript
import { RPCContextClient } from "@squared/rpc-client";
import * as context from "@squared/context";

const client = new RPCContextClient(
  "http://api.example.com",
  "userService"
);

async function createUser(ctx: context.Context, userData: any) {
  try {
    const newUser = await client.request(ctx, "createUser", userData);
    console.log("New user created:", newUser);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

// Create a context with a deadline
const { ctx, abort } = context.withTimeout(context.background, 5000);

createUser(ctx, { name: "John Doe", email: "john@example.com" });

// Don't forget to abort the context when you're done
abort();
```

## API Reference

### RPCClient

```typescript
class RPCClient {
  constructor(baseURL: string, serviceName: string);
  request(
    methodName: string,
    params: Record<string, any>,
    options?: RequestOptions
  ): Promise<any>;
}
```

### RPCContextClient

```typescript
class RPCContextClient {
  constructor(baseURL: string, serviceName: string);
  request(
    ctx: Context,
    methodName: string,
    params: Record<string, any>
  ): Promise<any>;
}
```

### RequestOptions

```typescript
interface RequestOptions {
  timeout?: number;
}
```

## Error Handling

The client throws `RpcResponseError` for errors returned by the server. You can catch and handle these errors as follows:

```typescript
import { RpcResponseError } from "@squared/rpc-client";

try {
  const result = await client.request("someMethod", {
    param: "value",
  });
} catch (error) {
  if (error instanceof RpcResponseError) {
    console.error("RPC Error:", error.message);
    console.error("Error Type:", error.type);
    console.error("Error Code:", error.code);
  } else {
    console.error("Unexpected error:", error);
  }
}
```
