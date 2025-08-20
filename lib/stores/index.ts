"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "./auth-store-rewritten";

/**
 * Hook to initialize all stores in the application
 */
export function useInitializeStores() {
  const [initialized, setInitialized] = useState(false);
  const { initialize: initAuth } = useAuthStore();

  // Initialize all stores
  const initialize = useCallback(async () => {
    if (initialized) return;

    try {
      console.log("useInitializeStores: Starting initialization");
      // Initialize auth store
      await initAuth();
      console.log("useInitializeStores: Auth initialized");

      // Add initialization for other stores here if needed

      setInitialized(true);
      console.log("useInitializeStores: All stores initialized");
    } catch (error) {
      console.error("Failed to initialize stores:", error);
    }
  }, [initialized, initAuth]);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  return {
    initialized,
    initialize,
  };
}
