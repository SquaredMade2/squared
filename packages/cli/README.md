# Squared CLI

Squared CLI is a command-line interface tool for managing RPC services in the Squared ecosystem.

## Features

- Install and update RPC services
- List installed services
- Generate TypeScript client code for RPC services

## Prerequisites

Before you begin, ensure you have the following installed:

- Go (version 1.16 or later)
- Node.js (version 14 or later)
- pnpm (version 6 or later)

## Installation

Build the project:

```bash
pnpm build
```

Run the installation script:

```bash
./install.sh
```

This script will build the Go binary and install it in a directory that's in your PATH.

Verify the installation:

```bash
squared --version
```

## Usage

### Installing an RPC Service

To install or update an RPC service:

```bash
squared rpc install <service-url>
```

Example:

```bash
squared rpc install http://localhost:5173/rpc/sprint
```

This command will fetch the service information, save it locally, and generate a TypeScript client file in the `gen/rpc` directory.

### Listing Installed Services

To list all installed services:

```bash
squared rpc list
```

## Development

### Project Structure

- `main.go`: Entry point of the CLI application
- `rpc_handlers.go`: Contains the logic for RPC service management
- `install.sh`: Installation script

### Building

To build the project:

```bash
pnpm build
```

This command will compile the Go code and generate the `squared` binary.

### Testing

To run tests:

```bash
go test ./...
```
