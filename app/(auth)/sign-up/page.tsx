"use client";

import React from "react";

import AuthForm from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";
import { signUp } from "@/lib/actions/user.actions";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { ROUTES } from "@/constants/route";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { setAuthCookie } from "@/lib/actions/user.actions";
import router from "next/router";

export default function SignUp() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { register: syncRegister } = useAppwrite();

  // Ensure we only have one active session; if a different user is logged in,
  // delete that session before creating a new one. If same user, skip creating.
  const ensureFreshSession = async (email: string, password: string) => {
    try {
      const existing = await appwriteAccount.get();
      if (existing) {
        if (existing.email === email) return; // already logged in as same user
        try {
          await appwriteAccount.deleteSession("current");
        } catch {
          // ignore if unable to delete
        }
      }
    } catch {
      // no active session
    }
    await appwriteAccount.createEmailPasswordSession(email, password);
    // Also sync the auth context so root layout sees the user
    try {
      await syncRegister(email, password, "");
    } catch {}
    try {
      await setAuthCookie();
    } catch {}
    // Client fallback cookie for immediate middleware recognition
    try {
      document.cookie = `auth=1; Path=/; SameSite=Lax; Max-Age=${
        60 * 60 * 24 * 30
      }`;
    } catch {}
  };

  const handleSignUp = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      setError("");

      // Create form data for server action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);

      if (data.middleName) {
        formData.append("middleName", data.middleName);
      }

      // Call server action
      const result = await signUp(formData);

      if (result.error) {
        // If user already exists, try logging them in with provided credentials
        // If that works, proceed to app; otherwise show a friendly message
        const isConflict = (result as { code?: number }).code === 409;
        if (isConflict) {
          try {
            await ensureFreshSession(data.email, data.password);
            try {
              await new Promise((r) => setTimeout(r, 50));
            } catch {}
            router.replace(ROUTES.HOME);
            return;
          } catch {
            setError(
              "An account with this email already exists. Please sign in."
            );
            // Optionally, navigate to sign-in after a short delay
            // setTimeout(() => router.push(ROUTES.SIGN_IN), 1200);
            return;
          }
        }

        setError(result.error);
        return;
      }

      if (result.success) {
        // Create a session in the browser so subsequent client checks pass
        try {
          await ensureFreshSession(data.email, data.password);
        } catch {
          // Best-effort; if session fails here we still navigate and the
          // client hook will keep the user unauthenticated
        }
        try {
          await new Promise((r) => setTimeout(r, 50));
        } catch {}
        router.replace(ROUTES.HOME);
      }
    } catch (e) {
      console.error("Sign up error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : "An unexpected error occurred. Please try again.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={(data) => {
        void handleSignUp(data as SignUpFormValues);
      }}
      isLoading={isLoading}
      error={error}
    />
  );
}
