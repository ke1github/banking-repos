# Architecture

This document outlines the architecture of the SP Banking App.

## Project Structure

```
banking_app/
├── app/                   # Next.js app router pages
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Protected app routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── ui/                # UI component library
│   └── ...                # Feature-specific components
├── lib/                   # Core utilities and functions
│   ├── actions/           # Server actions
│   ├── appwrite/          # Appwrite configuration
│   ├── auth/              # Auth utilities (client/server)
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── middleware.ts          # Next.js middleware for auth
```

## Architecture Patterns

### Client-Server Separation

The app follows Next.js 15's strict client/server component separation:

- **Server Components**: Data fetching, authentication checks, sensitive operations
- **Client Components**: Interactive UI, form handling, client-side state

All client components are marked with `"use client"` directive.

### Authentication Architecture

Authentication is implemented with a dual-layer approach:

1. **Appwrite Authentication**:

   - Backend authentication services via Appwrite
   - Session management
   - User data storage

2. **Middleware Protection**:
   - Route protection via Next.js middleware
   - Cookie-based authentication checks
   - Redirect logic for unauthenticated users

### Data Rendering Pattern

For handling loading, error, and empty states, we use:

1. **DataStateRenderer**: Component for conditional rendering based on data state
2. **withDataFetching**: Higher-order component for data fetching
3. **useDataStates**: Hook for managing data loading states

### Error Handling Strategy

The app implements a consistent error handling approach:

1. **Client-side errors**: Handled via client-logger system
2. **Server-side errors**: Handled via server-logger system
3. **UI error presentation**: Standardized through DataStateRenderer

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Appwrite (BaaS)
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database
- **Deployment**: Vercel
