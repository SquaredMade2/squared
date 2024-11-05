#!/bin/bash

# Build the squared CLI
go build -o squared

# Determine the appropriate bin directory
if [ -d "$HOME/.local/bin" ] && [[ ":$PATH:" == *":$HOME/.local/bin:"* ]]; then
    BIN_DIR="$HOME/.local/bin"
elif [ -d "$HOME/bin" ] && [[ ":$PATH:" == *":$HOME/bin:"* ]]; then
    BIN_DIR="$HOME/bin"
else
    BIN_DIR="/usr/local/bin"
fi

# Move the binary to the bin directory
sudo mv squared "$BIN_DIR/squared"

echo "squared CLI has been installed to $BIN_DIR/squared"
echo "Make sure $BIN_DIR is in your PATH"