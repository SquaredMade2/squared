# Sprint Store

## Overview

This module provides a store for managing sprints using Zustand. The SprintStore includes functionality for adding, updating, and retrieving sprints. It offers a lightweight and type-safe solution for managing sprint-related state in React applications.

## Table of Contents

1. [SprintState Type](#sprintstate-type)
2. [Sprint API](#sprint-api)
   - [setSprint](#setsprint)
   - [setSprints](#setsprints)
   - [createSprint](#createsprint)
   - [updateSprint](#updatesprint)
3. [Usage](#usage)
4. [Installation](#installation)

## SprintState Type

The `SprintState` type defines the structure of the sprint store state:

```typescript
type SprintState = {
  sprints: Sprint[];
  sprint: Sprint | null;
};
```

## Sprint API

### `setSprint`

Sets the current active sprint in the store.

```typescript
 setSprint: (sprint: Sprint) => voidsetSprint: (sprint: Sprint) => void

```

### `setSprints`

Updates the entire list of sprints in the store.

```typescript
 setSprints: (sprints: Sprint[]) => voidsetSprints: (sprints: Sprint[]) => void

```

### `createSprint`

Adds a new sprint to the store.

```typescript
 createSprint: (sprint: Sprint) => voidcreateSprint: (sprint: Sprint) => void

```

### `updateSprint`

Updates an existing sprint in the store based on the sprint ID.

```typescript
 updateSprint: (sprint: Sprint) => voidupdateSprint: (sprint: Sprint) => void

```

## Usage

Here's an example of how to use the SprintStore:

```typescript
import { createSprintStore } from "@squaredmade/sprint-store";
import { createSprintStore } from "@squaredmade/sprint-store";

// Create a new store instance
const sprintStore = createSprintStore();

// Add a new sprint
sprintStore.getState().createSprint({
  id: "1",
  name: "Sprint 1",
  // ... other sprint properties
});

// Update a sprint
sprintStore.getState().updateSprint({
  id: "1",
  name: "Sprint 1 - Updated",
  // ... other sprint properties
});

// Set the current active sprint
const currentSprint = sprintStore.getState().sprints[0];
sprintStore.getState().setSprint(currentSprint);

// Get all sprints
const allSprints = sprintStore.getState().sprints;
```

## Installation

To install the Sprint Store in your project, run:

```shellscript
 npm install @squaredmade/sprint-storenpm install @squaredmade/sprint-store

```

Make sure you have Zustand installed as a peer dependency:

```shellscript
 npm install zustandnpm install zustand

```

## Types

The SprintStore uses the following types:

```typescript
import type { Sprint } from "@squaredmade/db";
import type { Sprint } from "@squaredmade/db";

type SprintState = {
  sprints: Sprint[];
  sprint: Sprint | null;
};

type SprintActions = {
  setSprint: (sprint: Sprint) => void;
  setSprints: (sprints: Sprint[]) => void;
  updateSprint: (sprint: Sprint) => void;
  createSprint: (sprint: Sprint) => void;
};

type SprintStore = SprintState & SprintActions;
```
