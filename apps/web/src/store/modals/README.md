# Modals Store

## Overview

The Modals Store is a Zustand-based store designed to manage various modal events and rename and new issue data. It provides a simple API for setting view states for `New Issue`, `Task Rename`, `Search Command`, `Workspace Invite` and `Switch Workspace` modals as well as rename and new issue data states. This document explains the store's functionality.

## Table of Contents

1. [Modals Store State](#modals-store-state)
    - [showNewIssue](#shownewissue)
    - [showCommand](#showcommand)
    - [showRename](#showrename)
    - [renameData](#renamedata)
    - [showWorkspaceInvite](#showworkspaceinvite)
    - [showSwitchWorkspace](#showswitchworkspace)
    - [showTaskSelector](#showtaskselector)
    - [newIssueData](#newissuedata)
2. [Modals Store Actions](#modals-store-actions)
    - [setShowNewIssue](#setshownewissue)
    - [setShowRename](#setshowrename)
    - [setRenameData](#setrenamedata)
    - [setNewIssueData](#setnewissuedata)
    - [setShowCommand](#setshowcommand)
    - [setShowWorkspaceInvite](#setshowworkspaceinvite)
    - [setShowSwitchWorkspace](#setshowswitchworkspace)
    - [setShowTaskSelector](#setshowtaskselector)

## Modals Store State

### `showNewIssue`

The `showNewIssue` is a boolean state value used to track whether to show the New Issue Modal or not.

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

### `newIssueData`

The `newIssueData` is an object state value that contains the data used to create a new issue.

## Modals Store Actions

### `setShowNewIssue`

The `setShowNewIssue` function is used to update the showNewIssue state.

```typescript
setShowNewIssue(input) {
  set({ showNewIssue: input });
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

### `setNewIssueData`

The `setNewIssueData` function is used to update the newIssueData state.

```typescript
setNewIssueData(task) {
  set({ newIssueData: task });
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
