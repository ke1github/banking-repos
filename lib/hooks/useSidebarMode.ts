"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarMode = "banking" | "investment";

interface SidebarModeStore {
  mode: SidebarMode;
  setMode: (mode: SidebarMode) => void;
}

// Create a store for the sidebar mode with persistence
export const useSidebarMode = create<SidebarModeStore>()(
  persist(
    (set) => ({
      mode: "banking",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "sidebar-mode-storage",
    }
  )
);
