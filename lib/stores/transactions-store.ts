"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { useAuthStore } from "./auth-store";
import { TransactionType } from "@/lib/actions/banking.actions";

// Mock API functions (replace with actual implementations)
const getAccountTransactions = async () => {
  // This is a placeholder - replace with actual API call
  return { transactions: [] };
};

export interface Transaction {
  id: string;
  accountId: string;
  toAccountId?: string;
  amount: number;
  type: TransactionType;
  description: string;
  category?: string;
  date: string;
  status: "pending" | "completed" | "failed";
}

export type TransactionFilter = {
  dateFrom?: string;
  dateTo?: string;
  type?: TransactionType | "all";
  minAmount?: number;
  maxAmount?: number;
  status?: Transaction["status"] | "all";
  accountId?: string;
  searchTerm?: string;
  category?: string;
};

interface TransactionsState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: TransactionFilter;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTransactions: (accountId?: string) => Promise<void>;
  setFilters: (filters: Partial<TransactionFilter>) => void;
  clearFilters: () => void;
  clearError: () => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  devtools((set, get) => ({
    transactions: [],
    filteredTransactions: [],
    filters: {
      type: "all",
      status: "all",
    },
    isLoading: false,
    error: null,

    // We're accepting accountId parameter for future implementation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fetchTransactions: async (_accountId) => {
      const userId = useAuthStore.getState().user?.id;

      if (!userId) {
        set({ error: "User not authenticated" });
        return;
      }

      try {
        set({ isLoading: true, error: null });

        // For demo purposes, we're not actually using userId or accountId in the API call
        // but in a real implementation, these would be passed to the API
        const result = await getAccountTransactions();

        if (!result.transactions) {
          set({
            transactions: [],
            filteredTransactions: [],
            isLoading: false,
          });
          return;
        }

        set({
          transactions: result.transactions,
          filteredTransactions: applyFilters(
            result.transactions,
            get().filters
          ),
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch transactions",
          isLoading: false,
        });
      }
    },

    setFilters: (newFilters) => {
      const currentFilters = get().filters;
      const updatedFilters = { ...currentFilters, ...newFilters };
      const filteredTransactions = applyFilters(
        get().transactions,
        updatedFilters
      );

      set({
        filters: updatedFilters,
        filteredTransactions,
      });
    },

    clearFilters: () => {
      const defaultFilters = {
        type: "all" as const,
        status: "all" as const,
      };

      set({
        filters: defaultFilters,
        filteredTransactions: applyFilters(get().transactions, defaultFilters),
      });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Helper function to apply filters to transactions
function applyFilters(
  transactions: Transaction[],
  filters: TransactionFilter
): Transaction[] {
  return transactions.filter((transaction) => {
    // Filter by date range
    if (
      filters.dateFrom &&
      new Date(transaction.date) < new Date(filters.dateFrom)
    ) {
      return false;
    }

    if (
      filters.dateTo &&
      new Date(transaction.date) > new Date(filters.dateTo)
    ) {
      return false;
    }

    // Filter by transaction type
    if (
      filters.type &&
      filters.type !== "all" &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    // Filter by amount range
    if (
      filters.minAmount !== undefined &&
      transaction.amount < filters.minAmount
    ) {
      return false;
    }

    if (
      filters.maxAmount !== undefined &&
      transaction.amount > filters.maxAmount
    ) {
      return false;
    }

    // Filter by status
    if (
      filters.status &&
      filters.status !== "all" &&
      transaction.status !== filters.status
    ) {
      return false;
    }

    // Filter by account
    if (filters.accountId && transaction.accountId !== filters.accountId) {
      return false;
    }

    // Filter by search term (description or category)
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      const matchesDescription = transaction.description
        .toLowerCase()
        .includes(searchTerm);
      const matchesCategory = transaction.category
        ?.toLowerCase()
        .includes(searchTerm);

      if (!matchesDescription && !matchesCategory) {
        return false;
      }
    }

    // Filter by category
    if (filters.category && transaction.category !== filters.category) {
      return false;
    }

    return true;
  });
}
