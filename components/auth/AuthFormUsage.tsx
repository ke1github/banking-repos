"use client";

import React, { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";

// Example usage in sign-in page
export const SignInPage = () => {
  // Using isLoading state for authentication process
  const [, setIsLoading] = useState(false);

  const handleSignIn = (data: SignInFormValues | SignUpFormValues) => {
    try {
      setIsLoading(true);
      console.log("Sign in with:", data);

      // Mock API call
      setTimeout(() => {
        // Handle authentication
        console.log("User authenticated successfully");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  };

  return <AuthForm mode="signin" onSubmit={handleSignIn} />;
};

// Example usage in sign-up page
export const SignUpPage = () => {
  // Using isLoading state for authentication process
  const [, setIsLoading] = useState(false);

  const handleSignUp = (data: SignInFormValues | SignUpFormValues) => {
    try {
      setIsLoading(true);
      console.log("Sign up with:", data);

      // Mock API call
      setTimeout(() => {
        // Handle account creation
        console.log("Account created successfully");
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Sign up error:", error);
      setIsLoading(false);
    }
  };

  return <AuthForm mode="signup" onSubmit={handleSignUp} />;
};
