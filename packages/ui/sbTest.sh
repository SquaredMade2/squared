#!/bin/bash

# Storybook Setup and Test Script
# Extracted from GitHub Actions CI Pipeline

set -e # Exit on any error

echo "🚀 Starting Storybook setup and tests..."

echo "🎭 Installing Playwright browsers..."
bunx playwright install

echo "📚 Building Storybook..."
bun run --filter=@squaredmade/ui build-storybook --quiet

echo "🧪 Starting Storybook server and running tests..."
bunx concurrently -k -s first -n "SB,TEST" -c "magenta,blue" \
    "bunx http-server storybook-static --port 6006 --silent" \
    "bunx wait-on tcp:127.0.0.1:6006 && bun test-storybook"

echo "✅ Storybook tests completed successfully!"
