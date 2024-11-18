# Modals Store

## Overview

The Modals Store is a Zustand-based store designed to manage various modal events and rename and new task data. It provides a simple API for setting view states for `New Task`, `Task Rename`, `Search Command`, `Workspace Invite` and `Switch Workspace` modals as well as rename and new task data states. This document explains the store's functionality.

## Table of Contents

1. [Modals Store State](#modals-store-state)
    - [showNewTask](#shownewtask)
    - [showCommand](#showcommand)
    - [showRename](#showrename)
    - [renameData](#renamedata)
    - [showWorkspaceInvite](#showworkspaceinvite)
    - [showSwitchWorkspace](#showswitchworkspace)
    - [showTaskSelector](#showtaskselector)
    - [newTaskData](#newtaskdata)
2. [Modals Store Actions](#modals-store-actions)
    - [setShowNewTask](#setshownewtask)
    - [setShowRename](#setshowrename)
    - [setRenameData](#setrenamedata)
    - [setNewTaskData](#setnewtaskdata)
    - [setShowCommand](#setshowcommand)
    - [setShowWorkspaceInvite](#setshowworkspaceinvite)
    - [setShowSwitchWorkspace](#setshowswitchworkspace)
    - [setShowTaskSelector](#setshowtaskselector)

## Modals Store State

### `showNewTask`

The `showNewTask` is a boolean state value used to track whether to show the New Task Modal or not.

### `showCommand`

The `showCommand` is a boolean state value used to track whether to show the Command Search Modal or not.

### `showRename`

The `showRename` is a boolean state value used to track whether to show the Rename Modal or not.

### `renameData`

The `renameData` is state that is either set to null or an input object containing the task data to include the updated title.

### `showWorkspaceInvite`

The `showWorkspaceInvite` is a boolean state value used to track whether to show the Workspace Invite Modal or not.

### `showSwitchWorkspace`

The `showSwitchWorkspace` is a boolean state value used to track whether to show the Switch Workspace Modal or not.

### `showTaskSelector`

The `showTaskSelector` is a boolean state value used to track whether to show the Task Selector Modal or not.

### `newTaskData`

The `newTaskData` is an object state value that contains the data used to create a new task.

## Modals Store Actions

### `setShowNewTask`

The `setShowNewTask` function is used to update the showNewTask state.

```typescript
setShowNewTask(input) {
  set({ showNewTask: input });
}
```

### `setShowRename`

The `setShowRename` function is used to update the showRename state.

```typescript
setShowRename(input) {
  set({ showRename: input });
}
```

### `setRenameData`

The `setRenameData` function is used to update the renameData state.

```typescript
setRenameData(input) {
  set({ renameData: input });
}
```

### `setNewTaskData`

The `setNewTaskData` function is used to update the newTaskData state.

```typescript
setNewTaskData(task) {
  set({ newTaskData: task });
}
```

### `setShowCommand`

The `setShowCommand` function is used to update the showCommand state.

```typescript
setShowCommand(input) {
  set({ showCommand: input });
}
```

### `setShowWorkspaceInvite`

The `setShowWorkspaceInvite` function is used to update the showWorkspaceInvite state.

```typescript
setShowWorkspaceInvite(input) {
  set({ showWorkspaceInvite: input });
}
```

### `setShowSwitchWorkspace`

The `setShowSwitchWorkspace` function is used to update the showSwitchWorkspace state.

```typescript
setShowSwitchWorkspace(input) {
  set({ showSwitchWorkspace: input });
}
```

### `setShowTaskSelector`

The `setShowTaskSelector` function is used to update the showTaskSelector state.

```typescript
setShowTaskSelector(input) {
  set({ showTaskSelector: input });
}
```
