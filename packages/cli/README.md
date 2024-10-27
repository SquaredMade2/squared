# Squared CLI

## Installation

### Option 1: Using `go install`

If you have Go installed, you can install the Squared CLI directly using:

```bash
go install github.com/yourusername/squared-cli@latest
```

Make sure your Go bin directory is in your PATH.

### Option 2: Using the installation script

1. Clone the repository:

   ```shell
   git clone https://github.com/yourusername/squared-cli.git
   cd squared-cli
   ```

2. Run the installation script:

   ```shell
   ./install.sh
   ```

This will build the CLI and move it to a global bin directory.

### Option 3: Manual installation

1. Clone the repository:

   ```shell
   git clone https://github.com/yourusername/squared-cli.git
   cd squared-cli
   ```

2. Build the CLI:

   ```shell
   make build
   ```

3. Move the binary to a directory in your PATH:

   ```shell
   sudo mv bin/squared /usr/local/bin/
   ```

## Usage

After installation, you can use the `squared` command globally:

```shell
squared rpc install http://localhost:5173/rpc/sprint
squared rpc list
```

## Development

For local development:

1. Clone the repository
2. Make your changes
3. Build and test locally:

   ```shell
   make build
   ./bin/squared rpc list
   ```

4. To install your local version globally:

   ```shell
   make install
   ```
