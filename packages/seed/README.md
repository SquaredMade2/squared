# @squared/seed

A database seeding package built to populate a PostgreSQL database with random test data using **Prisma**, **Faker.js**, and **bcrypt.js**. This package is useful for generating test data in development and test environments.

## Features

- Automatically seeds the database with:
  - Workspaces, Teams, Tasks, Users, Comments, and Notifications.
  - Random data generated using **Faker.js**.
  - Password hashing using **bcrypt.js**.
- Supports seeding multiple related entities such as tasks, comments, teams, and users.
- Docker commands to spin up and tear down a PostgreSQL database for local development.

## Installation

The package is private and intended for use within the monorepo. To install it in your workspace, run:

```bash
pnpm install
```

## Usage

### 1. Seeding the Database

To seed the database, you can use the `db:seed` script. This will populate your database with test data based on the seeding logic.

```bash
pnpm run db:seed
```

This command sets `NODE_ENV` to `test` and runs the seed file using `ts-node`. It seeds:

- Workspaces (3)
- Teams (1–2 per workspace)
- Users (randomly generated)
- Tasks (30–50 per team)
- Comments on tasks
- Notifications related to tasks

### 2. Using Docker for Local Development

The package includes Docker scripts to quickly set up a PostgreSQL database for local development.

#### Start the PostgreSQL Database:

```bash
pnpm run docker:db
```

#### Tear Down the PostgreSQL Database:

```bash
pnpm run docker:db:down
```

### Environment Variables

Ensure the following environment variables are configured in your `.env` file:

- **`TEST_POSTGRES_PRISMA_URL`**: Connection string for the test PostgreSQL database.
- **`SEED_NAME`** (optional): Name of the main user.
- **`SEED_EMAIL`** (optional): Email of the main user.
- **`SEED_PASSWORD`** (optional): Password for the main user.

If any of the `SEED_NAME`, `SEED_EMAIL`, or `SEED_PASSWORD` variables are not provided, the seeding script will automatically generate them using **Faker.js**.

### Seeding Logic

The main seeding logic is found in `src/index.ts`. It creates workspaces, users, teams, tasks, and comments with randomized data. Below is an overview of the key functions:

#### `seedDB()`

The main function that triggers the seeding of the database. It:

- Creates three workspaces.
- Generates a main user and assigns them to all workspaces.
- For each workspace, it creates random teams, users, tasks, comments, and notifications.

#### `addMainUser()`

Adds the main user to the database. The user's details can either be provided via environment variables or generated using **Faker.js**.

#### `addUser()`

Generates a random user with a hashed password using **bcrypt** and saves them to the database.

#### `addWorkspace()`

Creates a new workspace with a random name, company size, and predefined labels (e.g., Feature, Bug, Refactor, etc.).

#### `addTeam(workspace, user)`

Creates a new team within the specified workspace and associates the user with the team.

#### `addTask(team, workspace, user)`

Creates a task within the specified team and workspace, assigns it to a random user, and assigns random labels to the task.

#### `addComment(userId, taskId)`

Adds a random comment to a task, generated using **Faker.js**.

#### `addNotification(userId, taskId, workspaceId)`

Creates a notification related to a task for a specific user.

### Scripts

- **`db:seed`**: Seeds the database with test data. This script is useful for populating the test environment.

  ```bash
  pnpm run db:seed
  ```

- **`docker:db`**: Spins up a PostgreSQL database using Docker for local development.

  ```bash
  pnpm run docker:db
  ```

- **`docker:db:down`**: Tears down the Docker container along with the database volumes to clear out the database.

  ```bash
  pnpm run docker:db:down
  ```

### Dependencies

- **`@repo/db`**: Provides the Prisma client and database models.
- **`dotenv`**: Loads environment variables from a `.env` file.
- **`@faker-js/faker`**: Generates random data for seeding the database.
- **`bcryptjs`**: Used for hashing passwords for users.
- **`cross-env`**: Helps set environment variables in a cross-platform way.
- **`ts-node`**: Enables running TypeScript files directly for database seeding.

### Development Dependencies

- **`@types/bcryptjs`**: TypeScript type definitions for bcrypt.js.
- **`@types/node`**: TypeScript type definitions for Node.js.
