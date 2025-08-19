"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AppwriteException } from "appwrite";
import { safeAccount } from "@/lib/appwrite/config";

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

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        login: async (email: string, password: string) => {
          try {
            set({ isLoading: true, error: null });

            // Create session
            await safeAccount.createSession(email, password);

            // Get user data
            const userData = await safeAccount.get();

            if (!userData) {
              throw new Error("Failed to retrieve user data after login");
            }

            // Extract user information
            const user: User = {
              id: userData.$id,
              email: userData.email,
              name: userData.name,
              firstName: userData.name.split(" ")[0],
              lastName: userData.name.split(" ").slice(1).join(" "),
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch (error) {
            const message =
              error instanceof AppwriteException
                ? error.message
                : "Failed to login";

            set({
              error: message,
              isLoading: false,
              isAuthenticated: false,
            });

            throw error;
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true });

            // Delete current session
            await safeAccount.deleteSession("current");

            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          } catch {
            // Even if there's an error, we still want to clear the local state
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: "Failed to logout properly",
            });
          }
        },

        signup: async (email: string, password: string, name: string) => {
          try {
            set({ isLoading: true, error: null });

            // Create user account
            await safeAccount.create(
              crypto.randomUUID(), // Generate a unique ID
              email,
              password,
              name
            );

            // Automatically log in the user
            await get().login(email, password);
          } catch (error) {
            const message =
              error instanceof AppwriteException
                ? error.message
                : "Failed to create account";

            set({
              error: message,
              isLoading: false,
            });

            throw error;
          }
        },

        refreshUser: async () => {
          try {
            set({ isLoading: true });

            const userData = await safeAccount.get();

            if (!userData) {
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              return;
            }

            // Extract user information
            const user: User = {
              id: userData.$id,
              email: userData.email,
              name: userData.name,
              firstName: userData.name.split(" ")[0],
              lastName: userData.name.split(" ").slice(1).join(" "),
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } catch {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "auth-storage",
        // Only persist non-sensitive data
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
        }),
      }
    )
  )
);
