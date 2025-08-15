"use client";

import { create } from "zustand";

interface NavigationState {
  activeLink: string;
  setActiveLink: (link: string) => void;
}

export const useNavigationStore = create<NavigationState>(
  (set: (arg0: { activeLink: string }) => unknown) => ({
    activeLink: "/",
    setActiveLink: (link: string) => set({ activeLink: link }),
  })
);

export const useMobileMenuStore = create((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  toggle: () =>
    set((state: { isOpen: boolean }) => ({ isOpen: !state.isOpen })),
}));
