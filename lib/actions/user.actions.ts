"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ID, Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  getAdminDatabases,
  getServerAccount,
  Permission,
  Role,
} from "@/lib/appwrite/server-config";

// Type definitions
export interface UserAccount {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Register a new user
 */
export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const middleName = (formData.get("middleName") as string) || undefined;

    if (!email || !password || !firstName || !lastName) {
      return { error: "Missing required fields" };
    }

    const fullName = middleName
      ? `${firstName} ${middleName} ${lastName}`
      : `${firstName} ${lastName}`;

    // Get server-side account instance
    const serverAccount = getServerAccount();

    // Create Appwrite account
    const newUser = await serverAccount.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    // Create user profile document in database
    const serverDatabases = getAdminDatabases();
    await serverDatabases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId: newUser.$id,
        firstName,
        lastName,
        middleName,
        email,
        // Satisfy required schema fields if present in collection
        dwollaCustomerUrl: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      [
        Permission.read(Role.user(newUser.$id)),
        Permission.update(Role.user(newUser.$id)),
        Permission.delete(Role.user(newUser.$id)),
      ]
    );

    // Revalidate paths that might show user info
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      userId: newUser.$id,
      name: newUser.name,
      email: newUser.email,
    };
  } catch (error) {
    console.error("Signup error:", error);
    // Detect Appwrite conflict (duplicate email/phone/id)
    if (error && typeof error === "object" && "code" in error) {
      const err = error as { code?: number; message?: string };
      if (err.code === 409) {
        return {
          error: "An account with this email already exists. Please sign in.",
          code: 409,
        } as const;
      }
    }
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to create account" };
  }
}

/**
 * Login a user
 */
export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Get server-side account instance
    const serverAccount = getServerAccount();

    // Create email session
    await serverAccount.createEmailPasswordSession(email, password);

    // Get current user
    const user = await serverAccount.get(); // Revalidate paths that might show user info
    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      userId: user.$id,
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to login" };
  }
}

/**
 * Logout a user
 */
export async function signOut() {
  // Best-effort: client deletes its own session; here we only clear our cookie
  try {
    try {
      const serverAccount = getServerAccount();
      await serverAccount.deleteSession("current");
    } catch {
      // Ignore server-side deletion failures (no session context on server)
    }

    // Clear our auth hint cookie so middleware treats user as logged out
    try {
      const cookieStore = await cookies();
      cookieStore.delete("auth");
    } catch {}

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    // Still return success to avoid trapping the user in a logged-in UI state
    return { success: true };
  }
}

/**
 * Set a lightweight auth cookie for middleware gating.
 * Call this right after client successfully creates an Appwrite session.
 */
export async function setAuthCookie(remember: boolean = true) {
  try {
    const cookieStore = await cookies();
    const options: Parameters<typeof cookieStore.set>[2] = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    };
    if (remember) {
      options.maxAge = 60 * 60 * 24 * 30; // 30 days
    }
    cookieStore.set("auth", "1", options);
    revalidatePath("/");
    return { success: true } as const;
  } catch (error) {
    console.error("setAuthCookie error:", error);
    return { success: false } as const;
  }
}

/**
 * Clear the auth cookie.
 */
export async function clearAuthCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth");
    revalidatePath("/");
    return { success: true } as const;
  } catch (error) {
    console.error("clearAuthCookie error:", error);
    return { success: false } as const;
  }
}

/**
 * Mark the user as authenticated after OAuth by setting the auth cookie.
 */
export async function markOAuthAuthenticated(remember: boolean = true) {
  return setAuthCookie(remember);
}

/**
 * Get current user (server-side)
 */
export async function getCurrentUser() {
  try {
    // Try to get the current user
    try {
      // Get server-side account instance
      const serverAccount = getServerAccount();

      const user = await serverAccount.get();

      // If we have a user, get their profile from database
      const serverDbService = getAdminDatabases();
      const profiles = await serverDbService.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        [Query.equal("userId", user.$id)]
      );

      if (profiles.documents.length === 0) {
        return {
          user: {
            id: user.$id,
            name: user.name,
            email: user.email,
            firstName: user.name.split(" ")[0],
            lastName: user.name.split(" ").slice(-1)[0],
          },
        };
      }

      const profile = profiles.documents[0];

      return {
        user: {
          id: user.$id,
          name: user.name,
          email: user.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          middleName: profile.middleName,
        },
      };
    } catch {
      // If the above fails, we're not authenticated
      return { user: null };
    }
  } catch (error) {
    console.error("Get current user error:", error);
    return { user: null, error: "Failed to get user" };
  }
}
