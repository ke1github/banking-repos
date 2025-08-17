"use server";

import { revalidatePath } from "next/cache";
import { ID, Query } from "appwrite";
import { account, appwriteConfig } from "@/lib/appwrite/config";
import { getServerDatabases } from "@/lib/appwrite/server-config";

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

    // Create Appwrite account
    const newUser = await account.create(
      ID.unique(),
      email,
      password,
      fullName
    );

    // Create email session
    await account.createEmailPasswordSession(email, password);

    // Create user profile document in database
    const serverDatabases = getServerDatabases();
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
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

    // Create email session
    await account.createEmailPasswordSession(email, password);

    // Get current user
    const user = await account.get();

    // Revalidate paths that might show user info
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
  try {
    // Delete current session
    await account.deleteSession("current");

    revalidatePath("/");

    // Redirect to sign-in page
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to logout" };
  }
}

/**
 * Get current user (server-side)
 */
export async function getCurrentUser() {
  try {
    // Try to get the current user
    try {
      const user = await account.get();

      // If we have a user, get their profile from database
      const serverDbService = getServerDatabases();
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
