"use client";

import React from "react";

import AuthForm from "@/components/auth/AuthForm";
import { SignInFormValues } from "@/lib/validations";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { setAuthCookie } from "@/lib/actions/user.actions";
import { ROUTES } from "@/constants/route";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const { login, isAuthenticated, isLoading: authLoading } = useAppwrite();

  // Post-login guard: if a session is already active, send user Home
  React.useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(ROUTES.HOME);
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSignIn = async (data: SignInFormValues) => {
    try {
      setSubmitLoading(true);
      setError("");

      // Avoid duplicate session creation when already logged in
      try {
        const existing = await appwriteAccount.get();
        if (existing && existing.email !== data.email) {
          try {
            await appwriteAccount.deleteSession("current");
          } catch {}
        } else if (existing && existing.email === data.email) {
          // Sync auth context then navigate
          try {
            await login(data.email, data.password);
          } catch {}
          // No server cookie change here; already signed in previously
          try {
            await new Promise((r) => setTimeout(r, 50));
          } catch {}
          router.replace(ROUTES.HOME);
          return;
        }
      } catch {}

      await appwriteAccount.createEmailPasswordSession(
        data.email,
        data.password
      );
      // Update auth context so root layout doesn't redirect back
      try {
        await login(data.email, data.password);
      } catch {}
      // Persist remember preference for cross-session handling
      try {
        localStorage.setItem("remember", String(Boolean(data.remember)));
        sessionStorage.setItem("session-started", "1");
      } catch {}
      // Set server cookie for middleware gating; persistent only if remember
      try {
        await setAuthCookie(Boolean(data.remember));
      } catch {}
      // Client fallback cookie for immediate middleware recognition (session cookie if not remember)
      try {
        if (data.remember) {
          document.cookie = `auth=1; Path=/; SameSite=Lax; Max-Age=${
            60 * 60 * 24 * 30
          }`;
        } else {
          document.cookie = `auth=1; Path=/; SameSite=Lax`;
        }
      } catch {}
      try {
        await new Promise((r) => setTimeout(r, 50));
      } catch {}
      router.replace(ROUTES.HOME);
    } catch (e) {
      console.error("Sign in error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to sign in. Please check your credentials.";
      setError(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSignIn}
      isLoading={submitLoading}
      error={error}
    />
  );
}
