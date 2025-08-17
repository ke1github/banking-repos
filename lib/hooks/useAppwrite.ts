"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { Models } from "appwrite";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getUser: () => Promise<Models.User<Models.Preferences> | null>;
}

// Create context
export const AppwriteAuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  getUser: async () => null,
});

// Use the context
export const useAppwrite = () => useContext(AppwriteAuthContext);

// Provider hook that creates auth object and handles state
export function useProvideAppwrite() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check if user is authenticated on mount (client-side via Appwrite Web SDK)
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await appwriteAccount.get();
        setAuthState({ user, isLoading: false, isAuthenticated: true });
      } catch {
        // No session: remain unauthenticated without logging noisy errors
        setAuthState({ user: null, isLoading: false, isAuthenticated: false });
      }
    };

    void checkUser();
  }, []);

  // These methods mostly handle UI state; actual auth happens elsewhere
  // Sign in state sync (client already created session)
  const login = async (_email: string, _password: string): Promise<boolean> => {
    void _email;
    void _password;
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await appwriteAccount.get();
      setAuthState({ user, isLoading: false, isAuthenticated: true });

      return true;
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Create account state sync
  const register = async (
    _email: string,
    _password: string,
    _name: string
  ): Promise<boolean> => {
    void _email;
    void _password;
    void _name;
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const user = await appwriteAccount.get();
      setAuthState({ user, isLoading: false, isAuthenticated: true });

      return true;
    } catch {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  // Sign out (uses server action internally)
  const logout = async (): Promise<void> => {
    try {
      // The actual session deletion is now handled by the server action
      // This is just for updating the UI state
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Client logout state update error:", error);
    }
  };

  // Get current user
  const getUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    if (authState.user) return authState.user;

    try {
      const user = await appwriteAccount.get();
      setAuthState((prev) => ({ ...prev, user, isAuthenticated: true }));
      return user;
    } catch {
      return null;
    }
  };

  return {
    ...authState,
    login,
    register,
    logout,
    getUser,
  };
}
