"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { SignInFormValues } from "@/lib/validations";
import { account as appwriteAccount } from "@/lib/appwrite/config";

export default function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSignIn = async (data: SignInFormValues) => {
    try {
      setIsLoading(true);
      setError("");

      // Create session in the browser so Appwrite sets auth cookie
      await appwriteAccount.createEmailPasswordSession(
        data.email,
        data.password
      );

      router.push("/");
    } catch (e) {
      console.error("Sign in error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : "Failed to sign in. Please check your credentials.";
      setError(msg);
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
