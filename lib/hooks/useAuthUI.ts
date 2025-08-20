"use client";

import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";
import { loginAction, registerAction } from "@/lib/actions/auth.actions";
import { useState, useTransition } from "react";
import { account as appwriteAccount } from "@/lib/appwrite/config";

/**
 * Centralized hook for auth UI operations that handles state, API calls, and feedback
 */
export function useAuthUI() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { login: syncLogin, register: syncRegister } = useAppwrite();

  /**
   * Handle sign-in form submission with consistent error handling and UI feedback
   */
  const handleSignIn = async (data: SignInFormValues) => {
    if (isPending) return;
    setError("");

    startTransition(async () => {
      try {
        // Check if already logged in with a different account
        try {
          const existing = await appwriteAccount.get();
          if (existing && existing.email !== data.email) {
            await appwriteAccount.deleteSession("current");
          } else if (existing && existing.email === data.email) {
            // Already logged in with the same email
            await syncLogin(data.email, data.password);
            setSuccess(true);
            toast.success("Already signed in");
            setTimeout(() => router.push(ROUTES.HOME), 1000);
            return;
          }
        } catch {
          // Continue with login if there was an error checking existing account
          console.debug("Not currently logged in, continuing with login");
        }

        // Use server action to create session
        const result = await loginAction({
          email: data.email,
          password: data.password,
          remember: data.remember,
        });

        if (!result.success) {
          // Provide specific error messages
          if (result.error?.includes("Invalid email or password")) {
            setError(
              "Invalid email or password. Please check your credentials."
            );
          } else if (
            result.error?.includes("account_needs_repair") ||
            result.error?.includes("userId")
          ) {
            setError(
              "There was an issue with your account. Please try signing up again or contact support."
            );
          } else {
            setError(result.error || "Authentication failed");
          }
          return;
        }

        // Update auth context (without duplicate toast notification)
        await syncLogin(data.email, data.password);

        // Store remember preference
        try {
          localStorage.setItem("remember", String(Boolean(data.remember)));
          sessionStorage.setItem("session-started", "1");
        } catch (e) {
          console.error("Error setting storage:", e);
        }

        // Set client cookie for immediate middleware recognition
        try {
          if (data.remember) {
            document.cookie = `auth=1; Path=/; SameSite=Lax; Max-Age=${
              60 * 60 * 24 * 30
            }`;
          } else {
            document.cookie = `auth=1; Path=/; SameSite=Lax`;
          }
        } catch (e) {
          console.error("Error setting document cookie:", e);
        }

        setSuccess(true);
        toast.success("Login successful");
        setTimeout(() => router.push(ROUTES.HOME), 1000);
      } catch (e) {
        console.error("Sign in error:", e);
        const msg =
          e instanceof Error
            ? e.message
            : "Failed to sign in. Please check your credentials.";
        setError(msg);
      }
    });
  };

  /**
   * Handle sign-up form submission with consistent error handling and UI feedback
   */
  const handleSignUp = async (data: SignUpFormValues) => {
    if (isPending) return;
    setError("");

    startTransition(async () => {
      try {
        // Check if already signed in
        try {
          const existing = await appwriteAccount.get();
          if (existing) {
            if (existing.email === data.email) {
              toast.info("You're already signed up with this email");
              setTimeout(() => router.push(ROUTES.HOME), 1000);
              return;
            }
            // If logged in as a different user, log out first
            await appwriteAccount.deleteSession("current");
          }
        } catch {
          // Not logged in, which is the expected case for sign-up
          console.debug("Not currently logged in, continuing with signup");
        }

        // Prepare the name for registration
        const displayName =
          data.name ||
          `${data.firstName} ${data.middleName ? data.middleName + " " : ""}${
            data.lastName
          }`;

        // Call the server action to register
        const result = await registerAction({
          ...data,
          name: displayName,
        });

        if (!result.success) {
          // Check for user already exists error
          if (result.error?.includes("exists")) {
            try {
              // Try to log in instead
              await appwriteAccount.createSession(data.email, data.password);
              await syncRegister(data.email, data.password, "");

              toast.success("Logged in with existing account");
              setTimeout(() => router.push(ROUTES.HOME), 1000);
              return;
            } catch {
              setError(
                "An account with this email already exists. Please sign in."
              );
              return;
            }
          }

          setError(result.error || "Registration failed");
          return;
        }

        // Sync client-side state (without duplicate toast notification)
        await syncRegister(data.email, data.password, displayName);

        setSuccess(true);
        toast.success("Account created successfully!");
        setTimeout(() => router.push(ROUTES.HOME), 1000);
      } catch (e) {
        console.error("Sign up error:", e);
        const msg =
          e instanceof Error
            ? e.message
            : "An unexpected error occurred. Please try again.";
        setError(msg);
      }
    });
  };

  return {
    handleSignIn,
    handleSignUp,
    isPending,
    error,
    success,
    setError,
    setSuccess,
  };
}
