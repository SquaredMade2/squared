
# Task Store

## Overview

This module provides a store for managing tasks using Zustand with session storage persistence. The TaskStore includes functionality for adding, updating, deleting, and retrieving tasks. It also supports fetching tasks from an API and handling team-related tasks.

## Table of Contents

1. [TaskResponse Type](#taskresponse-type)
2. [Task API](task-api)
    - [addTask](#addtask)
    - [updateTask](#updatetask)
    - [setCurrentTask](#setcurrenttask)
    - [deleteTask](#deletetask)
    - [setTaskList](#settasklist)
    - [getTask](#gettask)
    - [getTaskByIdentifier](#gettaskbyidentifier)
    - [getAllTasks](#getalltasks)
    - [toggleSprintTasks](#togglesprinttasks)
3. [Session Persistence](#session-persistence)

## TaskResponse Type

The `TaskResponse` type defines the structure of data returned from the API when returning a task response.

```typescript
type TaskResponse = {
  task: Task | null; // Task object is successfully processed, otherwise null
  message?: string;  // A message describing the result of the operation
  variant: "default" | "destructive"; // Type of toast to display
}
```

## Task API

### `addTask`

Adds a new task to the store and persists it. Returns a TaskResponse containing the new task, message, and variant.

```typescript
addTask: (task: Partial<Task>) => Promise<TaskResponse>
```

### `updateTask`

Updates an existing task based on the task ID and provided task data.

```typescript
updateTask: (taskId: string, task: Partial<Task>) => Promise<TaskResponse>
```

### `setCurrentTask`

Sets the given task as the current active task in the store.

```typescript
setCurrentTask: (task: Task) => void
```

### `deleteTask`

Deletes a task from the store by its ID.

```typescript
deleteTask: (taskId: string) => Promise<void>
```

### `setTaskList`

Sets the task list in the store with a new array of tasks.

```typescript
setTaskList: (tasks: Task[]) => void
```

### `getTask`

Retrieves a task by its ID. If the task is not found in the store, it fetches it from the API.

```typescript
getTask: (taskId: string) => Promise<TaskResponse>
```

### `getTaskByIdentifier`

Fetches a task by its identifier from a specific workspace.

```typescript
getTaskByIdentifier: (
  workspaceId: string,
  taskIdentifier: string,
) => Promise<TaskResponse>
```

### `getAllTasks`

Retrieves all tasks for a specific team from the API.

```typescript
getAllTasks: (teamId: string) => Promise<Task[]>
```

### `toggleSprintTasks`

Adds or removes tasks from a sprint based on the provided action type.

```typescript
toggleSprintTasks: (
  teamId: string,
  sprintId: string,
  type: "add" | "remove",
) => Promise<ApiReturnType<Task[]>>
```

## Session Persistence

The TaskStore uses sessionStorage for persistence via Zustand's persist middleware. The data is automatically stored and retrieved from the browser's session storage under the key task-store.

```typescript
{
  name: "task-store",
  storage: {
    getItem: (name) => {
      const storedValue = sessionStorage.getItem(name);
      return storedValue ? JSON.parse(storedValue) : null;
    },
    setItem: (name, value) => {
      sessionStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      sessionStorage.removeItem(name);
    },
  },
}
```
