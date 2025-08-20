"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "./auth-store";

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
      // Initialize auth store
      await initAuth();

      // Add initialization for other stores here if needed

      setInitialized(true);
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
