# SP Banking App Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Authentication](#authentication)
5. [Data Rendering Components](#data-rendering-components)
6. [Examples](#examples)

## Introduction

A modern banking application built with Next.js and Appwrite.

### Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Transaction history
- Fund transfers between accounts
- Responsive dashboard interface

## Getting Started

### Prerequisites

1. Create an Appwrite account and project at [cloud.appwrite.io](https://cloud.appwrite.io)
2. Set up Appwrite collections for users, bank accounts, and transactions
3. Configure your environment variables in `.env.local` file

### Environment Setup

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_DATABASE_ID=your_database_id
APPWRITE_USER_COLLECTION_ID=your_user_collection_id
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id
```

### Installation

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Architecture

The application uses Next.js 14 with App Router and follows a modular architecture:

- `app/`: Contains all routes and page components
- `components/`: Reusable UI components
- `lib/`: Utility functions, hooks, and business logic
- `public/`: Static assets
- `types/`: TypeScript type definitions

## Authentication

This project includes a modular, multi-step authentication system built with React Hook Form, Zod, and Appwrite.

### Authentication Components

- Form fields: reusable `TextField`, `PasswordField`, and `CheckboxField` components with validation, icons, and accessibility states.
- Form scaffolding: `FormStep`, `StepIndicator`, and `FormNavigation` to power the multi-step sign-up flow.
- Hook: `useAuthForm` centralizes step logic, validation, and submission; integrates Zod schemas from `lib/validations.ts`.
- Main UI: `components/auth/AuthForm.tsx` renders sign-in and a 3-step sign-up (Personal, Address, Financial).

### Authentication Architecture

Our authentication system has a clear separation between client and server components:

- `lib/auth/client-auth.ts`: Client-side authentication wrapper with error handling
- `lib/auth/server-auth.ts`: Server-side authentication operations and cookie management
- `lib/actions/auth.actions.ts`: Server actions for login, registration, and logout
- `middleware.ts`: Route protection and redirection logic

### Validation

- Sign-in: email, password, remember-me.
- Sign-up: personal info, address, PAN/terms. PAN is normalized to uppercase and schema-validated.

### Best Practices

- Separation of concerns: presentational components vs. form logic vs. validation schemas.
- Accessibility: labeled inputs, focus styles, clear error states.
- Type safety: TypeScript throughout; Zod schemas generate types for form values.

## Data Rendering Components

This set of components and hooks provides a standardized way to handle data loading, error states, and empty states in your application.

### DataStateRenderer

A component that renders different UI based on data loading state.

#### Props

| Prop            | Type                                                | Description                                                |
| --------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| data            | `T \| null`                                         | The data to be rendered                                    |
| isLoading       | `boolean`                                           | Whether the data is loading                                |
| error           | `unknown \| null`                                   | Any error that occurred during data fetching               |
| children        | `React.ReactNode \| ((data: T) => React.ReactNode)` | The content to render when data is available               |
| onRetryAction   | `() => Promise<void>`                               | A server action to retry the data fetch                    |
| loadingFallback | `React.ReactNode`                                   | Custom loading UI (optional)                               |
| errorFallback   | `React.ReactNode`                                   | Custom error UI (optional)                                 |
| emptyFallback   | `React.ReactNode`                                   | Custom empty state UI (optional)                           |
| loadingHeight   | `string`                                            | Height of the loading skeleton (default: "h-48")           |
| errorTitle      | `string`                                            | Title for the error state (default: "Could not load data") |
| emptyMessage    | `string`                                            | Message for the empty state (default: "No data available") |
| className       | `string`                                            | Additional CSS classes                                     |

#### Example Usage

```tsx
<DataStateRenderer
  data={accounts}
  isLoading={isLoading}
  error={error}
  onRetryAction={retryFetchAction}
  errorTitle="Could not load your accounts"
  emptyMessage="No accounts found. Please add a bank account."
>
  {(accounts) => (
    <div className="grid gap-4">
      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  )}
</DataStateRenderer>
```

### Hooks

#### useDataStates

A basic hook for managing data loading states.

```tsx
const { data, isLoading, error, setData, setIsLoading, setError } =
  useDataStates<T>();
```

#### useDataFetching

An advanced hook that combines data fetching with state management.

```tsx
const { data, isLoading, error, fetchData, retryFetch } =
  useDataFetching<T>(fetchFunction);
```

### Where To Use

The data state components should be used in any part of the app that loads data from an API or database:

1. **Account Pages** - Account lists, details, balances, connected banks
2. **Transaction Pages** - Transaction lists, details, history
3. **Card Pages** - Card lists, details, activities
4. **Transfer Pages** - Transfer history, transfer forms
5. **Profile Pages** - User details, preferences

## Examples

The SP Banking App includes several examples of implementations:

### Implementation Examples

1. **Cards Client Page**

   ```tsx
   // Example from cards/client.tsx
   <DataStateRenderer
     data={cards}
     isLoading={isLoading}
     error={error}
     onRetryAction={fetchCards}
   >
     {(cardData) => <CardListSection cards={cardData} />}
   </DataStateRenderer>
   ```

2. **Accounts Implementation**

   ```tsx
   // Example from accounts/page.tsx
   export default function AccountsPage() {
     const {
       data: accounts,
       isLoading,
       error,
       fetchData: fetchAccounts,
     } = useDataFetching(getAccounts);

     useEffect(() => {
       fetchAccounts();
     }, [fetchAccounts]);

     return (
       <DataStateRenderer
         data={accounts}
         isLoading={isLoading}
         error={error}
         onRetryAction={fetchAccounts}
       >
         {(accountData) => <AccountListSection accounts={accountData} />}
       </DataStateRenderer>
     );
   }
   ```

### UI State Components

The application includes several UI components for different data states:

1. `LoadingState` - Skeleton loader for data fetching
2. `ErrorState` - Error display with retry functionality
3. `EmptyState` - Message for empty data
4. `NoPermissionState` - Message for permission issues
5. `NetworkErrorState` - Message for network errors

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
