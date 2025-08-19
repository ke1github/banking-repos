"use server";

import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { serverAuth } from "@/lib/auth/server-auth";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";

/**
 * Server action to handle user login
 */
export async function loginAction(formData: SignInFormValues) {
  const result = await serverAuth.login(
    formData.email,
    formData.password,
    Boolean(formData.remember)
  );
  return result;
}

/**
 * Server action to handle user registration
 */
export async function registerAction(formData: SignUpFormValues) {
  // Use the name property if provided, otherwise construct from firstName and lastName
  const displayName =
    formData.name ||
    `${formData.firstName} ${
      formData.middleName ? formData.middleName + " " : ""
    }${formData.lastName}`;

  const result = await serverAuth.register(
    formData.email,
    formData.password,
    displayName
  );
  return result;
}

/**
 * Server action to handle user logout
 */
export async function logoutAction() {
  return await serverAuth.logout();
}

/**
 * Sets the auth cookie (now only used server-side)
 * @deprecated Consider using loginAction or registerAction directly
 */
export async function setAuthCookie(persistent: boolean = false) {
  // Just use the login method without actually logging in
  // This way we get consistent cookie management

  // Delegate to the helper for consistency
  await serverAuth
    .login("noop@example.com", "noop", Boolean(persistent))
    .catch(() => {
      /* ignore error - we just want the cookie effect */
    });

  return { success: true };
}

/**
 * Checks if a user is currently authenticated on the server
 */
export async function checkAuthStatus() {
  const user = await serverAuth.getUser();
  return { isAuthenticated: Boolean(user), user };
}

/**
 * Protected route server action - redirects if not authenticated
 */
export async function requireAuth() {
  const isLoggedIn = await serverAuth.isLoggedIn();

  if (!isLoggedIn) {
    // User is not authenticated, redirect to login
    redirect(ROUTES.SIGN_IN);
  }

  // User is authenticated, continue
  return { isAuthenticated: true };
}
