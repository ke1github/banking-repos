# Data Rendering Components

This set of components and hooks provides a standardized way to handle data loading, error states, and empty states in your application.

## Components

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

#### Example

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

### UI State Components

#### LoadingState

Shows a loading skeleton.

```tsx
<LoadingState height="h-48" />
```

#### ErrorState

Shows an error message with retry button.

```tsx
<ErrorState
  error={error}
  onRetry={retryFetchAction}
  title="Could not load data"
/>
```

#### EmptyState

Shows a message when no data is available.

```tsx
<EmptyState message="No data available" />
```

#### NoPermissionState

Shows a message when the user doesn't have permission.

```tsx
<NoPermissionState message="You don't have permission to view this content" />
```

#### NetworkErrorState

Shows a message for network-related errors.

```tsx
<NetworkErrorState onRetry={retryFetchAction} />
```

## Hooks

### useDataStates

A hook for managing data loading, error states, and success states.

```tsx
const { data, isLoading, error, setData, setIsLoading, setError, retryFetch } =
  useDataStates<Account[]>();
```

### useDataFetching

A hook that combines data fetching with state management.

```tsx
const { data, isLoading, error, fetchData } = useDataFetching<Account[]>(
  fetchAccountsFunction
);
```

## Higher-Order Components

### withDataFetching

A higher-order component that wraps a component with data fetching capabilities.

```tsx
const TransactionsWithFetching = withDataFetching(
  TransactionsList,
  fetchTransactionsFunction
);
```

## Best Practices

1. Use `DataStateRenderer` for components that fetch data and need loading/error/empty states
2. Use `useDataStates` hook when you need fine-grained control over the data states
3. Use `useDataFetching` hook to combine data fetching with state management
4. Use the UI state components directly for more customized layouts
5. Use `withDataFetching` HOC for reusable components that always fetch the same data

## Next.js Server Components Notes

When using these components with Next.js server components:

1. The `onRetryAction` prop should be a server action
2. For client components, you may need a client-side retry mechanism as well
3. State is managed on the client side, but data fetching can be done on the server

## Example Implementation

See the examples in the `components/examples` directory:

- `AccountsExample.tsx` - Basic implementation using `DataStateRenderer`
- `ConnectedBanksExample.tsx` - Using mock data with `DataStateRenderer`
- `RecentTransactionsWithHOC.tsx` - Using the HOC pattern

---

Created for the SP Banking App to standardize data loading and error handling.
