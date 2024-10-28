
# Auth Store

## Overview

The Auth Store is a Zustand-based store designed to manage and persist authentication events. It provides a simple API for registering, logging, logging out and verifying a user as well as password reset through API calls, with data stored in sessionStorage for persistence across user sessions. This document explains the store's functionality and provides usage examples.

## Table of Contents

1. [AuthReturn Type](#authreturn-type)
2. [Login Type](#login-type)
3. [Auth Store API](#auth-store-api)
    - [login](#login)
    - [register](#register)
    - [verifyUser](#verifyuser)
    - [logout](#logout)
    - [resetPasswordEmail](#resetpasswordemail)
    - [resetPassword](#resetpassword)
    - [checkTokenValid](#checktokenvalid)
    - [setUser](#setuser)
4. [Session Persistence](#session-persistence)

## AuthReturn Type

The `AuthReturn` type defines the structure of data returned from the API.

```typescript
type AuthReturn = {
  user: User | null; // User object if successfully found otherwise null
  message: string;   // String containing a message
  variant: "destructive" | "default"; // Type of toast to display
};
```

## Login Type

The `Login` type defines the structure for a login event. It includes the provider of the event, the type of event, the email associated with the event and may include an oauthId, passord, name, username and token.

```typescript
type Login = {
  provider: "credentials" | "oauth"; // Provider either being 'credentials' from the login inputs or 'oauth' for google login
  type: "register" | "login"; // Type of event
  email: string;          // Email associated with the user
  oauthId?: string;       // oauthId if using oauthId
  password?: string;      // User's password if provided
  name?: string;          // User's name if provided
  username?: string;      // User's username if provided
  token?: string | null;  // A workspace token provided by an email if an invite was sent
}
```

## Auth Store API

### `login`

The `login` function sends a request to the backend to check for an existing user and that the login information matches the user if they are found. May send a verification email if the user is yet to be verified. May also join a workspace if a valid token was provided. If the user tries to login using oauth and is not yet registered, as long as the email hasn't already been registered to another account and a valid password was created, the user will be created. Sets the user in state.

```typescript
login: (login: Login) => Promise<AuthReturn>
```

### `register`

The `register` function sends a request to the backend to create a new user. New user is created if no existing user is already registered with the given email and that the user provided a valid name and password. A verification email will be send to the user after account creation. May join a workspace if a valid token was provided. Sets the user in state.

```typescript
register: (login: Login) => Promise<AuthReturn>
```

### `verifyUser`

The `verifyUser` function sends a request to the backend to try and verify a user's email. If the provided token has not expired, the user's email will be successfully verified. Sets the user in state.

```typescript
verifyUser: (token: string) => Promise<AuthReturn>
```

### `logout`

The `logout` function sends a request to the backend to log the user out of the application. Sets the user state to null.

```typescript
logout: () => Promise<boolean>
```

### `resetPasswordEmail`

The `resetPasswordEmail` function sends a request to the backend to check that a user exists with the provided email. If so sends an email containing a reset password token to the user's email.

```typescript
resetPasswordEmail: (email: string) => Promise<AuthReturn>
```

### `resetPassword`

The `resetPassword` function sends a request to the backend to update a user's password if the provided token is valid.

```typescript
resetPassword: (token: string, newPassword: string) => Promise<AuthReturn>;
```

### `checkTokenValid`

The `checkTokenValid` function sends a request to the backend to check that the provided token is still valid and not yet expired.

```typescript
checkTokenValid: (token: string) => Promise<AuthReturn>;
```

### `setUser`

The `setUser` function updates the user state to either a user object or null.

```typescript
setUser: (user: User | null) => void;
```

## Session Persistence

The auth store uses Zustand’s `persist` middleware to store data in sessionStorage. This ensures that the auth remain available across browser sessions.

```typescript
{
  name: "auth-store",
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
