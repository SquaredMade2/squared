# Event Zustand Store

## Overview

This README documents the Event Zustand store, which is responsible for managing the state of events, notifications, and commits in our application. The store is built using Zustand, a small, fast, and scalable state management solution.

## Store Structure

The Event store consists of two main parts: the state and the actions.

### State

The state is defined by the `EventState` type:

```typescript
export type EventState = {
  events: TaskEvent[];
  notifications: GetNotificationsResponse;
  commits: TaskEvent[];
};
```

- `events`: An array of `TaskEvent` objects representing task-related events.
- `notifications`: A `GetNotificationsResponse` object containing notification data.
- `commits`: An array of `TaskEvent` objects representing commit-related events.

### Actions

The store provides the following actions to update the state:

```typescript
type EventActions = {
  setNotifications: (notifications: Notification[]) => void;
  setEvents: (events: TaskEvent[]) => void;
  setCommits: (commits: TaskEvent[]) => void;
};
```

- `setNotifications`: Updates the notifications in the store.
- `setEvents`: Updates the task events in the store.
- `setCommits`: Updates the commit events in the store.

## Usage

To use the Event store in your application, follow these steps:

1. Import the store:

   ```typescript
   import { useEventStore } from "@/store";
   ```

2. Access the state and actions in your component:

   ```typescript
   function MyComponent() {
     const {
       events,
       notifications,
       commits,
       setEvents,
       setNotifications,
       setCommits,
     } = useEventStore((state) => state);

     // Use the state and actions as needed
     // ...
   }
   ```

### Examples

#### Updating notifications

```typescript
const updateNotifications = (newNotifications: Notification[]) => {
  setNotifications(newNotifications);
};
```

#### Fetching and setting events

```typescript
const fetchAndSetEvents = async () => {
  const fetchedEvents = await api.getEvents();
  setEvents(fetchedEvents);
};
```

#### Updating commits

```typescript
const updateCommits = (newCommits: TaskEvent[]) => {
  setCommits(newCommits);
};
```

## Best Practices

1. Always use the provided actions to update the store. Don't modify the state directly.
2. Keep the store updates as atomic as possible. Update only what's necessary.
3. When fetching data from an API, update the store immediately after receiving the response.
4. Use the store's state for rendering components and avoid storing redundant data in component state.

## Types

The store uses the following types:

- `TaskEvent`: Represents a task-related event (imported from `@squared/db`).
- `Notification`: Represents a notification (imported from `@squared/db`).
- `GetNotificationsResponse`: The response type for fetching notifications (imported from `@/gen/rpc/event`).

Make sure these types are correctly imported and up-to-date in your project.

## Troubleshooting

If you encounter issues with the Event store:

1. Verify that you're importing and using the store correctly.
2. Check that all required types are properly imported.
3. Ensure that actions are being called with the correct parameter types.
4. Use the Redux DevTools (if configured with Zustand) to inspect the store's state and actions.
