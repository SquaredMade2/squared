
# Notification Store

## Overview

The Notification Store is a Zustand-based store designed to manage and persist notification events. It provides a simple API for creating, updating, deleting, and retrieving notifications, with data stored in sessionStorage for persistence across user sessions. This document explains the store's functionality and provides usage examples.

## Table of Contents

1. [NotificationResponse Type](#notificationresponse-type)
2. [NotificationTask Type](#notificationtask-type)
3. [Notification Store API](#notification-store-api)
    - [addNotification](#addnotification)
    - [updateNotification](#updatenotification)
    - [deleteNotification](#deletenotification)
    - [getAllNotifications](#getallnotifications)
    - [clearNotifications](#clearnotifications)
    - [updateManyNotifications](#updatemanynotifications)
    - [deleteManyNotifications](#deletemanynotifications)
4. [Session Persistence](#session-persistence)

## NotificationResponse Type

The `NotificationResponse` type defines the structure of data returned from the API when creating or updating notifications.

```typescript
type NotificationResponse = {
  notification: Notification | null;  // The notification object if successfully processed, otherwise null
  message?: string; // A message describing the result of the operation
  variant: "default" | "destructive"; // Type of toast to display
}
```

## NotificationTask Type

The `NotificationTask` type defines the structure of a notification, including associated task and workspace information.

```typescript
type NotificationTask = Notification & {
  Task: Task;
  Workspace: Workspace;
};
```

## Notification Store API

### `addNotification`

The `addNotification` function sends a request to the backend to create a new notification. If the notification is successfully created, it is added to the store's state.

```typescript
addNotification: (notification: Partial<Notification>) => Promise<NotificationResponse>
```

### `updateNotification`

The `updateNotification` function sends a request to the backend to update an existing notification by its ID. If the update is successful, the notification in the store's state is updated.

```typescript
updateNotification: (notificationId: string, notification: Partial<Notification>) => Promise<NotificationResponse>
```

### `deleteNotification`

The `deleteNotification` function sends a request to the backend to delete an existing notification by its ID. If successful, the notification is removed from the store's state.

```typescript
deleteNotification: (notificationId: string) => Promise<void>
```

### `getAllNotifications`

The `getAllNotifications` function retrieves all notifications for a given user from the backend. Notifications are sorted by creation date and stored in the state.

```typescript
getAllNotifications: (userId: string) => Promise<Notification[]>
```

### `clearNotifications`

The `clearNotifications` function clears the current user's notifications from the store.

```typescript
clearNotifications: (userId: string) => Promise<Notification[]>
```

### `updateManyNotifications`

The `updateManyNotifications` function sends a request to the backend to update multiple notifications at once. It updates the notifications in the store's state based on the response.

```typescript
updateManyNotifications: (notifications: NotificationTask[], data: Partial<Notification>) => Promise<NotificationTask[]>
```

### `deleteManyNotifications`

The `deleteManyNotifications` function deletes multiple notifications from the backend and removes them from the store's state.

```typescript
deleteManyNotifications: (notifications: NotificationTask[]) => Promise<void>
```

## Session Persistence

The notification store uses Zustand’s persist middleware to store data in sessionStorage. This ensures that notifications remain available across browser sessions.

```typescript
{
  name: "notification-store",
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
