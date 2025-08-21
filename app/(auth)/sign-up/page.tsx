"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/forms/AuthForm";
import { ROUTES } from "@/constants/route";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { signup } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Fix for hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignUp = (data: Record<string, unknown>) => {
    if (isPending) return;

    setError("");

    startTransition(async () => {
      try {
        // Use our consolidated auth hook
        const result = await signup({
          email: data.email as string,
          password: data.password as string,
          firstName: data.firstName as string,
          lastName: data.lastName as string,
        });

        if (result.success) {
          // Navigate to the dashboard after successful signup
          router.push(ROUTES.HOME);
          toast.success("Account created successfully");
        } else {
          const errorMsg = result.error || "Failed to create account";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (e) {
        console.error("Sign up error:", e);
        const msg =
          e instanceof Error
            ? e.message
            : "Failed to sign up. Please try again.";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  // Show sign-up form with hydration fix
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-blue-200"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSignUp}
      isLoading={isPending}
      error={error}
    />
  );
}
