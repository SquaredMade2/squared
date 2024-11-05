# View Store

## Overview

The View Store is a Zustand-based store designed to manage and persist view-related settings for tasks and navigation in the application. It provides functionality to control layout preferences (list or grid views), task grouping and ordering, navbar visibility, and other display options. This document explains the store's structure and provides usage examples.

## Table of Contents

1. [View Store Types](#view-store-types)
    - [LastVisitedPathOption](#lastvisitedpathoption)
    - [DisplayOptions](#displayoptions)
2. [View Store API](#view-store-api)
    - [setView](#setview)
    - [getListOptions](#getlistoptions)
    - [getGridOptions](#getgridoptions)
    - [setShowNavbar](#setshownavbar)
    - [setShowMobileNavbar](#setshowmobilenavbar)
    - [setListViewOptions](#setlistviewoptions)
    - [setGridViewOptions](#setgridviewoptions)
    - [setLastVisitedPage](#setlastvisitedpage)
3. [LocalStorage Persistence](#localstorage-persistence)

## View Store Types

### LastVisitedPathOption

The `LastVisitedPathOption` type defines the available paths for viewing.

```typescript
type LastVisitedPathOption =
  (
  typeof LastVisitedPathOptions // Can be all, active, backlog, or sprints/current
  )[number]
  ViewPath;
```

### DisplayOptions

The DisplayOptions type defines how tasks are ordered, grouped, and displayed within the list and grid views, along with the settings for showing completed tasks and subtasks.

```typescript
interface DisplayOptions {
  taskOrder: {
    orderBy: TaskOrder; // Can be of type Title, Status, Priority, Assignee, Effort, Due Date, Updated, or Created
    orderAscending: boolean;
  };
  groupTasksBy: TaskGroup; // Can be of type Status, Assignee, Priority, or Label
  showCompletedTasks: {
    show: boolean;
    period: CompletedTaskPeriod; // Can be of type All, Past day, Past week, Past month, or None
  };
  showSubTasks: boolean;
  viewOptions: {
    listOptions: ViewOptions.List;
    gridOptions: ViewOptions.Grid;
  };
}
```

## View Store API

### `setView`

The `setView` function updates the current view mode (list or grid) in the store.

```typescript
setView: (view: View) => void;
```

### `getListOptions`

The `getListOptions` function retrieves the current list view options from the store.

```typescript
getListOptions: () => ViewOptions.List;
```

### `getGridOptions`

The `getGridOptions` function retrieves the current grid view options from the store.

```typescript
getGridOptions: () => ViewOptions.Grid;
```

### `setShowNavbar`

The `setShowNavbar` function updates the visibility of the main navbar.

```typescript
setShowNavbar: (input: boolean) => void;
```

### `setShowMobileNavbar`

The `setShowMobileNavbar` function updates the visibility of the mobile navbar.

```typescript
setShowMobileNavbar: (input: boolean) => void;
```

### `setListViewOptions`

The `setListViewOptions` function updates the display options for the list view.

```typescript
setListViewOptions: (input: Partial<DisplayOptions>) => void;
```

### `setGridViewOptions`

The `setGridViewOptions` function updates the display options for the grid view.

```typescript
setGridViewOptions: (input: Partial<DisplayOptions>) => void;
```

### `setLastVisitedPage`

The `setLastVisitedPage` function sets the last visited page path in the store.

```typescript
setLastVisitedPage: (input: LastVisitedPathOption) => void;
```

## LocalStorage Persistence

The view store uses Zustand’s persist middleware to store data in localStorage. This ensures that view preferences, such as task order and grouping, are retained across browser sessions.

```typescript
{
  name: "view-store",
  storage: {
    getItem: (name) => {
      const storedValue = localStorage.getItem(name);
      return storedValue ? JSON.parse(storedValue) : null;
    },
    setItem: (name, value) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  },
}
```
