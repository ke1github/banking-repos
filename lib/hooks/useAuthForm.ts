"use client";

import { useState, useCallback, FormEvent } from "react";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";

// Update AuthFormType to match the values used in AuthForm component
export type AuthFormType = "signin" | "signup" | "reset" | "resetPassword";

type FormSubmitHandler = (
  data: SignInFormValues | SignUpFormValues
) => Promise<void> | void;

// Enhanced version of the hook with form handling
export function useAuthForm({
  mode = "signin",
  onSubmitAction,
  isLoading: externalLoading = false,
}: {
  mode?: AuthFormType;
  onSubmitAction: FormSubmitHandler;
  isLoading?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Form handling
  const form = {
    register: () => ({}),
    handleSubmit: (callback: FormSubmitHandler) => async (e: FormEvent) => {
      e.preventDefault();

      // For demonstration, create default values for sign-in
      if (mode === "signin") {
        const formEl = e.target as HTMLFormElement;
        const emailInput = formEl.querySelector(
          '[name="email"]'
        ) as HTMLInputElement;
        const passwordInput = formEl.querySelector(
          '[name="password"]'
        ) as HTMLInputElement;
        const rememberInput = formEl.querySelector(
          '[name="remember"]'
        ) as HTMLInputElement;

        const data: SignInFormValues = {
          email: emailInput?.value || "",
          password: passwordInput?.value || "",
          remember: rememberInput?.checked || false,
        };

        await callback(data);
      }
      // For signup, create basic user data
      else {
        const formEl = e.target as HTMLFormElement;
        const data: SignUpFormValues = {
          firstName:
            (formEl.querySelector('[name="firstName"]') as HTMLInputElement)
              ?.value || "",
          lastName:
            (formEl.querySelector('[name="lastName"]') as HTMLInputElement)
              ?.value || "",
          email:
            (formEl.querySelector('[name="email"]') as HTMLInputElement)
              ?.value || "",
          password:
            (formEl.querySelector('[name="password"]') as HTMLInputElement)
              ?.value || "",
          confirmPassword:
            (
              formEl.querySelector(
                '[name="confirmPassword"]'
              ) as HTMLInputElement
            )?.value || "",
          mobile:
            (formEl.querySelector('[name="mobile"]') as HTMLInputElement)
              ?.value || "",
          dateOfBirth:
            (formEl.querySelector('[name="dateOfBirth"]') as HTMLInputElement)
              ?.value || "",
          addressLine1:
            (formEl.querySelector('[name="addressLine1"]') as HTMLInputElement)
              ?.value || "",
          addressLine2:
            (formEl.querySelector('[name="addressLine2"]') as HTMLInputElement)
              ?.value || "",
          city:
            (formEl.querySelector('[name="city"]') as HTMLInputElement)
              ?.value || "",
          state:
            (formEl.querySelector('[name="state"]') as HTMLInputElement)
              ?.value || "",
          pinCode:
            (formEl.querySelector('[name="pinCode"]') as HTMLInputElement)
              ?.value || "",
          pan:
            (formEl.querySelector('[name="pan"]') as HTMLInputElement)?.value ||
            "",
          terms:
            (formEl.querySelector('[name="terms"]') as HTMLInputElement)
              ?.checked || false,
          middleName:
            (formEl.querySelector('[name="middleName"]') as HTMLInputElement)
              ?.value || "",
        };

        await callback(data);
      }
    },
    formState: {
      errors: {},
      isSubmitting: isLoading || externalLoading,
    },
    getValues: (fieldName?: string) => {
      // If fieldName is provided, return a mock value for that field
      if (fieldName === "remember") return false;
      // Otherwise return an empty object
      return fieldName ? "" : {};
    },
    setValue: () => {},
    watch: () => [], // Return empty array instead of empty object
    // Add additional methods to better match UseFormReturn interface
    getFieldState: () => ({}),
    setError: () => {},
    clearErrors: () => {},
    reset: () => {},
    resetField: () => {},
    trigger: () => Promise.resolve(true),
    control: {},
    // Add remaining methods for full UseFormReturn compatibility
    unregister: () => {},
    setFocus: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  };

  // Handle form submission
  const handleSubmit = async (values: SignInFormValues | SignUpFormValues) => {
    if (isLoading || externalLoading) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSubmitAction(values);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred");
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Step navigation functions
  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Updated to make the step parameter optional
  const validateStep = useCallback(
    (step?: number) => {
      // We can use the step parameter internally if needed
      console.log(`Validating step ${step !== undefined ? step : currentStep}`);
      return true; // Mock validation
    },
    [currentStep]
  );

  return {
    form,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    isLoading: isLoading || externalLoading,
    isSubmitting: isLoading || externalLoading,
    error,
    success,
    setError,
    setSuccess,
    handleSubmit: form.handleSubmit(handleSubmit),
    validateStep,
  };
}
