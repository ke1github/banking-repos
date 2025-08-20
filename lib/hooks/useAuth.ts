"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { useAuthStore } from "@/lib/stores/auth-store";

// Define a unified user type
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  prefs?: Record<string, unknown>;
}

// Auth context type
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  error: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signup: (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; error?: string }>;
  updateUserData: () => Promise<boolean>;
  checkSession: () => Promise<boolean>;
}

// Create context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false, // Initialize as false to prevent loading state
  user: null,
  error: null,
  login: async () => ({ success: false, error: "Not implemented" }),
  logout: () => {},
  signup: async () => ({ success: false, error: "Not implemented" }),
  updateUserData: async () => false,
  checkSession: async () => false,
});

/**
 * Unified authentication hook that directly uses the auth store
 * to provide authentication functionality
 */
export function useProvideAuth(): AuthContextType {
  const router = useRouter();

  // Use the auth store for state
  const {
    user: storeUser,
    isLoading,
    error,
    isAuthenticated,
    login: storeLogin,
    logout: storeLogout,
    signup: storeSignup,
  } = useAuthStore();

  // Map store user to our AuthUser type
  const user = storeUser
    ? {
        id: storeUser.id,
        name: storeUser.name,
        email: storeUser.email,
        createdAt: new Date().toISOString(), // Store doesn't track this
        updatedAt: new Date().toISOString(), // Store doesn't track this
        emailVerified: false, // Store doesn't track this
      }
    : null;

  // Login function that wraps the store login
  const login = async (email: string, password: string) => {
    try {
      const success = await storeLogin(email, password);
      return { success };
    } catch (e) {
      console.error("Login error:", e);
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to login",
      };
    }
  };

  // Signup function that wraps the store signup
  const signup = async (data: {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
  }) => {
    try {
      const name =
        data.firstName && data.lastName
          ? `${data.firstName} ${data.lastName}`
          : data.email.split("@")[0];

      const success = await storeSignup(data.email, data.password, name);
      return { success };
    } catch (e) {
      console.error("Signup error:", e);
      return {
        success: false,
        error: e instanceof Error ? e.message : "Failed to sign up",
      };
    }
  };

  // Logout function that wraps the store logout
  const logout = () => {
    storeLogout()
      .then(() => {
        router.push(ROUTES.SIGN_IN);
      })
      .catch((e) => {
        console.error("Logout error:", e);
      });
  };

  // Update user data method (uses store)
  const updateUserData = async () => {
    try {
      // The store doesn't have this method specifically,
      // but we can use a pseudo-implementation
      await useAuthStore.getState().refreshUser();
      return true;
    } catch (e) {
      console.error("Update user data error:", e);
      return false;
    }
  };

  // Check session method (uses store)
  const checkSession = async () => {
    return isAuthenticated;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    signup,
    logout,
    updateUserData,
    checkSession,
  };
}

/**
 * Hook for using auth context
 */
export function useAuth() {
  return useContext(AuthContext);
}
