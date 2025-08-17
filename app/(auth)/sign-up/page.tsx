"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";
import { signUp } from "@/lib/actions/user.actions";
import { account as appwriteAccount } from "@/lib/appwrite/config";

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
        // Create a session in the browser so subsequent client checks pass
        try {
          await appwriteAccount.createEmailPasswordSession(
            data.email,
            data.password
          );
        } catch {
          // Best-effort; if session fails here we still navigate and the
          // client hook will keep the user unauthenticated
        }
        router.push("/");
      }
    } catch (e) {
      console.error("Sign up error:", e);
      const msg =
        e instanceof Error
          ? e.message
          : "An unexpected error occurred. Please try again.";
      setError(msg);
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
