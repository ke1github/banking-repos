"use client";

import React, { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth-context";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async (data: SignInFormValues | SignUpFormValues) => {
    try {
      setIsLoading(true);
      console.log("Sign in with:", data);

      // Use the login function from auth context
      await login(data.email, data.password);

      // No need to redirect here as the auth context handles it
    } catch (error) {
      console.error("Sign in error:", error);
      // Here you could set an error state and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm mode="signin" onSubmit={handleSignIn} isLoading={isLoading} />
  );
};

export default SignIn;
