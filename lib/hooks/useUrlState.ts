"use client";

import { useUrlState } from "@/lib/url-state";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Default transaction filters
 */
export const DEFAULT_TRANSACTION_FILTERS = {
  type: "all",
  status: "all",
  dateFrom: "",
  dateTo: "",
  minAmount: "",
  maxAmount: "",
  searchTerm: "",
};

/**
 * Hook for managing transaction filter state in URL
 */
export function useTransactionFiltersState() {
  return useUrlState(DEFAULT_TRANSACTION_FILTERS, {
    // Use URL parse functions for special types
    parse: {
      minAmount: (value) => (value ? Number(value).toString() : ""),
      maxAmount: (value) => (value ? Number(value).toString() : ""),
    },
    // Prevent empty values from being in URL
    serialize: {
      minAmount: (value) => (value === "" ? undefined : String(value)),
      maxAmount: (value) => (value === "" ? undefined : String(value)),
      dateFrom: (value) => value || undefined,
      dateTo: (value) => value || undefined,
      searchTerm: (value) => value || undefined,
      type: (value) => (value === "all" ? undefined : value),
      status: (value) => (value === "all" ? undefined : value),
    },
  });
}

/**
 * Hook for tab navigation with URL state
 */
export function useTabNavigation<T extends string>(defaultTab: T) {
  const [{ tab }, setTab] = useUrlState({ tab: defaultTab });

  const setActiveTab = useCallback(
    (newTab: T) => {
      setTab({ tab: newTab });
    },
    [setTab]
  );

  return [tab as T, setActiveTab] as const;
}

/**
 * Hook for pagination state in URL
 */
export function usePaginationState(defaultPage = 1, defaultPageSize = 10) {
  return useUrlState(
    { page: defaultPage, pageSize: defaultPageSize },
    {
      parse: {
        page: (value) => (value ? Number(value) : defaultPage),
        pageSize: (value) => (value ? Number(value) : defaultPageSize),
      },
    }
  );
}

/**
 * Hook for sort state in URL
 */
export function useSortState<T extends string>(
  defaultField: T,
  defaultDirection: "asc" | "desc" = "asc"
) {
  return useUrlState(
    { sortBy: defaultField, sortDir: defaultDirection },
    {
      serialize: {
        sortBy: (value) => (value === defaultField ? undefined : value),
        sortDir: (value) => (value === "asc" ? undefined : value),
      },
    }
  );
}

/**
 * Hook for managing account selection in URL
 */
export function useAccountSelection() {
  const router = useRouter();
  const [{ accountId }, setAccountId] = useUrlState({ accountId: "" });

  // Handle account selection
  const selectAccount = useCallback(
    (id: string) => {
      setAccountId({ accountId: id });
    },
    [setAccountId]
  );

  // Navigate to account details
  const viewAccountDetails = useCallback(
    (id: string) => {
      router.push(`/accounts/${id}`);
    },
    [router]
  );

  // Check if the account is selected
  const isAccountSelected = useCallback(
    (id: string) => accountId === id,
    [accountId]
  );

  return {
    accountId: accountId || null,
    selectAccount,
    viewAccountDetails,
    isAccountSelected,
  };
}
