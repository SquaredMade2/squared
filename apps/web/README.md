# Squared Web Application

A Next.js-based web application providing the main user interface for the Squared task management and team collaboration platform.

## Project Structure

```sh
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   ├── [workspace]/         # Workspace routes
│   │   ├── (main)/          # Main workspace pages (tasks, teams, etc.)
│   │   ├── (settings)/      # Settings pages
│   ├── api/                 # API routes
│   ├── create/              # Workspace creation
│   ├── inbox/               # Notifications inbox
├── components/              # React components
│   ├── Buttons/             # Button components
│   ├── DeleteTaskModal/     # Task deletion UI
│   ├── FilterDropdowns/     # Filter UI components
│   ├── Inbox/               # Inbox components
│   ├── Modals/              # Modal components
│   ├── Settings/            # Settings page components
│   ├── Sidebar/             # Navigation sidebar
│   ├── Sprints/             # Sprint management components
│   ├── TaskPage/            # Task detail components
│   ├── TextEditor/          # Rich text editor components
│   ├── ViewAllTasks/        # Task list components
│   ├── ui/                  # Core UI components
├── hooks/                   # Custom React hooks
├── store/                   # Zustand state management
├── utils/                   # Utility functions
├── types/                   # TypeScript type definitions
├── gen/                     # Generated API client code
├── lib/                     # Shared libraries and utilities
├── server/                  # Server components and API routes
```

## Overview

This web application is built using Next.js 15 with App Router and React 19, providing a modern, responsive interface for task management and team collaboration. The application follows a component-based architecture with Zustand for state management.

### Key Features

1. **Authentication**: Implemented using Clerk authentication (see `src/app/(auth)`)
2. **Task Management**:
   - Create, view, edit, and delete tasks
   - Task filtering and grouping
   - Subtask management
   - Parent-child task relationships
   - Task comments and activity tracking
3. **Team Collaboration**:
   - Team management and member assignment
   - Team-specific task views
   - Sprint planning and retrospectives
4. **Workspaces**: Multi-workspace support with custom permissions and settings
5. **Settings**: Comprehensive user, team, and workspace settings
6. **GitHub Integration**: Connect repositories and track GitHub events
7. **Sprints**: Agile sprint planning, execution, and retrospectives
8. **Inbox**: Notification system for task and team updates

### Technology Stack

- **Frontend Framework**: React 19.1.0 with Next.js 15.3.2
- **Styling**: Tailwind CSS 4.1.4 with a custom UI component system
- **State Management**: Zustand 5.0.3
- **Form Handling**: React Hook Form with Zod 3.23.8 for validation
- **Authentication**: Clerk Authentication
- **Data Fetching**: TanStack Query 5.62.7
- **UI Components**:
  - Custom UI components (`src/components/ui`)
  - Radix UI primitives
  - @squaredmade/ui (shared component library)
- **Date Handling**: date-fns 4.1.0
- **Rich Text Editing**: Slate.js 0.114.0
- **Charts & Visualization**: Recharts 2.15.1
- **Real-time Updates**: Socket.IO Client 4.8.0
- **Testing**: Jest 29.7.0 with React Testing Library

## Development Guidelines

1. **TypeScript**: Use TypeScript for all code to ensure type safety
2. **Component Structure**:
   - Prefer function components with hooks
   - Keep components focused on a single responsibility
   - Extract reusable logic to custom hooks
3. **State Management**:
   - Use Zustand for global state
   - Use React Query for server state and data fetching
   - Use React hooks for component state
4. **Styling**:
   - Use Tailwind CSS for component styling
   - Follow the design system guidelines
   - Reuse UI components from `src/components/ui` and `@squaredmade/ui`
5. **Data Fetching**:
   - Use React Query for data fetching and caching
   - Handle loading and error states appropriately
6. **Testing**:
   - Write unit tests for complex components and logic
   - Follow the existing testing patterns

## Getting Started

### Prerequisites

- Node.js >=23.0.0
- pnpm >=10.11.0

### Installation

1. Clone the repository and navigate to the web app directory:

   ```bash
   git clone https://github.com/SquaredMade2/squared.git
   cd squared
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` (if available)
   - Fill in the required values

4. Start the development server:

   ```bash
   pnpm dev
   ```

The application will be available at <http://localhost:3000>.

### Available Scripts

- `pnpm dev`: Start the development server with Turbopack
- `pnpm build`: Build the Next.js application
- `pnpm start`: Start the production server
- `pnpm test`: Run Jest tests
- `pnpm test:watch`: Run Jest tests in watch mode
- `pnpm test:coverage`: Run Jest tests with coverage reporting
- `pnpm lint`: Lint the code using Biome
- `pnpm lint:fix`: Lint and fix code issues using Biome
- `pnpm format:write`: Format the code using Biome
- `pnpm format:check`: Check code formatting using Biome
- `pnpm check-types`: Run TypeScript type checking
- `pnpm build:digitalocean`: Build for DigitalOcean deployment
- `pnpm reset`: Remove node_modules and pnpm-lock.yaml

## Deployment

The application includes a Dockerfile for containerized deployment and is configured for deployment on platforms like Vercel and DigitalOcean.

## Additional Resources

For more detailed information on specific components or features, refer to the respective directories and files in the source code. The codebase follows consistent patterns and is well-documented.
