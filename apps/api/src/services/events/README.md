# EventService

## Overview

The EventService is a crucial component of our project management system, designed to handle all event-related operations, including task events, notifications, and commits. It provides functionality for creating, retrieving, updating, and deleting various types of events and notifications.

## Features

- Retrieve task events and commits
- Create and manage notifications
- Create log events for tasks
- Toggle notification status (read/dismissed)
- Delete notifications
- Deserialize and parse task event logs

## Installation

To use the EventService in your project, you need to have Prisma set up with your database. Ensure you have the necessary dependencies installed:

```bash
npm install @prisma/client
```

## Usage

First, import and initialize the EventService:

```typescript
import { PrismaClient } from "@prisma/client";
import { EventService } from "./event-service";

const prisma = new PrismaClient();
const eventService = new EventService(prisma);
```

### Available Methods

1. **getTaskEvents**
   Retrieves all events (including commits) for a given task.

   ```typescript
   const events = await eventService.getTaskEvents({
     taskId: "task123",
   });
   ```

2. **getNotifications**
   Retrieves all notifications for a given user.

   ```typescript
   const notifications = await eventService.getNotifications({
     userId: "user123",
   });
   ```

3. **createLogEvent**
   Creates a new log event for a task and generates notifications if necessary.

   ```typescript
   const logEvent = await eventService.createLogEvent({
     taskId: "task123",
     authorId: "user456",
     changes: { status: "inProgress" },
   });
   ```

4. **createNotification**
   Creates a new notification.

   ```typescript
   const notification = await eventService.createNotification({
     userId: "user123",
     taskId: "task456",
     workspaceId: "workspace789",
     description: "New task assigned",
     type: "ASSIGNED",
   });
   ```

5. **toggleNotification**
   Updates the read or dismissed status of multiple notifications.

   ```typescript
   const updatedNotifications = await eventService.toggleNotification(
     {
       notificationIds: ["notif1", "notif2"],
       read: true,
       dismissed: false,
     }
   );
   ```

6. **deleteNotification**
   Deletes multiple notifications.

   ```typescript
   await eventService.deleteNotification({
     notificationIds: ["notif1", "notif2"],
   });
   ```

## Error Handling

The service throws errors in cases where required data is not found or operations fail. Always wrap method calls in try-catch blocks to handle potential errors.

## Dependencies

- @prisma/client: For database operations

## Best Practices

- Always handle potential errors when calling these methods.
- When creating log events, ensure that the task exists before calling the method.
- Use the toggleNotification method to update multiple notifications at once for better performance.
- Regularly clean up old or unnecessary notifications using the deleteNotification method.
