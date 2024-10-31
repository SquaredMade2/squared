
# Comment Store

## Overview

The Comment Store is a Zustand-based store designed to manage and persist task and commit events. It provides a simple API for adding and fetching events through API calls, with data stored in sessionStorage for persistence across user sessions. This document explains the store's functionality and provides usage examples.

## Table of Contents

1. [CommentResponse Type](#commentresponse-type)
2. [Comment Store Api](#comment-store-api)
    - [addComment](#addcomment)
    - [updateComment](#updatecomment)
    - [deleteComment](#deletecomment)
    - [getComment](#getcomment)
    - [getAllComments](#getallcomments)

## CommentResponse Type

The `CommentResponse` type is used to describe the structure of data returned from the API.

```typescript
type CommentResponse = {
  comment: Comment | null; // Can either be a comment object or null
  message?: string;        // May contain a message
  variant: "default" | "destructive"; // Type of toast to display
}
```

## Comment Store API

### `addComment`

The `addComment` method adds a new comment event to the store and sends it to the backend via an API call.

```typescript
addComment: (
  comment: Partial<Comment> // Comment object to be added
) => Promise<CommentResponse>
```

### `updateComment`

The `updateComment` method updates a specified comment based on a given ID and sends it to the backend via an API call.

```typescript
updateComment: (
  commentId: string,        // Comment ID related to the comment to update
  comment: Partial<Comment> // Comment object containing updated data
) => Promise<CommentResponse>
```

### `deleteComment`

The `deleteComment` method deletes a specified comment based on a given ID and sends it to the backend via an API call.

```typescript
deleteComment: (
  commentId: string // Comment ID related to the comment to delete
) => Promise<void>
```

### `getComment`

The `getComment` method fetches a specified comment from the backend.

```typescript
getComment: (
  commentId: string // Comment ID related to the comment to fetch
  ) => Promise<CommentResponse>
```

### `getAllComments`

The `getAllComment` method fetches all comments associated with a specified task from the backend.

```typescript
getAllComments: (
  taskId: string // Task ID related to the task which all comments will be fetched
  ) => Promise<Comment[]>
```
