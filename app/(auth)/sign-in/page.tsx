"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { loginAction } from "@/lib/actions/auth.actions";
import { ROUTES } from "@/constants/route";
import AuthForm from "@/components/foms/AuthForm";
import { SignInFormValues } from "@/lib/validations";
import { toast } from "sonner";

export default function SignIn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useAppwrite();

  // Handle sign-in form submission
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
            await login(data.email, data.password);
            setSuccess(true);
            toast.success("Already signed in");
            setTimeout(() => router.push(ROUTES.HOME), 1000);
            return;
          }
        } catch (e) {
          console.error("Error checking existing account:", e);
          // Continue with login if there was an error checking existing account
        }

        // Use server action to create session
        const result = await loginAction({
          email: data.email,
          password: data.password,
          remember: data.remember,
        });

        if (!result.success) {
          setError(result.error || "Authentication failed");
          toast.error("Login failed");
          return;
        }

        // Update auth context
        await login(data.email, data.password);

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
        toast.error(msg);
      }
    });
  };

  // Show success message
  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center">
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium">Login successful!</h3>
            <p>You are being redirected to the dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show already authenticated message
  if (!authLoading && isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div className="text-center">
          <div className="bg-blue-50 text-blue-700 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium">Already signed in</h3>
            <p>Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show sign-in form
  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSignIn}
      isLoading={isPending}
      error={error}
    />
  );
}
