"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useTransition,
} from "react";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { Models } from "appwrite";
import { toast } from "sonner";

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
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
  isPending: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  getUser: async () => null,
});

// Use the context
export const useAppwrite = () => useContext(AppwriteAuthContext);

// Provider hook that creates auth object and handles state
export function useProvideAppwrite() {
  const [authState, setAuthState] = useState<Omit<AuthState, "isPending">>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const [isPending, startTransition] = useTransition();

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
  const login = async (email: string, password: string): Promise<boolean> => {
    if (isPending) return false;

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // These parameters are used in the server action, we just sync state here
          void password; // Silence linter about unused password parameter
          void email; // Silence linter

          const user = await appwriteAccount.get();
          setAuthState({ user, isLoading: false, isAuthenticated: true });
          toast.success("Successfully logged in");
          resolve(true);
        } catch (error) {
          console.error("Login error:", error);
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          toast.error("Failed to log in");
          resolve(false);
        }
      });
    });
  };

  // Create account state sync
  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    if (isPending) return false;

    setAuthState((prev) => ({ ...prev, isLoading: true }));

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // These parameters are used in the server action, we just sync state here
          void password; // Silence linter about unused password parameter
          void email; // Silence linter about unused email parameter
          void name; // Silence linter about unused name parameter

          const user = await appwriteAccount.get();
          setAuthState({ user, isLoading: false, isAuthenticated: true });
          toast.success("Account created successfully");
          resolve(true);
        } catch (error) {
          console.error("Registration error:", error);
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          toast.error("Failed to create account");
          resolve(false);
        }
      });
    });
  };

  // Sign out (uses server action internally)
  const logout = async (): Promise<void> => {
    if (isPending) return;

    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          // The actual session deletion is now handled by the server action
          // This is just for updating the UI state
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });

          // Remove auth cookie on client
          document.cookie =
            "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

          toast.info("Successfully logged out");
        } catch (error) {
          console.error("Client logout state update error:", error);
          toast.error("Error updating logout state");
        } finally {
          resolve();
        }
      });
    });
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
    isPending,
    login,
    register,
    logout,
    getUser,
  };
}
