# Authentication

This document details the authentication system implemented in the SP Banking App.

## Overview

The authentication system is built using:

1. **Appwrite Authentication** - Backend auth provider
2. **Next.js Middleware** - Route protection
3. **Custom Auth Components** - UI for authentication
4. **Client/Server Auth Utilities** - Separation of concerns

## Architecture

The auth system follows a strict client/server separation pattern:

### Client-side Authentication

Located in `/lib/auth/client-auth.ts`, this handles:

- User login/logout in the browser
- Session management
- Client-side auth state
- Error handling

### Server-side Authentication

Located in `/lib/auth/server-auth.ts`, this handles:

- Server-side auth checks
- Cookie management
- Session validation
- Protected route access

### Middleware Protection

Located in `/middleware.ts`, this:

- Intercepts all requests
- Checks auth cookie
- Redirects unauthenticated users
- Prevents authenticated users from accessing auth pages

## Authentication Flow

1. **User Registration**

   - User submits registration form
   - Server creates user in Appwrite
   - Auth cookie is set
   - User is redirected to dashboard

2. **User Login**

   - User submits login form
   - Server creates session in Appwrite
   - Auth cookie is set
   - User is redirected to dashboard

3. **Session Validation**

   - Middleware checks for auth cookie
   - Server validates session with Appwrite
   - Access is granted or user is redirected

4. **Logout**
   - User triggers logout
   - Server deletes session in Appwrite
   - Auth cookie is cleared
   - User is redirected to login page

## Error Handling

The auth system includes standardized error handling:

- `translateAppwriteError` - Converts Appwrite errors to user-friendly messages
- `logAuthError` - Client-side auth error logging
- `logServerAuthError` - Server-side auth error logging

## Usage Examples

### Protected Server Component

```tsx
import { serverAuth } from "@/lib/auth/server-auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/route";

export default async function ProtectedPage() {
  // Check if user is authenticated
  const isLoggedIn = await serverAuth.isLoggedIn();

  if (!isLoggedIn) {
    redirect(ROUTES.SIGN_IN);
  }

  // Get the current user
  const user = await serverAuth.getUser();

  return (
    <div>
      <h1>Welcome, {user?.name || "User"}</h1>
      {/* Protected content */}
    </div>
  );
}
```

### Client-side Auth Hook

```tsx
"use client";

import { useState } from "react";
import { clientAuth } from "@/lib/auth/client-auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await clientAuth.login(email, password);

      if (result.success) {
        router.push(ROUTES.HOME);
        return true;
      } else {
        setError(result.error || "Login failed");
        return false;
      }
    } catch (err) {
      setError("An unexpected error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Similar implementations for register, logout, etc.

  return {
    login,
    isLoading,
    error,
  };
}
```

## Security Considerations

1. **HTTPS Only** - All communication is over HTTPS
2. **HttpOnly Cookies** - Auth cookies are HttpOnly for XSS protection
3. **CSRF Protection** - SameSite cookie attribute
4. **Rate Limiting** - Implemented on auth endpoints
5. **Error Sanitization** - Error messages don't leak sensitive information
