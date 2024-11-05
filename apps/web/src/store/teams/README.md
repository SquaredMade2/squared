
# Teams Store

## Overview

The Team Store system is designed to manage team-related tasks, actions, and events. This store provides state management and persistence, allowing for easy interaction with tasks, commits, and other team events. This README provides detailed documentation on the types, actions, and functions used in the Team Store.

## Table of Contents

1. [Teams Store Types](#teams-store-types)
    - [TeamState](#teamstate)
    - [TeamResponse](#teamresponse)
    - [SprintResponse](#sprintresponse)
    - [RetrospectiveItemResponse](#retrospectiveitemresponse)
    - [InitializeSprintsBody](#initializesprintsbody)
    - [RetrospectiveData](#retrospectivedata)
2. [Teams Store API](#teams-store-api)
    - [addTeam](#addteam)
    - [getTeam](#getteam)
    - [setCurrentTeam](#setcurrentteam)
    - [updateTeam](#updateteam)
    - [deleteTeam](#deleteteam)
    - [getAllTeams](#getallteams)
    - [initializeSprints](#initializesprints)
    - [getSprints](#getsprints)
    - [updateSprint](#updatesprint)
    - [setCurrentSprint](#setcurrentsprint)
    - [startNextSprint](#startnextsprint)
    - [getSprintTasks](#getsprinttasks)
    - [endSprint](#endsprint)
    - [addRetrospectiveItem](#addretrospectiveitem)
    - [updateRetrospectiveItemType](#updateretrospectiveitemtype)
    - [getRetrospectiveItems](#getretrospectiveitems)
3. [Session Persistence](#session-persistence)

## Teams Store Types

### TeamState

The `TeamState` type defines the state structure managed by the store.

```typescript
type TeamState = {
  teams: Team[];                
  currentTeam: Team | null;     
  sprints: Sprint[];            
  currentSprint: Sprint | null; 
};
```

### TeamResponse

The `TeamResponse` defines the structure of the data returned from an API response for team data.

```typescript
interface TeamResponse {
  team: Team | null;
  message?: string;
  variant: "default" | "destructive";
}
```

### SprintResponse

The `SprintResponse` defines the structure of the data returned from an API response for sprint data.

```typescript
interface SprintResponse {
  sprint: Sprint | null;
  message?: string;
  variant: "default" | "destructive";
}
```

### RetrospectiveItemResponse

The `RetrospectiveItemResponse` defines the structure of the data returned from an API response for retrospective item data.

```typescript
interface RetrospectiveItemResponse {
  item: RetrospectiveItem | null;
  message?: string;
  variant: "default" | "destructive";
}
```

### InitializeSprintsBody

The `InitializeSprintsBody` defines the structure of the data returned from an API response for creating or updating a sprint.

```typescript
type InitializeSprintsBody = {
  count?: number;
  startDate?: Date;
};
```

### RetrospectiveData

The `RetrospectiveData` defines the structure of the data returned from an API response for creating or updating the data associated with a retrospective.

```typescript
type RetrospectiveData = {
  wentWell: RetrospectiveItem[];
  toImprove: RetrospectiveItem[];
  actionItems: RetrospectiveItem[];
};
```

## Teams Store API

### `addTeam`

Adds a new team to the database and the store.

```typescript
addTeam: (team: Partial<Team>) => Promise<TeamResponse>
```

### `getTeam`

Fetches a team by its `teamId` from the API or from the stored teams.

```typescript
getTeam: (teamId: string) => Promise<TeamResponse>
```

### `setCurrentTeam`

Sets the currently selected team in the store.

```typescript
setCurrentTeam: (team: Team) => void
```

### `updateTeam`

Updates an existing team's details and persists the changes in the database and the store.

```typescript
updateTeam: (teamId: string, team: Partial<Team>) => Promise<TeamResponse>
```

### `deleteTeam`

Deletes a team by its `teamId` from the database and the store.

```typescript
deleteTeam: (teamId: string) => Promise<void>
```

### `getAllTeams`

Fetches all teams associated with a specific workspace. Sets the team state with the fetched teams array.

```typescript
getAllTeams: (workspaceId: string) => Promise<Team[]>
```

### `initializeSprints`

Initializes sprints for a specific team, ensuring a maximum of three sprints are created. Sets the sprints state

```typescript
initializeSprints: (teamId: string, body: InitializeSprintsBody) => Promise<Sprint[]>
```

### `getSprints`

Fetches all sprints for a specific team from the backend and sets the sprints state.

```typescript
getSprints: (teamId: string) => Promise<Sprint[]>
```

### `updateSprint`

Updates the details of a sprint within a team for the database and the sprint state.

```typescript
updateSprint: (teamId: string, sprintId: string, sprint: Partial<Sprint>) => Promise<SprintResponse>
```

### `setCurrentSprint`

Sets the currently active sprint in the store.

```typescript
setCurrentSprint: (sprint: Sprint) => void
```

### `startNextSprint`

Starts the next sprint by moving tasks and creating a new sprint if needed.

```typescript
startNextSprint: (teamId: string, movedTasks: string[], sprintData?: Partial<Sprint>) => Promise<SprintResponse>
```

### `getSprintTasks`

Retrieves the tasks for a specific sprint from the backend.

```typescript
getSprintTasks: (teamId: string, sprintId: string) => Promise<Task[]>
```

### `endSprint`

Ends a sprint by archiving its tasks. Sets new sprint state.

```typescript
endSprint: (teamId: string, sprintId: string) => Promise<SprintResponse>
```

### `addRetrospectiveItem`

Adds an item to the sprint retrospective.

```typescript
addRetrospectiveItem: (sprintId: string, type: "wentWell" | "toImprove" | "actionItems", content: string) => Promise<RetrospectiveItemResponse>
```

### `updateRetrospectiveItemType`

Updates the type of a retrospective item.

```typescript
updateRetrospectiveItemType: (sprintId: string, itemId: string, type: "wentWell" | "toImprove" | "actionItems") => Promise<RetrospectiveItemResponse>
```

### `getRetrospectiveItems`

Fetches all retrospective items for a sprint.

```typescript
getRetrospectiveItems: (sprintId: string) => Promise<RetrospectiveData>
```

## Session Persistence

The Teams Store uses Zustand's persist middleware to store and retrieve the state from sessionStorage. This ensures that team and sprint data persists across page reloads but is cleared once the session ends.

```typescript
{
  name: "team-store",
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
