"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  useTransition,
  useCallback,
} from "react";
import { safeAccount } from "@/lib/appwrite/config";
import { Models } from "appwrite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { isSessionExpiredError } from "@/lib/utils/appwrite-errors";
import { logAuthError } from "@/lib/utils/logger";

// Session check interval (5 minutes)
const SESSION_CHECK_INTERVAL = 5 * 60 * 1000;

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPending: boolean;
  lastChecked?: number; // Timestamp when session was last verified
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  getUser: () => Promise<Models.User<Models.Preferences> | null>;
  checkSession: () => Promise<boolean>; // New function to manually check session
}

// Create context
export const AppwriteAuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isPending: false,
  lastChecked: undefined,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  getUser: async () => null,
  checkSession: async () => false,
});

// Use the context
export const useAppwrite = () => useContext(AppwriteAuthContext);

// Provider hook that creates auth object and handles state
export function useProvideAppwrite() {
  const router = useRouter();
  const [authState, setAuthState] = useState<Omit<AuthState, "isPending">>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    lastChecked: undefined,
  });

  const [isPending, startTransition] = useTransition();

  // Function to check session status and handle expired sessions
  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const user = await safeAccount.get();

      // If no user, handle as not authenticated
      if (!user) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          lastChecked: Date.now(),
        });
        return false;
      }

      const now = Date.now();

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        lastChecked: now,
      });

      return true;
    } catch (error) {
      // Check if this is a session expiry error
      if (isSessionExpiredError(error)) {
        // If previously authenticated, show session expired message
        if (authState.isAuthenticated) {
          toast.error("Your session has expired. Please log in again.");

          // Clear client-side state
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            lastChecked: Date.now(),
          });

          // Remove client-side cookie
          document.cookie =
            "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

          // Log the error with context
          logAuthError(error, "session_check", {
            wasAuthenticated: true,
            redirecting: true,
          });

          // Redirect to login
          router.push(ROUTES.SIGN_IN);
        } else {
          // Just update state if we weren't authenticated anyway
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            lastChecked: Date.now(),
          });
        }
      } else {
        // For other errors, just update the state
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          isAuthenticated: false,
          lastChecked: Date.now(),
        }));

        // Log non-expiry errors
        logAuthError(error, "session_check", { unexpected: true });
      }

      return false;
    }
  }, [authState.isAuthenticated, router]);

  // Initial auth check on mount
  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  // Periodic session validation
  useEffect(() => {
    // Only set up periodic checks if authenticated
    if (!authState.isAuthenticated) return;

    const intervalId = setInterval(() => {
      void checkSession();
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(intervalId);
  }, [authState.isAuthenticated, checkSession]);

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

          const user = await safeAccount.get();

          // Handle case where user might be null
          if (!user) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              lastChecked: Date.now(),
            });

            toast.error("Authentication required. Please log in.");
            resolve(false);
            return;
          }

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            lastChecked: Date.now(),
          });

          toast.success("Successfully logged in");
          resolve(true);
        } catch (error) {
          logAuthError(error, "login_sync", { email });

          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            lastChecked: Date.now(),
          }));

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

          const user = await safeAccount.get();

          // Handle case where user might be null
          if (!user) {
            setAuthState({
              user: null,
              isLoading: false,
              isAuthenticated: false,
              lastChecked: Date.now(),
            });

            toast.error("Authentication required. Please log in.");
            resolve(false);
            return;
          }

          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            lastChecked: Date.now(),
          });

          toast.success("Account created successfully");
          resolve(true);
        } catch (error) {
          logAuthError(error, "register_sync", { email });

          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            lastChecked: Date.now(),
          }));

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
            lastChecked: Date.now(),
          });

          // Remove auth cookie on client
          document.cookie =
            "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

          toast.info("Successfully logged out");
        } catch (error) {
          logAuthError(error, "logout_client", {});
          toast.error("Error updating logout state");
        } finally {
          resolve();
        }
      });
    });
  };

  // Get current user
  const getUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    // If we have a user and the session was checked recently (within 1 minute)
    // return the cached user to avoid unnecessary API calls
    const now = Date.now();
    const recentCheck =
      authState.lastChecked && now - authState.lastChecked < 60000;

    if (authState.user && recentCheck) {
      return authState.user;
    }

    // Otherwise, verify the session is still valid
    try {
      const user = await safeAccount.get();

      // Handle case where user might be null
      if (!user) {
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          lastChecked: now,
        });
        return null;
      }

      setAuthState((prev) => ({
        ...prev,
        user,
        isAuthenticated: true,
        lastChecked: now,
      }));
      return user;
    } catch (error) {
      // Handle session expiry
      if (isSessionExpiredError(error) && authState.isAuthenticated) {
        // Update state and notify user
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          lastChecked: now,
        });

        // Only show toast if we were previously authenticated
        toast.error("Your session has expired. Please log in again.");

        // Log for analytics
        logAuthError(error, "get_user", {
          wasAuthenticated: authState.isAuthenticated,
        });

        // Redirect to login
        router.push(ROUTES.SIGN_IN);
      }
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
    checkSession,
  };
}
