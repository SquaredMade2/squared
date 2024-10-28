# Custom Hooks for Web

## Overview

This file contains custom hooks for managing user authentication, task creation, grouping, and other stateful operations within a collaborative workspace environment. Each hook provides unique functionality to enhance the user experience by simplifying data management and component interaction.

## Table of Contents

1. [useAuthUser](#useauthuser)
2. [useCreateTask](#usecreatetask)
3. [useGroups](#usegroups)
4. [useSprints](#usesprints)
5. [useTaskDashboard](#usetaskdashboard)
6. [useTaskPage](#usetaskpage)
7. [useTeams](#useteams)
8. [useUsers](#useusers)
9. [useWorkspaces](#useworkspaces)

---

## Hooks

### `useAuthUser`

Manages user authentication state, fetching the authenticated user, and handling errors in the process.

```typescript
import { useAuthUser } from "@/hooks";

const Component = () => {
  const { user, loading, error } = useAuthUser();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <p>Welcome, {user.name}</p>;
};
```

### `useCreateTask`

Allows creating tasks within a specified team and workspace, including handling of loading and error states.

```typescript
import { useCreateTask } from "@/hooks";

const Component = () => {
  const { createTask, isLoading, error } = useCreateTask();

  const handleCreateTask = async () => {
    try {
      const taskData = { title: "New Task", description: "Task description" };
      const result = await createTask(taskData);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div>
      <button onClick={handleCreateTask} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Task"}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
};
```

### `useGroups`

Groups tasks based on status, assignee, priority, or label, depending on the configured group view.

```typescript
import { useGroups } from "@/hooks";

const Component = () => {
  const { getGroupedColumns } = useGroups();

  return (
    <div>
      {getGroupedColumns().map((column, idx) => (
        <div key={idx}>
          <h3>{column.group}</h3>
          {column.tasks.map(task => (
            <p key={task.id}>{task.title}</p>
          ))}
        </div>
      ))}
    </div>
  );
};
```

### `useSprints`

Fetches and manages sprints, teams, and tasks associated with a workspace. It provides loading and error states for asynchronous data fetching.

```typescript
import { useSprints } from "@/hooks";

const Component = () => {
  const { sprints, loading, error } = useSprints();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul>
      {sprints.map(sprint => (
        <li key={sprint.id}>{sprint.name}</li>
      ))}
    </ul>
  );
};
```

### `useTaskDashboard`

Provides task loading and dragging functionality, allowing users to move tasks between status categories on a dashboard.

```typescript
import { useTaskDashboard } from "@/hooks";

const Component = () => {
  const { handleDragEnd, loading } = useTaskDashboard();

  if (loading) return <p>Loading tasks...</p>;

  return <div>{/* Render task board with drag-and-drop here */}</div>;
};
```

### `useTaskPage`

Loads and manages individual task data, including associated team and workspace data.

```typescript
import { useTaskPage } from "@/hooks";

const Component = () => {
  const { task, isLoading, error } = useTaskPage();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <div>{task.title}</div>;
};
```

### `useTeams`

Fetches and manages user team data, including authorization checks.

```typescript
import { useTeams } from "@/hooks";

const Component = () => {
  const { teams, loading, authorized } = useTeams();

  if (loading) return <p>Loading teams...</p>;
  if (!authorized) return <p>Not authorized</p>;

  return (
    <ul>
      {teams.map(team => (
        <li key={team.id}>{team.name}</li>
      ))}
    </ul>
  );
};
```

### `useUsers`

Loads a list of users associated with the current workspace and maintains loading states.

```typescript
import { useUsers } from "@/hooks";

const Component = () => {
  const { users, loading } = useUsers();

  if (loading) return <p>Loading users...</p>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
```

### `useWorkspaces`

Manages and synchronizes user workspaces in the application. It interacts with the authentication state and the workspace store to load available workspaces, set the current workspace based on the URL, and handle loading and error states.

```typescript
import { useWorkspaces } from "@/hooks/useWorkspaces";

function WorkspaceComponent() {
  const {
    user,
    loading,
    error,
    currentWorkspace,
    workspaces,
  } = useWorkspaces();  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <h2>Current Workspace: {currentWorkspace?.name}</h2>
      <ul>
        {workspaces.map(ws => (
          <li key={ws.id}>{ws.name}</li>
        ))}
      </ul>
    </div>
  );
}
```
