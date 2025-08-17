"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { SignInFormValues } from "@/lib/validations";
import { signIn } from "@/lib/actions/user.actions";

export default function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSignIn = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError("");

      // Create form data for server action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      // Call server action
      const result = await signIn(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        router.push("/");
      }
    } catch (e) {
      console.error("Sign in error:", e);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSignIn}
      isLoading={isLoading}
      error={error}
    />
  );
}
