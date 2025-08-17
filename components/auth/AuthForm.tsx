"use client";

import React, { useState, type ReactNode } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiHome,
  FiMap,
  FiMapPin,
  FiFlag,
  FiHash,
  FiCreditCard,
  FiLoader,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/logo";
import { useAuthForm } from "@/lib/hooks/useAuthForm";
import { TextField, PasswordField, CheckboxField } from "./FormFields";
import { StepIndicator, FormStep, FormNavigation } from "./FormComponents";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";
import Link from "next/link";

export interface AuthFormProps {
  mode?: "signin" | "signup";
  onSubmit: (data: SignInFormValues | SignUpFormValues) => void;
  isLoading?: boolean;
  error?: string;
}

const AuthForm = ({
  mode = "signin",
  onSubmit,
  isLoading = false,
  error = "",
}: AuthFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  // Centralized steps count to avoid duplication
  const TOTAL_STEPS = 3 as const;

  type FieldConfig = {
    label: string;
    name: string;
    type: string;
    placeholder: string;
    icon?: ReactNode;
  };

  const personalFields: FieldConfig[] = [
    {
      label: "First Name",
      name: "firstName",
      type: "text",
      placeholder: "John",
      icon: <FiUser />,
    },
    {
      label: "Middle Name (Optional)",
      name: "middleName",
      type: "text",
      placeholder: "Robert",
      icon: <FiUser />,
    },
    {
      label: "Last Name",
      name: "lastName",
      type: "text",
      placeholder: "Doe",
      icon: <FiUser />,
    },
    {
      label: "Email Address",
      name: "email",
      type: "email",
      placeholder: "john@example.com",
      icon: <FiMail />,
    },
  ];

  const addressFields: FieldConfig[] = [
    {
      label: "Address Line 1",
      name: "addressLine1",
      type: "text",
      placeholder: "Street address",
      icon: <FiHome />,
    },
    {
      label: "Address Line 2 (Optional)",
      name: "addressLine2",
      type: "text",
      placeholder: "Apartment, suite, etc.",
      icon: <FiMap />,
    },
    {
      label: "City",
      name: "city",
      type: "text",
      placeholder: "Your city",
      icon: <FiMapPin />,
    },
    {
      label: "State",
      name: "state",
      type: "text",
      placeholder: "Your state",
      icon: <FiFlag />,
    },
    {
      label: "PIN Code",
      name: "pinCode",
      type: "text",
      placeholder: "6-digit PIN code",
      icon: <FiHash />,
    },
  ];

  const {
    form,
    currentStep,
    goToNextStep,
    goToPreviousStep,
    handleSubmit,
    isSubmitting,
    validateStep,
  } = useAuthForm({
    mode,
    onSubmit,
    isLoading,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo and header */}
      <div className="text-center mb-8">
        <Logo variant="large" showText className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">
          {mode === "signin" ? "Sign in to your account" : "Create an account"}
        </h1>
        <p className="mt-2 text-gray-600">
          {mode === "signin"
            ? "Welcome back! Enter your details to access your account."
            : "Get started with SP Banking by creating your account."}
        </p>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Display error message if any */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
            <p>{error}</p>
          </div>
        )}

        {mode === "signup" && (
          <StepIndicator
            steps={["Personal", "Address", "Financial"]}
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {mode === "signup" ? (
            <>
              {/* Step 1: Personal Information */}
              <FormStep
                title="Personal Information"
                isActive={currentStep === 0}
              >
                {personalFields.map((f) => (
                  <TextField
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    type={f.type}
                    form={form}
                    placeholder={f.placeholder}
                    icon={f.icon}
                  />
                ))}
                <PasswordField
                  label="Password"
                  name="password"
                  form={form}
                  placeholder="Create a strong password"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
                <TextField
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  form={form}
                  placeholder="+91 9876543210"
                  icon={<FiPhone />}
                />
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  form={form}
                  placeholder="DD/MM/YYYY"
                  type="date"
                  icon={<FiCalendar />}
                />
              </FormStep>

              {/* Step 2: Address Information */}
              <FormStep
                title="Address Information"
                isActive={currentStep === 1}
              >
                {addressFields.map((f) => (
                  <TextField
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    type={f.type}
                    form={form}
                    placeholder={f.placeholder}
                    icon={f.icon}
                  />
                ))}
              </FormStep>

              {/* Step 3: Financial Information */}
              <FormStep
                title="Financial Information"
                isActive={currentStep === 2}
              >
                <TextField
                  label="PAN Number"
                  name="pan"
                  type="text"
                  form={form}
                  placeholder="10-character PAN"
                  icon={<FiCreditCard />}
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                />
                <CheckboxField
                  name="terms"
                  form={form}
                  label={
                    <span>
                      I agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  }
                />
              </FormStep>
            </>
          ) : (
            <>
              <TextField
                label="Email Address"
                name="email"
                type="email"
                form={form}
                placeholder="john@example.com"
                icon={<FiMail />}
              />
              <PasswordField
                label="Password"
                name="password"
                form={form}
                placeholder="Enter your password"
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              <div className="flex items-center justify-between">
                <CheckboxField
                  name="remember"
                  form={form}
                  label="Remember me"
                />
                <a
                  href="#"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </a>
              </div>
            </>
          )}

          {/* Form Navigation */}
          {mode === "signup" && (
            <FormNavigation
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              canGoNext={!isSubmitting}
              canGoBack={currentStep > 0}
              isSubmitting={isSubmitting}
              onBack={goToPreviousStep}
              onNext={async () => {
                const ok = await validateStep(currentStep);
                if (ok) goToNextStep();
              }}
            />
          )}

          {/* Submit Button */}
          {mode === "signin" && (
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium transition",
                "hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <FiLoader className="animate-spin mr-2" />
                  Signing in...
                </span>
              ) : (
                <>Sign in</>
              )}
            </button>
          )}
        </form>

        {/* Sign up / Sign in alternative */}
        <div className="mt-6 text-center text-sm">
          {mode === "signin" ? (
            <p>
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Social Login Section */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button
              type="button"
              className="inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                  fill="#34A853"
                />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-[#1DA1F2]"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.92 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.83 4.5 17.72 4 16.46 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.73-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.9 20.29 6.16 21 8.58 21c7.88 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50"
            >
              <svg
                className="h-5 w-5 text-[#24292F]"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
