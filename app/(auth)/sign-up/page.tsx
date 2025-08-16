"use client";

import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";

export default function SignUp() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSignUp = (data: SignUpFormValues | any) => {
    setIsLoading(true);
    console.log("Sign up data:", data);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/";
    }, 1500);
  };

  return (
    <AuthForm mode="signup" onSubmit={handleSignUp} isLoading={isLoading} />
  );
}
