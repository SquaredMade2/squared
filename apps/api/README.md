# Squared API Server

This is the core API server for the Squared platform, providing a robust backend for managing workspaces, tasks, teams, and user interactions through a comprehensive RPC-based architecture.

## Project Structure

```sh
src/
├── api/                # API initialization and Express setup
│   ├── app.ts          # Express application setup
│   ├── index.ts        # Server startup
├── services/           # Service implementations
│   ├── auth/           # Authentication services
│   ├── comments/       # Comment management
│   ├── events/         # Event tracking and notifications
│   ├── filters/        # Task filtering and saved views
│   ├── github/         # GitHub integration
│   ├── sprints/        # Sprint planning and management
│   ├── tasks/          # Task CRUD operations
│   ├── teams/          # Team management
│   ├── users/          # User management
│   ├── workspaces/     # Workspace handling
│   ├── index.ts        # Service initialization and RPC handler setup
│   ├── schema.ts       # Shared schema definitions
├── utils/              # Utility functions and helpers
│   ├── helpers.ts      # General utility functions
│   ├── taskUpdate.ts   # Task update notifications
├── __tests__/          # Test files
```

## Architecture

The API follows a service-oriented architecture with the following components:

- **Express Application**: Handles HTTP requests, CORS, and middleware configuration
- **Service Layer**: Business logic organized by domain (tasks, teams, etc.)
- **RPC Handlers**: Transforms service methods into RPC endpoints
- **Database Integration**: Uses a shared database package for data access
- **Authentication**: Clerk-based authentication system
- **Swagger Documentation**: API documentation generation

## Key Features

- **RPC API**: Clean, type-safe RPC endpoints for all operations
- **Service-Based Architecture**: Modular and maintainable code organization
- **Real-time Updates**: Socket.IO integration for live updates
- **Authentication & Authorization**: Secure user management with Clerk
- **API Documentation**: Swagger documentation for all endpoints
- **Database Integration**: Typed database access layer
- **Event System**: Comprehensive event tracking for user activities
- **Comprehensive Test Coverage**: Jest tests for API functionality

## Technology Stack

- **Runtime**: Node.js >=22
- **Framework**: Express 5.0.0
- **Language**: TypeScript 5.5.4
- **Database**: PostgreSQL (via @squaredmade/db package)
- **API Documentation**: Swagger UI Express 5.0.0
- **Testing**: Jest 29.7.0 with Supertest
- **Development**: TSX 4.19.4 and Nodemon for hot reloading
- **Authentication**: Clerk Backend 1.24.0
- **Real-time**: Socket.IO 4.8.0
- **Linting/Formatting**: Biome
- **Date Handling**: date-fns 4.0.0
- **Validation**: Zod 3.23.8

## Getting Started

### Prerequisites

- Node.js >=22.0.0
- pnpm >=10.0.0
- PostgreSQL database

### Installation

1. Clone the repository and navigate to the API directory:

   ```bash
   git clone https://github.com/SquaredMade2/squared.git
   cd squared
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root of the API directory with the following variables:

   ```ini
   DATABASE_URL=postgresql://username:password@localhost:5432/squared
   PORT=5173
   CLERK_SECRET=your_clerk_secret_key
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

The API server will be available at <http://localhost:5173>.

## API Documentation

API documentation is available at `/api-docs` when the server is running. This documentation is automatically generated from API route definitions.

## Available Scripts

- `pnpm dev`: Start the development server with hot reloading
- `pnpm start`: Start the production server
- `pnpm test`: Run the test suite
- `pnpm test:watch`: Run tests in watch mode
- `pnpm test:ci`: Run tests in CI mode
- `pnpm lint`: Lint the code using Biome
- `pnpm lint:fix`: Lint and fix code issues using Biome
- `pnpm format:write`: Format the code using Biome
- `pnpm format:check`: Check code formatting using Biome
- `pnpm check-types`: Run TypeScript type checking

## Development

### Creating a New Service

1. Create a new directory in the `src/services` folder
2. Implement a service class with your business logic
3. Create an RPC handler function that exposes the service methods
4. Add the service and handler to the exports in `src/services/index.ts`

Example service structure:

```sh
services/
└── example/
    ├── index.ts          # Exports the service and RPC handler
    ├── example-service.ts # Service implementation
    └── types.ts          # TypeScript interfaces for the service
```

### Testing

The project uses Jest for testing. Tests are located in the `src/__tests__` directory.

To write a new test:

1. Create a new file in the `src/__tests__` directory
2. Use the request utility from `src/__tests__/request.ts` to test API endpoints
3. Run tests with `pnpm test`

## Deployment

The project includes a `Dockerfile` for containerized deployment. To build and run the Docker image:

```bash
docker build -t squared-api .
docker run -p 5173:5173 -e DATABASE_URL=your_production_db_url squared-api
```

## Additional Resources

For more detailed information about specific services or components, refer to the README files in the respective directories.
