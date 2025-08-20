"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthUser } from "@/lib/hooks/useAuth";

// Define the user type
interface User {
  id: string;
  email: string;
  name: string;
}

// Define the auth state
interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastUpdated: number;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

// Helper for safe localStorage access to prevent SSR issues
const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error("localStorage.getItem error", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("localStorage.setItem error", e);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("localStorage.removeItem error", e);
    }
  },
};

// Create the auth store
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoading: false, // Always initialize as false to prevent loading issues
        error: null,
        isAuthenticated: false,
        lastUpdated: Date.now(),

        // Initialize authentication from localStorage
        initialize: async () => {
          console.log("auth-store: Initialize called");

          // Check for existing user in localStorage
          const userJson = safeStorage.getItem("banking-user");
          if (userJson) {
            try {
              const authUser = JSON.parse(userJson);
              console.log("auth-store: Found existing user", authUser.email);

              // Update store with user data
              set({
                user: {
                  id: authUser.id,
                  email: authUser.email,
                  name: authUser.name,
                },
                isAuthenticated: true,
                isLoading: false,
                lastUpdated: Date.now(),
              });
              return;
            } catch (e) {
              console.error("Error parsing user data", e);
              safeStorage.removeItem("banking-user");
            }
          }

          // No user found, set unauthenticated state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            lastUpdated: Date.now(),
          });
        },

        // Handle login
        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            console.log(`Attempting login for: ${email}`);

            // Create mock user that matches our AuthUser structure
            const mockUser = {
              id: "mock-user-" + Math.random().toString(36).slice(2, 10),
              email,
              name: email.split("@")[0],
            };

            // Store in localStorage for our hook to find
            safeStorage.setItem("banking-user", JSON.stringify(mockUser));

            // Update store state - important to set isLoading: false
            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            const errorMessage =
              e instanceof Error ? e.message : "Login failed";
            set({
              isLoading: false,
              error: errorMessage,
              isAuthenticated: false,
            });
            return false;
          }
        },

        // Handle logout
        logout: async () => {
          set({ isLoading: true });

          try {
            // Remove user from localStorage
            safeStorage.removeItem("banking-user");

            // Reset auth state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            const errorMessage =
              e instanceof Error ? e.message : "Logout failed";
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        },

        // Handle signup
        signup: async (email: string, password: string, name: string) => {
          set({ isLoading: true, error: null });

          try {
            // Create mock user
            const mockUser = {
              id: "mock-user-" + Math.random().toString(36).slice(2, 10),
              email,
              name,
            };

            // Store in localStorage
            safeStorage.setItem("banking-user", JSON.stringify(mockUser));

            // Update store state
            set({
              user: mockUser,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            const errorMessage =
              e instanceof Error ? e.message : "Signup failed";
            set({ isLoading: false, error: errorMessage });
            return false;
          }
        },

        // Refresh user data
        refreshUser: async () => {
          const currentUser = get().user;
          if (!currentUser) return;

          set({ isLoading: true });

          try {
            // In a real app, we would fetch the latest user data
            // For now, just simulate a refresh
            set({
              isLoading: false,
              lastUpdated: Date.now(),
            });
          } catch (e) {
            const errorMessage =
              e instanceof Error ? e.message : "Refresh failed";
            set({ isLoading: false, error: errorMessage });
          }
        },

        // Clear error
        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "auth-store",
        // Only store minimal data in localStorage
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
