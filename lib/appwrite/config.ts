import {
  Client,
  Account,
  Databases,
  ID,
  Query,
  AppwriteException,
  Models,
} from "appwrite";
import { logAuthError } from "@/lib/utils/logger";
import { isSessionExpiredError } from "@/lib/handlers/appwrite-errors";

export const appwriteConfig = {
  endpoint:
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "",
  userCollectionId: process.env.APPWRITE_USER_COLLECTION_ID || "",
  bankCollectionId: process.env.APPWRITE_BANK_COLLECTION_ID || "",
  transactionCollectionId: process.env.APPWRITE_TRANSACTION_COLLECTION_ID || "",
};

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// Initialize Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);

// Utility function to check if running on server side
export const isServer = () => typeof window === "undefined";

// Auth state caching to reduce API calls
let isAuthenticatedCache = false;
let lastAuthCheck = 0;
let userCache: Models.User<Models.Preferences> | null = null;
const AUTH_CHECK_THROTTLE = 5000; // 5 seconds

/**
 * Safe wrapper for Appwrite account methods to handle guest scope errors
 * This prevents the common "User (role: guests) missing scope (account)" error
 * by providing better error handling and fallbacks
 */
export const safeAccount = {
  /**
   * Get the current user account information
   * Returns null instead of throwing if user is not authenticated
   * Uses caching to reduce API calls and avoid guest scope errors
   */
  async get(): Promise<Models.User<Models.Preferences> | null> {
    const now = Date.now();

    // Return cached user data if fresh enough
    if (userCache && now - lastAuthCheck < AUTH_CHECK_THROTTLE) {
      return userCache;
    }

    try {
      const user = await account.get();
      // Update cache
      userCache = user;
      isAuthenticatedCache = true;
      lastAuthCheck = now;
      return user;
    } catch (error) {
      // If it's a session error or guest scope error, return null without excessive logging
      if (
        isSessionExpiredError(error) ||
        (error instanceof Error && error.message.includes("missing scope"))
      ) {
        // Update cache
        userCache = null;
        isAuthenticatedCache = false;
        lastAuthCheck = now;
        return null;
      }

      // Log unexpected errors
      logAuthError(error, "safe_account_get");

      // Update cache for failed auth
      userCache = null;
      isAuthenticatedCache = false;
      lastAuthCheck = now;

      return null;
    }
  },

  /**
   * Fast check if user is authenticated (uses cache when possible)
   */
  async isAuthenticated(): Promise<boolean> {
    const now = Date.now();

    // Use cached auth state if recent
    if (now - lastAuthCheck < AUTH_CHECK_THROTTLE) {
      return isAuthenticatedCache;
    }

    // Otherwise check with API
    try {
      const user = await this.get();
      return !!user;
    } catch {
      return false;
    }
  },

  /**
   * Create a new session safely
   */
  async createSession(email: string, password: string) {
    try {
      const session = await account.createSession(email, password);

      // Reset cache to force a fresh check on next get() call
      lastAuthCheck = 0;

      return session;
    } catch (error) {
      // Always log auth failures with limited info
      logAuthError(error, "safe_account_create_session", {
        email: email.substring(0, 3) + "...", // Only log partial email for privacy
      });
      throw error; // Re-throw for the calling code to handle
    }
  },

  /**
   * Delete a session safely
   */
  async deleteSession(sessionId: string) {
    try {
      const result = await account.deleteSession(sessionId);

      // Clear cache immediately on logout
      userCache = null;
      isAuthenticatedCache = false;
      lastAuthCheck = Date.now();

      return result;
    } catch (error) {
      // If it's a scope error, the session is already gone or invalid
      if (
        error instanceof AppwriteException &&
        (error.type === "user_missing_scope" ||
          error.message.includes("missing scope") ||
          error.code === 401)
      ) {
        // Clear cache
        userCache = null;
        isAuthenticatedCache = false;
        lastAuthCheck = Date.now();

        return null; // Return silently as the session is already effectively gone
      }

      // Log other errors
      logAuthError(error, "safe_account_delete_session");

      // Clear cache anyway on error
      userCache = null;
      isAuthenticatedCache = false;
      lastAuthCheck = Date.now();

      // No need to rethrow most errors when deleting a session
      // as the end goal (session gone) is already achieved
      return null;
    }
  },

  /**
   * Create a new user account safely
   */
  async create(userId: string, email: string, password: string, name: string) {
    try {
      const user = await account.create(userId, email, password, name);

      // Reset cache to force a fresh check on next get() call
      lastAuthCheck = 0;

      return user;
    } catch (error) {
      // Log the error with context
      logAuthError(error, "safe_account_create", {
        email: email.substring(0, 3) + "...", // Only log partial email for privacy
      });
      throw error; // Re-throw for the calling code to handle
    }
  },

  /**
   * Pass-through to the underlying Appwrite account object
   * for other methods not specifically wrapped
   */
  get appwrite() {
    return account;
  },
};

export { ID, Query };
