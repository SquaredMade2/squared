# Web Application Developer Documentation

## Project Structure

```
root
├── Dockerfile
├── README.md
├── coverage
├── cypress.config.js
├── dist
├── instrumentation.ts
├── jest.config.js
├── jest.setup.js
├── next-env.d.ts
├── next.config.js
├── node_modules
├── package.json
├── postcss.config.js
├── public
├── sentry.client.config.ts
├── src
│   ├── app
│   ├── components
│   ├── constants
│   ├── cypress
│   ├── font
│   ├── hooks
│   ├── middleware.ts
│   ├── store
│   ├── types
│   └── utils
├── tailwind.config.ts
└── tsconfig.json
```

## Overview

This web application is built using Next.js and React, with TypeScript for type safety. It is a task management and team collaboration platform with features like authentication, task tracking, and team management.

### Key Features

1. **Authentication**: Implemented using NextAuth (see `src/app/api/auth`).
2. **Task Management**: Components for creating, viewing, and managing tasks (`src/components/TaskPage`, `src/components/ViewAllTasks`).
3. **Team Collaboration**: Team-related components and pages (`src/app/[workspace]/team`).
4. **Workspaces**: Support for multiple workspaces (`src/app/[workspace]`).
5. **Settings**: User and workspace settings management (`src/app/settings`).
6. **Sprints**: Agile sprint management features (`src/components/Sprints`).

### Technology Stack

- **Frontend**: React 18.3.1 with Next.js 14.2.7
- **Styling**: Tailwind CSS 3.4.10 with PostCSS 8.4.38 and Autoprefixer 10.4.19
- **State Management**: Zustand 4.5.5
- **Form Handling**: React Hook Form 7.53.0 with Zod 3.23.8 for validation
- **Testing**: Jest 29.7.0 for unit tests, Cypress 13.14.0 for end-to-end testing
- **UI Components**: Custom UI components (`src/components/ui`) and @repo/ui (workspace package)
- **Authentication**: NextAuth 4.24.7
- **Date Handling**: date-fns 4.0.0
- **Drag and Drop**: @hello-pangea/dnd 17.0.0
- **Charts**: Recharts 2.12.7
- **Real-time Communication**: Socket.IO Client 4.8.0

### Development Guidelines

1. Use TypeScript for all new code to ensure type safety.
2. Follow the existing project structure when adding new features.
3. Implement unit tests using Jest and end-to-end tests using Cypress for new functionality.
4. Use the custom UI components from `src/components/ui` and `@repo/ui` for consistent styling.
5. Manage application state using Zustand.
6. Use React Hook Form for form handling and Zod for validation.
7. Follow the naming conventions and file structure as seen in the existing codebase.
8. Use Biome for code formatting and linting.

### Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run the development server: `pnpm dev`
4. Run tests:
   - Jest: `pnpm jest`
   - Cypress: `pnpm cypress` (open) or `pnpm cypress:headless` (run)
5. Lint the code: `pnpm lint`
6. Format the code: `pnpm format`

### Available Scripts

- `build`: Build the Next.js application
- `build:digitalocean`: Build for DigitalOcean deployment
- `format:write`: Format the code using Biome
- `format:check`: Check code formatting using Biome
- `check-types`: Run TypeScript type checking
- `cypress`: Open Cypress test runner
- `cypress:components`: Run Cypress component tests
- `cypress:headless`: Run Cypress tests headlessly
- `dev`: Start the development server
- `lint`: Lint the code using Biome
- `lint:fix`: Lint and fix code issues using Biome
- `reset`: Remove node_modules and pnpm-lock.yaml
- `start`: Start the production server
- `test`: Run Jest tests in CI mode

For more detailed information on specific components or features, refer to the respective directories and files in the source code.
