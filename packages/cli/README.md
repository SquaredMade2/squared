# Squared CLI

Squared CLI is a command-line tool for managing RPC services in your Squared environment. This CLI is part of the Squared monorepo and is built using Go.

## Features

- Install RPC services by URL
- List all available RPC services

## Development

To work on the Squared CLI, navigate to the `packages/squared-cli` directory in the monorepo.

### Building

To build the CLI, run:

```bash
pnpm run build
```

This will compile the Go code and create a binary in the `bin` directory.

### Running

To run the CLI during development, use:

```bash
pnpm run start
```

This will execute the `main.go` file directly without creating a binary.

### Testing

To run tests, use:

```bash
pnpm run test
```

### Linting

To lint the Go code, use:

```bash
pnpm run lint
```

## Usage

After building the CLI, you can use it as follows:

### Install a service

```bash
./bin/squared rpc install [service_url]
```

### List all services

```bash
./bin/squared rpc list
```
