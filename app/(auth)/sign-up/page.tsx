"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { SignUpFormValues } from "@/lib/validations";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { ROUTES } from "@/constants/route";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { registerAction } from "@/lib/actions/auth.actions";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { register: syncRegister } = useAppwrite();

  const handleSignUp = (data: SignUpFormValues) => {
    if (isPending) return;

    setError("");

    startTransition(async () => {
      try {
        // Check if already signed in
        try {
          const existing = await appwriteAccount.get();
          if (existing) {
            if (existing.email === data.email) {
              toast.info("You're already signed up with this email");
              setTimeout(() => router.push(ROUTES.HOME), 1000);
              return;
            }

            // If logged in as a different user, log out first
            await appwriteAccount.deleteSession("current");
          }
        } catch (e) {
          // Not logged in, which is the expected case for sign-up
          console.error("Error checking existing account:", e);
        }

        // Call the server action to register
        // Add the name property for backward compatibility
        const result = await registerAction({
          email: data.email,
          password: data.password,
          name: `${data.firstName} ${
            data.middleName ? data.middleName + " " : ""
          }${data.lastName}`, // Add name for registerAction
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          mobile: data.mobile,
          dateOfBirth: data.dateOfBirth,
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          pan: data.pan,
          terms: data.terms,
        });

        if (!result.success) {
          // Check for user already exists error
          if (result.error?.includes("exists")) {
            try {
              // Try to log in instead
              await appwriteAccount.createSession(data.email, data.password);
              await syncRegister(data.email, data.password, "");

              toast.success("Logged in with existing account");
              setTimeout(() => router.push(ROUTES.HOME), 1000);
              return;
            } catch (e) {
              console.error("Error logging in with existing account:", e);
              setError(
                "An account with this email already exists. Please sign in."
              );
              return;
            }
          }

          setError(result.error || "Registration failed");
          return;
        }

        // Sync client-side state
        await syncRegister(data.email, data.password, "");

        // No need to set cookies on client as server action already sets them
        // and middleware will pick them up on the next navigation

        toast.success("Account created successfully!");
        setTimeout(() => router.push(ROUTES.HOME), 1000);
      } catch (e) {
        console.error("Sign up error:", e);
        const msg =
          e instanceof Error
            ? e.message
            : "An unexpected error occurred. Please try again.";
        setError(msg);
      }
    });
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={(data) => handleSignUp(data as SignUpFormValues)}
      isLoading={isPending}
      error={error}
    />
  );
}
