# Implementation Guide: Data State Components

This guide shows where and how to implement the data state components in the SP Banking App.

## Where to Use

The data state components should be used in any part of the app that loads data from an API or database. This includes:

1. **Account Pages**

   - Account lists and details
   - Account balances
   - Connected banks

2. **Transaction Pages**

   - Transaction lists
   - Transaction details
   - Transaction history

3. **Card Pages**

   - Card lists
   - Card details
   - Card activities

4. **Transfer Pages**

   - Transfer history
   - Transfer forms

5. **Profile Pages**
   - User details
   - Preferences

## Implementation Examples

### Account List Page

```tsx
// app/(root)/accounts/page.tsx
"use client";

import { useEffect } from "react";
import { useDataStates } from "@/lib/hooks/useDataStates";
import { DataStateRenderer } from "@/components/DataStateRenderer";
import { AccountListSection } from "@/components/AccountListSection";
import { getAccounts } from "@/lib/actions/banking.actions";
import type { Account } from "@/types";

export default function AccountsPage() {
  const { data, isLoading, error, setData, setIsLoading, setError } =
    useDataStates<Account[]>();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const accounts = await getAccounts();
        setData(accounts);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch accounts")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [setData, setError, setIsLoading]);

  // Server action for retry button
  async function retryFetchAction() {
    "use server";
    // Server action
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Your Accounts</h1>

      <DataStateRenderer
        data={data}
        isLoading={isLoading}
        error={error}
        onRetryAction={retryFetchAction}
        errorTitle="Could not load your accounts"
        emptyMessage="You don't have any accounts yet."
      >
        {(accounts) => <AccountListSection accounts={accounts} />}
      </DataStateRenderer>
    </div>
  );
}
```

### Transaction List Using HOC

```tsx
// components/transactions/EnhancedTransactionsList.tsx
"use client";

import { TransactionsList } from "./TransactionsList";
import { withDataFetching } from "@/lib/hocs/withDataFetching";
import { getTransactions } from "@/lib/actions/banking.actions";
import type { Transaction } from "@/types";

// Create an enhanced version of TransactionsList with built-in data fetching
export const EnhancedTransactionsList = withDataFetching<Transaction[]>(
  TransactionsList,
  getTransactions
);

// Usage in page:
// <EnhancedTransactionsList />
```

### Dashboard Card Using Custom Hook

```tsx
// app/(root)/page.tsx
"use client";

import { useDataFetching } from "@/lib/hooks/useDataFetching";
import { BalanceCard } from "@/components/BalanceCard";
import { DataStateRenderer } from "@/components/DataStateRenderer";
import { getAccountBalances } from "@/lib/actions/banking.actions";
import type { AccountBalance } from "@/types";

function BalanceSummary() {
  const { data, isLoading, error, fetchData } =
    useDataFetching<AccountBalance[]>(getAccountBalances);

  // Server action for retry button
  async function retryFetchAction() {
    "use server";
    // Server action
  }

  return (
    <DataStateRenderer
      data={data}
      isLoading={isLoading}
      error={error}
      onRetryAction={retryFetchAction}
      errorTitle="Could not load your balances"
      emptyMessage="No account balances available"
      loadingHeight="h-36"
    >
      {(balances) => (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {balances.map((balance) => (
            <BalanceCard key={balance.id} balance={balance} />
          ))}
        </div>
      )}
    </DataStateRenderer>
  );
}
```

### Transfer Form with Error Handling

```tsx
// components/TransferForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useDataStates } from "@/lib/hooks/useDataStates";
import { DataStateRenderer } from "@/components/DataStateRenderer";
import { ErrorState } from "@/components/ui/data-states";
import {
  initiateTransfer,
  getSourceAccounts,
} from "@/lib/actions/banking.actions";
import type { Account } from "@/types";

export function TransferForm() {
  const [transferError, setTransferError] = useState<Error | null>(null);

  // For fetching source accounts
  const {
    data: accounts,
    isLoading,
    error,
    setData,
    setIsLoading,
    setError,
  } = useDataStates<Account[]>();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoading(true);
        const accounts = await getSourceAccounts();
        setData(accounts);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch accounts")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [setData, setError, setIsLoading]);

  // Handle form submission
  const handleSubmit = async (formData: FormData) => {
    try {
      setTransferError(null);
      // Process transfer
      await initiateTransfer(formData);
      // Show success message
    } catch (err) {
      setTransferError(
        err instanceof Error ? err : new Error("Transfer failed")
      );
    }
  };

  // Server action for retry button
  async function retryFetchAction() {
    "use server";
    // Server action
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Transfer Money</h2>

      {/* Show transfer-specific errors */}
      {transferError && (
        <ErrorState error={transferError} title="Transfer Failed" />
      )}

      {/* Load accounts for the form */}
      <DataStateRenderer
        data={accounts}
        isLoading={isLoading}
        error={error}
        onRetryAction={retryFetchAction}
        errorTitle="Could not load your accounts"
        emptyMessage="You don't have any accounts for transfers."
      >
        {(accounts) => (
          <form action={handleSubmit} className="space-y-4">
            {/* Form fields here */}
          </form>
        )}
      </DataStateRenderer>
    </div>
  );
}
```

## Implementation Checklist

As you implement these components throughout the app, use this checklist:

- [ ] Accounts list page
- [ ] Account details page
- [ ] Transactions list page
- [ ] Transaction details page
- [ ] Cards list page
- [ ] Card details page
- [ ] Transfer history page
- [ ] Transfer form
- [ ] Connected banks page
- [ ] User profile page
- [ ] Dashboard components
- [ ] Settings pages

## Testing Your Implementation

1. Test loading states by adding artificial delays
2. Test error states by temporarily returning errors
3. Test empty states by returning empty arrays
4. Test retry functionality to ensure it works correctly

---

Use this guide to systematically implement the data state components throughout the SP Banking App.
