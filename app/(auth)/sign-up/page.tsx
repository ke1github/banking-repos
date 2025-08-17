"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";
import { signUp } from "@/lib/actions/user.actions";

export default function SignUp() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleSignUp = async (data: SignUpFormValues) => {
    try {
      setIsLoading(true);
      setError("");

      // Create form data for server action
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);

      if (data.middleName) {
        formData.append("middleName", data.middleName);
      }

      // Call server action
      const result = await signUp(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        router.push("/");
      }
    } catch (e) {
      console.error("Sign up error:", e);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={(data) => {
        void handleSignUp(data as SignUpFormValues);
      }}
      isLoading={isLoading}
      error={error}
    />
  );
}
