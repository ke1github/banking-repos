"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AuthUser } from "@/lib/hooks/useAuth";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  lastUpdated: number;

  // Actions
  initialize: () => Promise<void>;
  login: (
    email: string,
    password: string,
    remember?: boolean
  ) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (
    userId: string,
    secret: string,
    password: string,
    passwordConfirm: string
  ) => Promise<boolean>;
  clearError: () => void;
}

// Safe localStorage access - prevents SSR issues
const safeLocalStorage = {
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

// Implementation that uses our consolidated hooks
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isLoading: false, // Initialize as false to prevent loading state
        error: null,
        isAuthenticated: false,
        lastUpdated: Date.now(),

        initialize: async () => {
          console.log("auth-store: Initialize called");
          // Don't set loading to true here, as it causes loading issues
          // set({ isLoading: true });

          // Check for existing user in localStorage
          const userJson = safeLocalStorage.getItem("auth-storage-user");
          if (userJson) {
            try {
              const authUser: AuthUser = JSON.parse(userJson);
              console.log("auth-store: Found existing user", authUser.email);
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
              safeLocalStorage.removeItem("auth-storage-user");
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            lastUpdated: Date.now(),
          });
        },

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // In a real app, we would validate the password here
            console.log(
              `Attempted login with password: ${password.length} chars`
            );

            // Create mock user that matches our AuthUser structure
            const mockUser = {
              id: "mock-user-" + Math.random().toString(36).slice(2, 10),
              email,
              name: email.split("@")[0],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              emailVerified: false,
            };

            // Store in localStorage for our hook to find
            safeLocalStorage.setItem(
              "auth-storage-user",
              JSON.stringify(mockUser)
            );

            // Update store state
            set({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
              },
              isAuthenticated: true,
              isLoading: false,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            console.error("Login error:", e);
            set({
              error: e instanceof Error ? e.message : "Login failed",
              isLoading: false,
            });
            return false;
          }
        },

        logout: async () => {
          try {
            // Clear localStorage
            safeLocalStorage.removeItem("auth-storage-user");

            // Clear auth cookie
            if (typeof document !== "undefined") {
              document.cookie = "auth=; path=/; max-age=0";
            }

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            console.error("Logout error:", e);
            set({
              error: e instanceof Error ? e.message : "Logout failed",
              isLoading: false,
            });
            return false;
          }
        },

        signup: async (email: string, password: string, name: string) => {
          set({ isLoading: true, error: null });

          try {
            // Create mock user that matches our AuthUser structure
            const mockUser = {
              id: "mock-user-" + Math.random().toString(36).slice(2, 10),
              email,
              name,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              emailVerified: false,
            };

            // Store in localStorage for our hook to find
            safeLocalStorage.setItem(
              "auth-storage-user",
              JSON.stringify(mockUser)
            );

            // Update store state
            set({
              user: {
                id: mockUser.id,
                email: mockUser.email,
                name: mockUser.name,
              },
              isAuthenticated: true,
              isLoading: false,
              lastUpdated: Date.now(),
            });

            return true;
          } catch (e) {
            console.error("Signup error:", e);
            set({
              error: e instanceof Error ? e.message : "Signup failed",
              isLoading: false,
            });
            return false;
          }
        },

        refreshUser: async () => {
          set({ isLoading: true });

          // Check localStorage for user data
          const userJson = safeLocalStorage.getItem("auth-storage-user");
          if (userJson) {
            try {
              const authUser: AuthUser = JSON.parse(userJson);
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
            }
          }

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            lastUpdated: Date.now(),
          });
        },

        requestPasswordReset: async () => {
          set({
            error:
              "Authentication functionality has been removed. This is UI only.",
            isLoading: false,
          });
          return false;
        },

        resetPassword: async () => {
          set({
            error:
              "Authentication functionality has been removed. This is UI only.",
            isLoading: false,
          });
          return false;
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          lastUpdated: state.lastUpdated,
        }),
      }
    )
  )
);
