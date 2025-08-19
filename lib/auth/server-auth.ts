import "server-only";

import { translateAppwriteError } from "@/lib/utils/appwrite-errors";
import { logServerAuthError } from "@/lib/utils/server-logger";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { ID } from "appwrite";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ROUTES } from "@/constants/route";

/**
 * Helper to set the auth cookie with consistent options
 */
async function setAuthCookieHelper(
  value: string = "1",
  options: {
    maxAge?: number;
    expires?: Date;
  } = {}
) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth",
    value,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    ...options,
  });
}

/**
 * Server-side wrapper for Appwrite authentication operations
 * Provides consistent error handling and logging
 */
export const serverAuth = {
  /**
   * Get the current user (with error handling)
   */
  async getUser() {
    try {
      const account = getServerAccount();
      return await account.get();
    } catch (error) {
      if (error instanceof Error && error.message?.includes("missing scope")) {
        // Guest scope error - this is expected for non-authenticated users
        return null;
      }

      // Log other errors
      logServerAuthError(error, "server_get_user");
      return null;
    }
  },

  /**
   * Check if the current user is logged in
   */
  async isLoggedIn() {
    try {
      const account = getServerAccount();
      const user = await account.get();
      return Boolean(user?.$id);
    } catch {
      return false;
    }
  },

  /**
   * Server action for user login
   */
  async login(email: string, password: string, remember = false) {
    try {
      // Input validation before even calling Appwrite
      if (!email || !email.includes("@")) {
        return {
          success: false,
          error: "Please enter a valid email address",
        };
      }

      if (!password || password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters long",
        };
      }

      const account = getServerAccount();

      // Create session with email and password
      // Need to use the correct signature for createSession
      const session = await account.createSession(email, password);

      // Set cookie for server authentication
      const maxAge = remember ? 30 * 24 * 60 * 60 : undefined; // 30 days if remember

      await setAuthCookieHelper("1", { maxAge });

      // Revalidate paths that depend on authentication
      revalidatePath(ROUTES.HOME);
      return { success: true, sessionId: session.$id };
    } catch (error) {
      // Translate error to a consistent format
      const translatedError = translateAppwriteError(
        error,
        "server_login",
        "Authentication failed"
      );

      // Log the error
      logServerAuthError(error, "server_login", {
        email,
        errorCode: translatedError.code,
      });

      return {
        success: false,
        error: translatedError.userMessage,
        code: translatedError.code,
      };
    }
  },

  /**
   * Server action for user registration
   */
  async register(email: string, password: string, name: string) {
    try {
      const account = getServerAccount();

      // Create user
      const user = await account.create(ID.unique(), email, password, name);

      // Create session automatically
      await account.createSession(email, password);

      // Set auth cookie
      await setAuthCookieHelper();

      // Revalidate auth-dependent paths
      revalidatePath(ROUTES.HOME);
      return { success: true, userId: user.$id };
    } catch (error) {
      // Translate error to a consistent format
      const translatedError = translateAppwriteError(
        error,
        "server_register",
        "Registration failed"
      );

      // Log the error
      logServerAuthError(error, "server_register", {
        email,
        errorCode: translatedError.code,
      });

      return {
        success: false,
        error: translatedError.userMessage,
        code: translatedError.code,
      };
    }
  },

  /**
   * Server action for user logout
   */
  async logout() {
    try {
      const account = getServerAccount();

      // Delete the current session
      await account.deleteSession("current");

      // Clear auth cookie
      await setAuthCookieHelper("", { expires: new Date(0) });

      // Revalidate auth-dependent paths
      revalidatePath(ROUTES.HOME);
      return { success: true };
    } catch (error) {
      // Translate error to a consistent format
      const translatedError = translateAppwriteError(
        error,
        "server_logout",
        "Logout failed"
      );

      // Log the error
      logServerAuthError(error, "server_logout", {
        errorCode: translatedError.code,
      });

      // Even if the Appwrite logout fails, clear the cookie
      try {
        await setAuthCookieHelper("", { expires: new Date(0) });
      } catch (cookieError) {
        logServerAuthError(cookieError, "logout_cookie_delete");
      }

      return {
        success: false,
        error: translatedError.userMessage,
      };
    }
  },
};
