# Components

This document provides documentation for the key reusable components in the SP Banking App.

## Data State Components

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
import { DataStateRenderer } from "@/components/DataStateRenderer";
import { getAccounts } from "@/lib/actions/banking.actions";
import { useState } from "react";

export default function AccountsList() {
  const [accounts, setAccounts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Example fetch function
  async function fetchAccounts() {
    try {
      setIsLoading(true);
      const data = await getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DataStateRenderer
      data={accounts}
      isLoading={isLoading}
      error={error}
      onRetryAction={fetchAccounts}
    >
      {(data) => (
        <div>
          {data.map((account) => (
            <div key={account.id} className="p-4 border rounded">
              <h3>{account.name}</h3>
              <p>${account.balance}</p>
            </div>
          ))}
        </div>
      )}
    </DataStateRenderer>
  );
}
```

### ErrorState

Component for displaying error messages with retry functionality.

#### Props

| Prop        | Type                  | Description                         |
| ----------- | --------------------- | ----------------------------------- |
| title       | `string`              | Error title                         |
| message     | `string`              | Error message                       |
| retryAction | `() => Promise<void>` | Function to retry the failed action |
| className   | `string`              | Additional CSS classes              |

### LoadingState

Component for displaying loading skeletons.

#### Props

| Prop      | Type     | Description            |
| --------- | -------- | ---------------------- |
| height    | `string` | Height of the skeleton |
| className | `string` | Additional CSS classes |

### EmptyState

Component for displaying empty state messages.

#### Props

| Prop      | Type     | Description            |
| --------- | -------- | ---------------------- |
| message   | `string` | Message to display     |
| className | `string` | Additional CSS classes |

## Auth Components

### AuthForm

Reusable authentication form for login and registration.

#### Props

| Prop      | Type                         | Description             |
| --------- | ---------------------------- | ----------------------- |
| mode      | `"signin" \| "signup"`       | Form mode               |
| onSubmit  | `(data: FormValues) => void` | Form submission handler |
| isLoading | `boolean`                    | Loading state           |
| error     | `string`                     | Error message           |
| className | `string`                     | Additional CSS classes  |

## UI Components

### Button

Reusable button component with multiple variants.

#### Props

| Prop      | Type                                            | Description             |
| --------- | ----------------------------------------------- | ----------------------- |
| variant   | `"default" \| "outline" \| "ghost"`             | Button style variant    |
| size      | `"sm" \| "md" \| "lg"`                          | Button size             |
| isLoading | `boolean`                                       | Loading state           |
| className | `string`                                        | Additional CSS classes  |
| children  | `React.ReactNode`                               | Button content          |
| ...rest   | `React.ButtonHTMLAttributes<HTMLButtonElement>` | Other button attributes |

### UserAvatar

Avatar component that shows user image or initials fallback.

#### Props

| Prop              | Type                                   | Description                     |
| ----------------- | -------------------------------------- | ------------------------------- |
| user              | `User`                                 | User object with name/image     |
| size              | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | Avatar size                     |
| className         | `string`                               | Additional CSS classes          |
| fallbackClassName | `string`                               | Classes for the fallback avatar |
