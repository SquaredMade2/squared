# @squaredmade/seed

A database seeding package built to populate a PostgreSQL database with random test data. This package uses Docker to automatically handle all PostgreSQL operations without requiring manual installation.

## Features

- **Zero PostgreSQL Installation Required**: All PostgreSQL operations are handled through Docker
- Database seeding support with:
  - Workspaces, Teams, Tasks, Users, Comments, and Notifications
  - Docker-based PostgreSQL management for local development
- Docker commands to:
  - Start a PostgreSQL database
  - Tear down a PostgreSQL database
  - Restore data from a remote database (if needed)

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine
- [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine

## Usage

### 1. Check Docker Installation

First, check if Docker and Docker Compose are installed correctly:

```bash
pnpm run docker:db:check
```

### 2. Start the PostgreSQL Database

Start the PostgreSQL database using Docker:

```bash
pnpm run docker:db
```

This command:

- Spins up a PostgreSQL 17 container
- Sets up a Neon Proxy container for HTTP access to PostgreSQL
- Creates a container with PostgreSQL tools ready to use
- Sets up a Docker network for all containers to communicate

### 3. Seeding the Database

To seed the database with test data:

```bash
pnpm run db:seed
```

This command:

- Ensures the Docker containers are running
- Seeds your database with test data
- Creates workspaces, teams, users, tasks, comments, and notifications

### 4. Restoring from a Remote Database (Optional)

If you have a remote database you want to clone locally:

```bash
pnpm run docker:db:restore
```

This requires setting the `REMOTE_DATABASE_URL` environment variable.

### 5. Tear Down the PostgreSQL Database

When you're done working, you can tear down the database:

```bash
pnpm run docker:db:down
```

This completely removes the containers and volumes.

## Environment Variables

Configure these in your `.env` file:

- **`REMOTE_DATABASE_URL`**: (Optional) Connection string for the remote PostgreSQL database to restore from
- **`DATABASE_URL`**: Connection string for your local PostgreSQL database
- **`SEED_NAME`**, **`SEED_EMAIL`**, **`SEED_PASSWORD`**: (Optional) Details for the main user

Default local database URL if not specified: `postgres://postgres:postgres@localhost:5432/squared-test`

## Docker Components

The Docker setup includes:

- **PostgreSQL**: Database server (port 5432)
- **Neon Proxy**: HTTP proxy for PostgreSQL (port 4444)
- **PG Tools**: Container with PostgreSQL tools for dumps and restores

## Scripts

- **`docker:db:check`**: Checks if Docker and Docker Compose are installed
- **`docker:db`**: Starts the PostgreSQL database using Docker
- **`docker:db:down`**: Tears down all Docker containers and volumes
- **`docker:db:restore`**: Restores data from a remote database
- **`db:seed`**: Seeds the database with test data

## No Manual PostgreSQL Installation Needed

This package is designed to work entirely with Docker, eliminating the need for a local PostgreSQL installation. All PostgreSQL operations (including pg_dump and pg_restore) are performed within Docker containers.

## Dependencies

- **Docker and Docker Compose**: For containerized PostgreSQL
- **@squaredmade/logger**: Logging utility
- **dotenv**: Environment variable management
- **pg**: PostgreSQL client for JavaScript
