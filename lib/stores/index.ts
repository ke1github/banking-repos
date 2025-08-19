"use client";

import { useAuthStore } from "./auth-store";
import { useAccountsStore } from "./accounts-store";
import { useTransactionsStore } from "./transactions-store";
import { useNavigationStore } from "@/lib/navigation-store";

/**
 * Combined hook that provides all store access
 * This is a convenience hook to avoid having to import multiple stores in components
 */
export function useStore() {
  const auth = useAuthStore();
  const accounts = useAccountsStore();
  const transactions = useTransactionsStore();
  const navigation = useNavigationStore();

  return {
    auth,
    accounts,
    transactions,
    navigation,
  };
}

/**
 * Hook to initialize all stores on app start
 * Use this in a layout or app initialization component
 */
export function useInitializeStores() {
  const { auth, accounts } = useStore();

  // Function to initialize all data
  const initialize = async () => {
    // First, check if user is authenticated
    if (!auth.isAuthenticated) {
      await auth.refreshUser();
    }

    // If authenticated after refresh, load accounts and cards
    if (auth.isAuthenticated) {
      await Promise.all([accounts.fetchAccounts(), accounts.fetchCards()]);
    }
  };

  return { initialize };
}
