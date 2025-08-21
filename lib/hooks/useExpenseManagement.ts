"use client";

import { useUrlState } from "@/lib/url-state";

/**
 * Default expense management state
 */
export const DEFAULT_EXPENSE_MANAGEMENT = {
  category: "All",
  period: "30d", // '7d', '30d', '90d', '1y', 'all'
  sortBy: "date", // 'date', 'amount', 'category'
  sortOrder: "desc", // 'asc', 'desc'
};

/**
 * Hook for managing expense management view in URL
 */
export function useExpenseManagementState() {
  return useUrlState(DEFAULT_EXPENSE_MANAGEMENT, {
    serialize: {
      category: (value) =>
        value === DEFAULT_EXPENSE_MANAGEMENT.category ? undefined : value,
      period: (value) =>
        value === DEFAULT_EXPENSE_MANAGEMENT.period ? undefined : value,
      sortBy: (value) =>
        value === DEFAULT_EXPENSE_MANAGEMENT.sortBy ? undefined : value,
      sortOrder: (value) =>
        value === DEFAULT_EXPENSE_MANAGEMENT.sortOrder ? undefined : value,
    },
  });
}

export type ExpenseFormMode = "add" | "edit" | "hidden";

/**
 * Default expense form state
 */
export const DEFAULT_EXPENSE_FORM = {
  mode: "hidden" as ExpenseFormMode,
  expenseId: "",
  amount: "",
  category: "Food",
  date: "",
  note: "",
};

/**
 * Hook for managing expense form in URL
 */
export function useExpenseFormState() {
  return useUrlState(DEFAULT_EXPENSE_FORM, {
    serialize: {
      mode: (value) =>
        value === DEFAULT_EXPENSE_FORM.mode ? undefined : value,
      expenseId: (value) => value || undefined,
      amount: (value) => value || undefined,
      category: (value) =>
        value === DEFAULT_EXPENSE_FORM.category ? undefined : value,
      date: (value) => value || undefined,
      note: (value) => value || undefined,
    },
  });
}
