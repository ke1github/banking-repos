"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { SignInFormValues } from "@/lib/validations";

export default function SignIn() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignIn = async (data: SignInFormValues) => {
    setIsLoading(true);
    console.log("Sign in data:", data);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <AuthForm mode="signin" onSubmit={handleSignIn} isLoading={isLoading} />
  );
}
