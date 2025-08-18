"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { ID } from "appwrite";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/route";

// Type definitions for form data
export interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  // Additional fields as needed
}

/**
 * Server action to handle user login
 */
export async function loginAction(formData: LoginFormData) {
  try {
    const account = getServerAccount();

    // Create email session (server-side)
    const session = await account.createSession(
      formData.email,
      formData.password
    );

    // Set auth cookie for middleware authentication
    const maxAge = formData.remember ? 30 * 24 * 60 * 60 : undefined; // 30 days if remember

    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth",
      value: "1",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
    });

    // Revalidate auth-dependent paths
    revalidatePath(ROUTES.HOME);

    return { success: true, sessionId: session.$id };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed",
    };
  }
}

/**
 * Server action to handle user registration
 */
export async function registerAction(formData: RegisterFormData) {
  try {
    const account = getServerAccount();

    // Create user
    const user = await account.create(
      ID.unique(),
      formData.email,
      formData.password,
      formData.name
    );

    // Create session automatically
    await account.createSession(formData.email, formData.password);

    // Set auth cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth",
      value: "1",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return { success: true, userId: user.$id };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

/**
 * Server action to handle user logout
 */
export async function logoutAction() {
  try {
    const account = getServerAccount();

    // Delete current session
    await account.deleteSession("current");

    // Clear auth cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth");

    // Revalidate auth-dependent paths
    revalidatePath(ROUTES.HOME);

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Logout failed",
    };
  }
}

/**
 * Sets the auth cookie (now only used server-side)
 * @deprecated Consider using loginAction or registerAction directly
 */
export async function setAuthCookie(persistent: boolean = false) {
  const maxAge = persistent ? 30 * 24 * 60 * 60 : undefined; // 30 days if persistent

  const cookieStore = await cookies();
  cookieStore.set({
    name: "auth",
    value: "1",
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
  });

  return { success: true };
}

/**
 * Checks if a user is currently authenticated on the server
 */
export async function checkAuthStatus() {
  try {
    const account = getServerAccount();
    const user = await account.get();
    return { isAuthenticated: true, user };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

/**
 * Protected route server action - redirects if not authenticated
 */
export async function requireAuth() {
  try {
    const account = getServerAccount();
    await account.get();
    // User is authenticated, continue
    return { isAuthenticated: true };
  } catch {
    // User is not authenticated, redirect to login
    redirect(ROUTES.SIGN_IN);
  }
}
