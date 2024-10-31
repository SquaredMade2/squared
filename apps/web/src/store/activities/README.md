# Activities Store

## Overview

The Activities Store is a Zustand-based store designed to manage and persist task and commit events. It provides a simple API for adding and fetching events through API calls, with data stored in sessionStorage for persistence across user sessions. This document explains the store's functionality and provides usage examples.

## Table of Contents

1. [ActivityType Type](#activitytype-type)
2. [ActivityStore API](#activitystore-api)
    - [addTaskEvent](#addtaskevent)
    - [addCommitEvent](#addcommitevent)
    - [getTaskEvents](#gettaskevents)
3. [Session Persistence](#session-persistence)
4. [Usage Examples](#usage-examples)
    - [Adding a Task Event](#adding-a-task-event)
    - [Adding a Commit Event](#adding-a-commit-event)
    - [Fetching Task Events](#fetching-task-events)

## ActivityType Type

The `ActivityType` type represents an activity event, which can include both task and commit events.

```typescript
type ActivityType = {
  include: { taskEvent: true; commit: true };
};
```

## ActivityStore API

### `addTaskEvent`

The `addTaskEvent` method adds a new task event to the store and sends it to the backend via an API call.

```typescript
addTaskEvent: (
  event: TaskEvent, // Task event object to be added
  taskId: string,   // ID of the task associated with the event
  authorId: string  // ID of the user creating the event
) => Promise<TaskEvent | null>
```

### `addCommitEvent`

The `addCommitEvent` method adds a new commit event to the store and sends it to the backend via an API call.

```typescript
addCommitEvent: (
  event: Commit,    // Commit event object to be added
  taskId: string,   // ID of the task related to the commit
  authorId: string  // ID of the user creating the commit
) => Promise<Commit | null>;
```

### `getTaskEvents`

The getTaskEvents method fetches all task-related events for a specific task and updates the store's state.

```typescript
getTaskEvents: (
  taskId: string // ID of the task whose events are being fetched
  ) => Promise<ActivityType[]>;
```

## Session Persistence

The activity store uses Zustand’s `persist` middleware to store data in sessionStorage. This ensures that the activities remain available across browser sessions.

```typescript
  {
    name: "activity-store",
    storage: {
      getItem: (name) => JSON.parse(sessionStorage.getItem(name)),
      setItem: (name, value) => sessionStorage.setItem(name, JSON.stringify(value)),
      removeItem: (name) => sessionStorage.removeItem(name),
    }
```

## Usage Examples

### Adding a Task Event

To add a task event, use the `addTaskEvent` method:

```typescript
const addTaskEvent = useActivityStore((store) => store.addTaskEvent);

const taskEvent = { /* Task event data */ };
await addTaskEvent(taskEvent, "task-id", "author-id");
```

### Adding a Commit Event

To add a commit event, use the `addCommitEvent` method:

```typescript
const addCommitEvent = useActivityStore((store) => store.addCommitEvent);

const commitEvent = { /* Commit event data */ };
await addCommitEvent(commitEvent, "task-id", "author-id");
```

### Fetching Task Events

To fetch task events for a specific task, use the `getTaskEvents` method:

```typescript
const getTaskEvents = useActivityStore((store) => store.getTaskEvents);

const events = await getTaskEvents("task-id");
```
