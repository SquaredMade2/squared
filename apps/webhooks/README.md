# Squared Webhooks Service

A Go-based service that handles webhooks from GitHub and Vercel, provides a Discord notification bot, and integrates with the Squared platform.

## Project Overview

The webhooks service consists of two main applications:

1. **Webhooks Server**: Handles incoming webhook events from GitHub and Vercel, processes them, and communicates with the Squared API.
2. **Discord Bot**: Provides notifications about GitHub pull requests and other events to Discord channels.

## Project Structure

```sh
├── bin/                  # Build binaries output
├── cmd/                  # Application entry points
│   ├── bot/              # Discord bot application
│   ├── webhooks/         # Webhooks server application
├── data/                 # Static data files
├── deployments/          # Deployment configurations
│   ├── Dockerfile.bot    # Docker config for bot
│   ├── Dockerfile.webhooks # Docker config for webhooks
│   └── docker-compose.yml # Docker Compose config
├── internal/             # Internal packages
│   ├── config/           # Configuration loading
│   ├── discord/          # Discord API integration
│   ├── github/           # GitHub webhook processing
│   ├── rpc/              # RPC client for API communication
│   ├── scheduler/        # Cron job scheduler for bot
│   ├── testhelpers/      # Testing utilities
│   ├── utils/            # Utility functions
│   └── vercel/           # Vercel webhook processing
├── Makefile              # Build and development commands
├── go.mod                # Go module dependencies
└── package.json          # npm scripts for monorepo integration
```

## Features

- **GitHub Webhook Processing**:
  - Pull request event handling
  - Commit/push event handling
  - GitHub App installation management
  - PR filtering and formatting

- **Vercel Integration**:
  - Deployment event handling
  - Build status notifications

- **Discord Bot**:
  - Automated PR notifications
  - Scheduled standups and reminders
  - Formatted messages with PR details

- **Integration with Squared API**:
  - Synchronization of GitHub data with Squared tasks
  - Organization and repository management
  - PR and commit tracking

## Technology Stack

- **Language**: Go 1.23.4
- **GitHub Integration**: github.com/google/go-github/v72
- **GitHub App Auth**: github.com/bradleyfalzon/ghinstallation/v2
- **Discord Integration**: github.com/bwmarrin/discordgo
- **Scheduling**: github.com/robfig/cron/v3
- **Testing**: github.com/stretchr/testify
- **Environment**: github.com/joho/godotenv
- **Concurrency**: golang.org/x/sync

## Getting Started

### Prerequisites

- Go 1.23.4 or higher
- Make
- Docker and Docker Compose (for containerized deployment)
- GitHub App credentials
- Discord Bot token (for bot functionality)

### Environment Variables

Create a `.env` file in the project root with the following variables:

```ini
# Server Configuration
PORT=3131
SERVER_URL=http://localhost:5173

# GitHub App
GITHUB_APP_PRIVATE_KEY_BASE64=<base64-encoded-private-key>
WEBHOOK_SECRET=<github-webhook-secret>

# Discord Bot (if using bot functionality)
DISCORD_TOKEN=<discord-bot-token>
DISCORD_CHANNEL_ID=<discord-channel-id>

# Schedule for notifications (cron format)
NOTIFICATION_SCHEDULE="0 9 * * 1-5"  # 9 AM on weekdays
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SquaredMade2/squared.git
   cd squared/apps/webhooks
   ```

2. Install dependencies:

   ```bash
   go mod download
   ```

3. Build the applications:

   ```bash
   make build
   ```

## Development

### Running Locally

To run the webhooks server in development mode with hot reloading:

```bash
make dev-webhooks
```

To run the Discord bot in development mode:

```bash
make dev-bot
```

### Testing

Run the test suite:

```bash
make test
```

Run tests with coverage report:

```bash
make test-coverage
```

### Available Make Commands

The project includes a comprehensive Makefile with numerous useful commands:

- `make build`: Build both applications
- `make build-webhooks`: Build only the webhooks server
- `make build-bot`: Build only the Discord bot
- `make dev`: Run the webhooks server with hot reloading (default)
- `make dev-bot`: Run the bot with hot reloading
- `make test`: Run tests
- `make fmt`: Format code
- `make lint`: Run linter
- `make docker-build`: Build Docker images
- `make docker-up`: Start Docker containers
- `make help`: Show all available commands

## Deployment

### Docker Deployment

The service can be deployed using Docker:

```bash
# Build the Docker images
make docker-build

# Start the services
make docker-up
```

Alternatively, you can use Docker Compose directly:

```bash
docker-compose -f deployments/docker-compose.yml up -d
```

### Configuration for Production

For production deployment, ensure the following:

1. Set appropriate environment variables
2. Configure proper webhook URLs in GitHub and Vercel
3. Set up Discord permissions for the bot
4. Implement proper security measures (TLS, firewall rules, etc.)

## GitHub Webhook Setup

1. Create a GitHub App with the following permissions:
   - Repository contents: Read
   - Pull requests: Read
   - Commit statuses: Read
   - Repository webhooks: Read & write

2. Configure the webhook URL to point to your deployed service:

   ```sh
   https://your-service-domain.com/github
   ```

3. Set the webhook secret and add it to your environment variables

## Contributing

1. Format code before committing:

   ```bash
   make fmt
   ```

2. Run tests:

   ```bash
   make test
   ```

3. Follow Go best practices and coding standards

## Troubleshooting

- **Webhook Verification Errors**: Ensure your webhook secret is correctly set
- **GitHub API Issues**: Check GitHub App permissions and credentials
- **Discord Bot Not Responding**: Verify token and channel permissions
- **Build Errors**: Make sure Go version is compatible (1.23.4+)

## Additional Resources

- [GitHub Webhooks Documentation](https://docs.github.com/en/developers/webhooks-and-events/webhooks/about-webhooks)
- [Discord API Documentation](https://discord.com/developers/docs/intro)
- [Go Documentation](https://golang.org/doc/)
