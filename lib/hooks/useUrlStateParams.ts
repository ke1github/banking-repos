"use client";

import { useUrlState } from "@/lib/url-state";

/**
 * Default account selection state
 */
export const DEFAULT_ACCOUNT_SELECTION = {
  accountId: "",
  view: "details", // 'details', 'transactions', 'settings'
  period: "30d", // '7d', '30d', '90d', '1y', 'all'
};

/**
 * Hook for managing selected account in URL
 * This is useful for allowing users to share specific account views
 */
export function useAccountSelectionState() {
  return useUrlState(DEFAULT_ACCOUNT_SELECTION, {
    // Only include non-default values in URL
    serialize: {
      accountId: (value) => value || undefined,
      view: (value) =>
        value === DEFAULT_ACCOUNT_SELECTION.view ? undefined : value,
      period: (value) =>
        value === DEFAULT_ACCOUNT_SELECTION.period ? undefined : value,
    },
  });
}

/**
 * Default dashboard view state
 */
export const DEFAULT_DASHBOARD_VIEW = {
  tab: "overview", // 'overview', 'accounts', 'cards', 'insights'
  showInactive: "false",
  timeFrame: "month", // 'week', 'month', 'quarter', 'year'
};

/**
 * Hook for managing dashboard view preferences in URL
 */
export function useDashboardViewState() {
  return useUrlState(DEFAULT_DASHBOARD_VIEW, {
    // Parse boolean values
    parse: {
      showInactive: (value) => (value === "true" ? "true" : "false"),
    },
    // Serialize boolean values
    serialize: {
      showInactive: (value) => (value === "true" ? "true" : "false"),
      tab: (value) =>
        value === DEFAULT_DASHBOARD_VIEW.tab ? undefined : value,
      timeFrame: (value) =>
        value === DEFAULT_DASHBOARD_VIEW.timeFrame ? undefined : value,
    },
  });
}

/**
 * Default card view state
 */
export const DEFAULT_CARD_VIEW = {
  cardId: "",
  tab: "transactions", // 'transactions', 'details', 'statements'
  dateRange: "3m", // '1m', '3m', '6m', '1y', 'all'
};

/**
 * Hook for managing card view state in URL
 */
export function useCardViewState() {
  return useUrlState(DEFAULT_CARD_VIEW, {
    serialize: {
      cardId: (value) => value || undefined,
      tab: (value) => (value === DEFAULT_CARD_VIEW.tab ? undefined : value),
      dateRange: (value) =>
        value === DEFAULT_CARD_VIEW.dateRange ? undefined : value,
    },
  });
}
