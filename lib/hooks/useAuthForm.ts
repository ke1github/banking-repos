"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInFormValues,
  SignUpFormValues,
  signInSchema,
  signUpSchema,
} from "@/lib/validations";

interface UseAuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: SignInFormValues | SignUpFormValues) => void;
  isLoading?: boolean;
}

export const useAuthForm = ({
  mode,
  onSubmit,
  isLoading,
}: UseAuthFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(isLoading || false);

  const schema = mode === "signin" ? signInSchema : signUpSchema;

  const form = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues:
      mode === "signin"
        ? { email: "", password: "", remember: false }
        : {
            firstName: "",
            middleName: "",
            lastName: "",
            email: "",
            password: "",
            mobile: "",
            dateOfBirth: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            pinCode: "",
            pan: "",
            terms: false,
          },
    mode: "onBlur",
  });

  const {
    formState: { errors },
  } = form;

  // Get field names for each step
  const stepFields = {
    0: [
      "firstName",
      "middleName",
      "lastName",
      "email",
      "password",
      "mobile",
      "dateOfBirth",
    ],
    1: ["addressLine1", "addressLine2", "city", "state", "pinCode"],
    2: ["pan", "terms"],
  };

  const isLastStep = mode === "signin" ? true : currentStep === 2;

  const validateStep = async (step: number) => {
    if (mode === "signin") return true;
    const fieldsToValidate = stepFields[step as keyof typeof stepFields];
    return form.trigger(fieldsToValidate as any);
  };

  const goToNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await Promise.resolve(onSubmit(data));
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    form,
    currentStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    isSubmitting,
    setIsSubmitting,
    errors,
    validateStep,
  };
};
