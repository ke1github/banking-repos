"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";
import AuthForm from "@/components/forms/AuthForm";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SignIn() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Fix for hydration issues
  useEffect(() => {
    // Component is mounted, no additional state needed
  }, []);

  // Handle sign-in form submission
  const handleSignIn = async (data: { email: string; password: string }) => {
    if (isPending) return;

    setError("");

    startTransition(async () => {
      try {
        // Use our consolidated auth hook
        const result = await login(data.email, data.password);

        if (result.success) {
          // Navigate to the dashboard after successful login
          router.push(ROUTES.HOME);
          toast.success("Signed in successfully");
        } else {
          const errorMsg = result.error || "Failed to sign in";
          setError(errorMsg);
          toast.error(errorMsg);
        }
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

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSignIn}
      isLoading={isPending}
      error={error}
    />
  );
}
