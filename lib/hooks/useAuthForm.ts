"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signInSchema,
  signUpSchema,
  SignInFormValues,
  SignUpFormValues,
} from "@/lib/validations";

// Form errors state type
export interface FormErrorState {
  message: string;
  type: "error" | "success";
}

export type AuthMode = "signin" | "signup";
export type SignupStep = "personal" | "address" | "financial";

interface UseAuthFormProps {
  mode: AuthMode;
  onSubmit: (data: SignInFormValues | SignUpFormValues) => void;
}

export const useAuthForm = ({ mode, onSubmit }: UseAuthFormProps) => {
  // Form error state
  const [formError, setFormError] = useState<FormErrorState | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // For signup form steps
  const [signupStep, setSignupStep] = useState<SignupStep>("personal");

  // Setup sign-in form
  const signInForm = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  // Setup sign-up form
  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema) as any, // Using 'any' to fix TypeScript issue with addressLine2 optional vs undefined
    mode: "onChange",
    defaultValues: {
      terms: false,
      name: "",
      email: "",
      password: "",
      mobile: "",
      dateOfBirth: "",
      addressLine1: "",
      addressLine2: undefined,
      city: "",
      state: "",
      pinCode: "",
      pan: "",
    },
  });

  // Form submission handler for sign in
  const handleSignInSubmit = (data: SignInFormValues) => {
    try {
      setFormError(null);
      onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError({
        message: error instanceof Error ? error.message : "An error occurred",
        type: "error",
      });
    }
  };

  // Form submission handler for sign up
  const handleSignUpSubmit = (data: SignUpFormValues) => {
    try {
      setFormError(null);
      onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError({
        message: error instanceof Error ? error.message : "An error occurred",
        type: "error",
      });
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Validate step before proceeding to the next step
  const validateStep = async (step: SignupStep) => {
    if (mode !== "signup") return true;

    if (step === "personal") {
      return await signUpForm.trigger([
        "name",
        "email",
        "password",
        "mobile",
        "dateOfBirth",
      ]);
    } else if (step === "address") {
      return await signUpForm.trigger([
        "addressLine1",
        "city",
        "state",
        "pinCode",
      ]);
    } else if (step === "financial") {
      return await signUpForm.trigger(["pan"]);
    }

    return false;
  };

  // Navigate to next step after validation
  const goToNextStep = async (currentStep: SignupStep) => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    if (currentStep === "personal") setSignupStep("address");
    else if (currentStep === "address") setSignupStep("financial");
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    if (signupStep === "address") setSignupStep("personal");
    else if (signupStep === "financial") setSignupStep("address");
  };

  return {
    mode,
    formError,
    setFormError,
    signInForm,
    signUpForm,
    showPassword,
    signupStep,
    setSignupStep,
    togglePasswordVisibility,
    handleSignInSubmit,
    handleSignUpSubmit,
    validateStep,
    goToNextStep,
    goToPreviousStep,
  };
};
