# SprintService

## Overview

The SprintService is a crucial component of our project management system, designed to handle all sprint-related operations. It provides functionality for managing sprints, tasks within sprints, and retrospective items.

## Features

- Initialize sprints for a team
- Start a new sprint
- Manage tasks within sprints
- Handle sprint completion
- Add and update retrospective items
- Retrieve sprint and retrospective data

## Installation

To use the SprintService in your project, you need to have Prisma set up with your database. Ensure you have the necessary dependencies installed:

```bash
npm install @prisma/client date-fns
```

## Usage

First, import and initialize the SprintService:

```typescript
import { PrismaClient } from "@prisma/client";
import { SprintService } from "./sprint-service";

const prisma = new PrismaClient();
const sprintService = new SprintService(prisma);
```

### Available Methods

1. **getSprints**
   Retrieves all sprints for a given team.

   ```typescript
   const sprints = await sprintService.getSprints({
     teamId: "team123",
   });
   ```

2. **initializeSprints**
   Initializes upcoming sprints for a team.

   ```typescript
   const initializedCount = await sprintService.initializeSprints({
     teamId: "team123",
   });
   ```

3. **startNextSprint**
   Starts the next sprint, moving specified tasks into it.

   ```typescript
   const result = await sprintService.startNextSprint({
     teamId: "team123",
     movedTasks: ["task1", "task2"],
     sprintData: { name: "Sprint 1" },
   });
   ```

4. **getSprintTasks**
   Retrieves all tasks for a given sprint.

   ```typescript
   const tasks = await sprintService.getSprintTasks({
     sprintId: "sprint123",
   });
   ```

5. **endSprint**
   Marks a sprint as completed.

   ```typescript
   const endedSprint = await sprintService.endSprint({
     sprintId: "sprint123",
   });
   ```

6. **addRetrospectiveItem**
   Adds a new retrospective item to a sprint.

   ```typescript
   const retroItem = await sprintService.addRetrospectiveItem({
     sprintId: "sprint123",
     type: "wentWell",
     content: "Great teamwork",
   });
   ```

7. **updateRetrospectiveItem**
   Updates an existing retrospective item.

   ```typescript
   const updatedRetroItem =
     await sprintService.updateRetrospectiveItem({
       retrospectiveItemId: "retro123",
       type: "toImprove",
       content: "Better communication",
       sprintId: "sprint123",
     });
   ```

8. **getRetrospectiveItems**
   Retrieves all retrospective items for a sprint.

   ```typescript
   const retroItems = await sprintService.getRetrospectiveItems({
     sprintId: "sprint123",
   });
   ```

## Error Handling

The service uses a consistent error response format for error cases:

```typescript
interface ErrorResponse {
  status: number;
  message: string;
  variant: "destructive";
}
```

## Dependencies

- @prisma/client: For database operations
- date-fns: For date manipulations

## Best Practices

- Always handle potential errors when calling these methods.
- Ensure that the team exists and has sprints enabled before calling sprint-related methods.
- When starting a new sprint, make sure to provide all necessary tasks to be moved.
