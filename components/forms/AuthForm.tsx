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
import {
  AdaptedTextField,
  AdaptedPasswordField,
  AdaptedCheckboxField,
} from "./FormAdapter";
import { StepIndicator, FormStep, FormNavigation } from "./FormComponents";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import GoogleLoginButton from "@/components/forms/GoogleLoginButton";

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
    onSubmitAction: onSubmit,
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
                  <AdaptedTextField
                    key={f.name}
                    label={f.label}
                    name={f.name}
                    type={f.type}
                    form={form}
                    placeholder={f.placeholder}
                    icon={f.icon}
                  />
                ))}
                <AdaptedPasswordField
                  label="Password"
                  name="password"
                  form={form}
                  placeholder="Create a strong password"
                  showPassword={showPassword}
                  togglePasswordVisibility={togglePasswordVisibility}
                />
                <AdaptedTextField
                  label="Mobile Number"
                  name="mobile"
                  type="tel"
                  form={form}
                  placeholder="+91 9876543210"
                  icon={<FiPhone />}
                />
                <AdaptedTextField
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
                  <AdaptedTextField
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
                <AdaptedTextField
                  label="PAN Number"
                  name="pan"
                  type="text"
                  form={form}
                  placeholder="10-character PAN"
                  icon={<FiCreditCard />}
                  maxLength={10}
                  style={{ textTransform: "uppercase" }}
                />
                <AdaptedCheckboxField
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
              <AdaptedTextField
                label="Email Address"
                name="email"
                type="email"
                form={form}
                placeholder="john@example.com"
                icon={<FiMail />}
              />
              <AdaptedPasswordField
                label="Password"
                name="password"
                form={form}
                placeholder="Enter your password"
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
              />

              <div className="flex items-center justify-between">
                <AdaptedCheckboxField
                  name="remember"
                  form={form}
                  label="Remember me"
                />
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
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
              suppressHydrationWarning
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
                href={ROUTES.SIGN_UP}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link
                href={ROUTES.SIGN_IN}
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

          <div className="mt-6 grid grid-cols-1 gap-3">
            <GoogleLoginButton
              remember={Boolean(form.getValues?.("remember"))}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
