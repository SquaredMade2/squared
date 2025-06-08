# Squared

Squared is a comprehensive task management and team collaboration platform designed to streamline project workflows, team communication, and task tracking.

## Project Overview

This is a monorepo containing the following applications and services:

### Apps

- `web`: A Next.js application providing the main user interface for task management and team collaboration.
- `api`: An Express-based backend service handling data processing, authentication, and business logic.
- `webhooks`: A Go service for handling webhook integrations (GitHub, etc.).
- `www`: A marketing website and documentation built with Next.js.

## Technology Stack

- **Frontend**: React with Next.js
- **Backend**: Express (Node.js), Go (webhooks)
- **Database**: PostgreSQL (implied from DB scripts)
- **State Management**: Zustand
- **Build System**: Turborepo
- **Package Manager**: pnpm
- **Testing**: Jest
- **Linting/Formatting**: Biome
- **CI/CD**: Supports Docker containerization

## Key Features

- User authentication and authorization
- Workspace management
- Task tracking and updates
- Team collaboration tools
- Sprint planning and management
- GitHub integration
- Real-time notifications

## Getting Started

### Prerequisites

- Node.js (>=23.0.0)
- pnpm (>=10.11.0)
- Docker and Docker Compose (for containerized development)
- Go (for webhooks service)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/SquaredMade2/squared.git
   cd squared
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available) and fill in the required values

4. Initialize the database (if using Docker):

   ```bash
   pnpm docker:db:init
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

### Docker Setup

This repo is configured to be built with Docker and Docker Compose:

```bash
# Create a network, which allows containers to communicate
docker network create app_network

# Build using Docker BuildKit
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build

# Start in detached mode
docker-compose up -d
```

Access the web application at <http://localhost:3000> and the API at <http://localhost:5173>.

## Development

### Available Scripts

- `pnpm dev`: Start all services in development mode
- `pnpm build`: Build all packages and applications
- `pnpm test`: Run tests across all packages
- `pnpm lint`: Run linting across all packages
- `pnpm format:write`: Format code using Biome
- `pnpm check-types`: Run TypeScript type checking

For application-specific commands:

- `pnpm test:api`: Run API tests
- `pnpm test:web`: Run web application tests
- `pnpm storybook`: Start Storybook for UI components

### Database Management

- `pnpm db:migrate`: Run database migrations
- `pnpm db:push`: Push schema changes to the database
- `pnpm db:gen`: Generate database client
- `pnpm docker:db:seed`: Seed the database with initial data

## Project Structure

```sh
squared/
├── apps/
│   ├── api/              # Backend API service
│   ├── web/              # Main web application
│   ├── webhooks/         # Go service for webhooks
│   └── www/              # Marketing website
├── packages/             # Shared packages and libraries
├── docker-compose.yml    # Docker configuration
├── turbo.json            # Turborepo configuration
└── package.json          # Root package.json
```

## Architecture

The project follows a monorepo structure using Turborepo for build orchestration and pnpm for package management. Each application can be developed and deployed independently while sharing common packages and configurations.

## Contributing

Please follow the existing code style and patterns when contributing. The project uses Biome for formatting and linting, and Husky for Git hooks to ensure code quality.

## License

[Include license information here]
