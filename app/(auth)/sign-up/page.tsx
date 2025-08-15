"use client";

import React, { useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth-context";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignUp = async (data: any) => {
    try {
      setIsLoading(true);
      console.log("Sign up with:", data);

      // Use the signup function from auth context
      await signup(data.name, data.email, data.password);

      // No need to redirect here as the auth context handles it
    } catch (error) {
      console.error("Sign up error:", error);
      // Here you could set an error state and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm mode="signup" onSubmit={handleSignUp} isLoading={isLoading} />
  );
};

export default SignUp;
