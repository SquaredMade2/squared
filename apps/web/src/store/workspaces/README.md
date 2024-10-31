
# Workspace Store

## OverView

The Workspace Store manages workspaces in the application, allowing users to create, update, delete, and manage workspaces. This store is implemented using Zustand with persistence in sessionStorage to ensure data is maintained across sessions. The store also provides methods for inviting users to a workspace and joining a workspace through an invitation token.

This README provides detailed documentation on the store's structure and methods, including examples of usage.

## Table of Contents

1. [Workspace Types](#workspace-types)
    - [WorkspaceResponse](#workspaceresponse)
2. [Workspace API](#workspace-api)
    - [addWorkspace](#addworkspace)
    - [getWorkspace](#getworkspace)
    - [updateWorkspace](#updateworkspace)
    - [deleteWorkspace](#deleteworkspace)
    - [getAllWorkspaces](#getallworkspaces)
    - [inviteToWorkspace](#invitetoworkspace)
    - [joinWorkspace](#joinworkspace)
3. [Session Persistance](#session-persistance)
4. [Usage Examples](#usage-examples)

## Workspace Types

### WorkspaceResponse

The `WorkspaceResponse` type defines the structure of data returned from the API when creating or updating a workspace.

```typescript
interface WorkspaceResponse {
  workspace: Workspace | null; // The Workspace object if successfully processed, otherwise null
  message?: string; // A message describing the result of the operation
  variant: "default" | "destructive"; // Type of toast to display
}
```

## Workspace API

### `addWorkspace`

The `addWorkspace` function creates a new workspace and assigns it to a user. The function generates a unique ID for the workspace and posts the data to the API. On success, the new workspace is added to the store.

```typescript
addWorkspace(
  workspace: Partial<Workspace>,
  userId: string,
): Promise<WorkspaceResponse> 
```

### `getWorkspace`

The `getWorkspace` function retrieves a specific workspace by its ID. If the workspace is found in the store's state, it is returned directly. If not, the function attempts to fetch the workspace from the API.

```typescript
getWorkspace(
  workspaceId: string
  ): Promise<WorkspaceResponse>
```

### `updateWorkspace`

The `updateWorkspace` function allows users to modify an existing workspace. It sends an update request to the API and, if successful, updates the workspace in the store's state.

```typescript
updateWorkspace(
  workspaceId: string,
  workspace: Partial<Workspace>,
): Promise<WorkspaceResponse>
```

### `deleteWorkspace`

The `deleteWorkspace` function deletes a workspace by its ID and removes it from the store's state. The function sends a delete request to the API.

```typescript
deleteWorkspace(
  workspaceId: string
  ): Promise<void>
```

### `getAllWorkspaces`

The `getAllWorkspaces` function retrieves all workspaces associated with a specific user from the API and stores them in the state.

```typescript
getAllWorkspaces(
  userId: string
  ): Promise<Workspace[]>
```

### `inviteToWorkspace`

The `inviteToWorkspace` function sends an invitation to one or more users to join a workspace. The function sends a request to the API with the workspace ID and the email(s) of the invitee(s).

```typescript
inviteToWorkspace(
  workspaceId: string,
  email: string | string[],
): Promise<void>
```

### `joinWorkspace`

The `joinWorkspace` function allows a user to join a workspace using an invitation token. The function sends a request to the API to join the workspace and updates the store with the new workspace if successful.

```typescript
joinWorkspace(
  token: string,
  userId: string,
): Promise<WorkspaceResponse>
```

## Session Persistance

The workspace store uses Zustand’s `persist` middleware to store data in sessionStorage. This ensures that the workspaces remain available across browser sessions.

```typescript
  {
    name: "workspace-store",
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

## Usage Examples

### Adding a New Workspace

```typescript
const { addWorkspace } = useWorkspaceStore();

const newWorkspace = await addWorkspace({
  name: "My New Workspace",
  url: "https://myworkspace.com",
}, userId);
```

### Fetching a Workspace

```typescript
const { getWorkspace } = useWorkspaceStore();

const workspace = await getWorkspace(workspaceId);
```

### Updating a Workspace

```typescript
const { updateWorkspace } = useWorkspaceStore();

const updatedWorkspace = await updateWorkspace(workspaceId, {
  name: "Updated Workspace Name",
});
```

### Inviting a User to a Workspace

```typescript
const { inviteToWorkspace } = useWorkspaceStore();

await inviteToWorkspace(workspaceId, "user@example.com");
```
