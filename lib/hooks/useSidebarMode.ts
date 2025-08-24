"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SidebarMode = "banking" | "investment";

interface SidebarModeStore {
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
  hydrate: () => void;
}

// Create a store for the sidebar mode with persistence
export const useSidebarMode = create<SidebarModeStore>()(
  persist(
    (set) => ({
      mode: "banking",
      setMode: (mode) => set({ mode }),
      hydrate: () => {
        try {
          const storedValue = localStorage.getItem("sidebar-mode-storage");
          if (storedValue) {
            const parsed = JSON.parse(storedValue);
            set({ mode: parsed.state.mode });
          }
        } catch (error) {
          // If localStorage is not available or parsing fails, we keep the default
          console.error("Failed to hydrate sidebar mode:", error);
        }
      },
    }),
    {
      name: "sidebar-mode-storage",
      // Skip hydration to prevent client/server mismatch
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
