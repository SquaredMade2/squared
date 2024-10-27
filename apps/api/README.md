# API Server

This is the API server for our application, providing a robust backend for managing workspaces, tasks, teams, and user interactions.

## Project Structure

The project is organized as follows:

- `src/`: Contains the source code
  - `api/`: API routes and handlers
  - `utils/`: Utility functions and helpers
- `dist/`: Compiled JavaScript output
- `node_modules/`: Third-party dependencies

## Key Features

- User authentication and authorization
- Workspace management
- Task tracking and updates
- Team collaboration
- Notifications system
- Integration with external services (e.g., GitHub)

## Getting Started

### Prerequisites

- Node.js (version X.X.X)
- pnpm (version X.X.X)

### Installation

1. Clone the repository:

   ```bash

   git clone [https://github.com/your-repo/api-server.git](https://github.com/your-repo/api-server.git)
   cd api-server

   ```

2. Install dependencies:

   ```bash

   pnpm install

   ```

3. Set up environment variables:
   Copy the `.env.example` file to `.env` and fill in the required values.

4. Build the project:

   ```bash
   pnpm build
   ```

5. Start the server:

   ```shell

   pnpm start

   ```

## API Documentation

API documentation is available at `/docs` when the server is running.

## Development

To run the server in development mode with hot reloading:

```shell

pnpm dev

```

## Testing

Run the test suite with:

```bash
pnpm test
```

## Deployment

The project includes a `Dockerfile` for containerized deployment. To build and run the Docker image:

```shell
docker build -t api-server .
docker run -p 3000:3000 api-server
```
