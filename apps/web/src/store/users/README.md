
# User Store

## Overview

The User Store is a Zustand-based store designed to manage and persist user-related data, including user profiles, avatars, and connected repositories. It provides a simple API for creating, updating, deleting, and retrieving users, with data stored in sessionStorage for persistence across user sessions. This document explains the store's functionality and provides usage examples.

## Table of Contents

1. [User Store Types](#user-store-types)
    - [UserAvatar](#useravatar)
    - [UserResponse](#userresponse)
2. [User Store API](#user-store-api)
    - [addUser](#adduser)
    - [updateUser](#updateuser)
    - [deleteUser](#deleteuser)
    - [getUser](#getuser)
    - [getAllUsers](#getallusers)
    - [getUserAvatars](#getuseravatars)
    - [getUserRepositories](#getuserrepositories)
3. [Session Persistence](#session-persistence)

## User Store Types

### UserAvatar

The `UserAvatar` type defines the structure of user avatar information.

```typescript
type UserAvatar = {
  id: string;               // User id
  name: string;             // User name
  avatarUrl: string | null; // Users avatar image otherwise null
};
```

### UserResponse

The `UserResponse` type defines the structure of data returned from the API when creating or updating users.

```typescript
interface UserResponse = {
  user: User | null;  // The user object if successfully processed, otherwise null
  message?: string; // A message describing the result of the operation
  variant: "default" | "destructive"; // Type of toast to display
}
```

## User Store API

### `addUser`

The `addUser` function sends a request to the backend to create a new user. If the user is successfully created, it is added to the store's state.

```typescript
addUser: (user: Partial<User>) => Promise<UserResponse>
```

### `updateUser`

The 'updateUser' function sends a request to the backend to update an existing user by their ID. If the update is successful, the user in the store's state is updated.

```typescript
updateUser: (userId: string, user: Partial<User>) => Promise<UserResponse>
```

### `deleteUser`

The `deleteUser` function sends a request to the backend to delete an existing user by their ID. If successful, the user is removed from the store's state.

```typescript
deleteUser: (userId: string) => Promise<void>
```

### `getUser`

The `getUser` function retrieves a specific user by their ID, either from the store's state or by making a request to the backend.

```typescript
getUser: (userId: string) => Promise<UserResponse>
```

### `getAllUsers`

The `getAllUsers` function retrieves all users for a given workspace from the backend and stores them in the state.

```typescript
getAllUsers: (workspaceId: string) => Promise<User[]>
```

### `getUserAvatars`

The `getUserAvatars` function retrieves the avatars associated with a specific user from the backend.

```typescript
getUserAvatars: (userId: string) => Promise<UserAvatar[]>
```

### `getUserRepositories`

The `getUserRepositories` function retrieves the repositories connected to a specific user from the backend and stores them in the state.

```typescript
getUserRepositories: (userId: string) => Promise<string[]>
```

## Session Persistence

The user store uses Zustand’s persist middleware to store data in sessionStorage. This ensures that user data, including profiles, avatars, and repositories, remain available across browser sessions.

```typescript
{
  name: "user-store",
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
