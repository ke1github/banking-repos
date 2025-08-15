"use client";

import React from "react";
import Link from "next/link";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";
import {
  FormContainer,
  FormNavigation,
  FormStep,
  StepIndicator,
} from "./FormComponents";
import { TextField, PasswordField, CheckboxField } from "./FormFields";
import { useAuthForm, AuthMode } from "@/lib/hooks/useAuthForm";

// Icons for form fields
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const CityIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
    />
  </svg>
);

const StateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
    />
  </svg>
);

const PinCodeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
    />
  </svg>
);

const DocumentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
    />
  </svg>
);

// Define the component props
interface AuthFormProps {
  mode: AuthMode;
  onSubmit: (data: SignInFormValues | SignUpFormValues) => void;
  isLoading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  isLoading = false,
}) => {
  const {
    signInForm,
    signUpForm,
    formError,
    showPassword,
    signupStep,
    togglePasswordVisibility,
    handleSignInSubmit,
    handleSignUpSubmit,
    // validateStep, // Removed unused variable
    goToNextStep,
    goToPreviousStep,
  } = useAuthForm({ mode, onSubmit });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "signin") {
      void signInForm.handleSubmit(handleSignInSubmit)();
    } else {
      if (signupStep === "financial") {
        void signUpForm.handleSubmit(handleSignUpSubmit)();
      } else {
        void goToNextStep(signupStep);
      }
    }
  };

  if (mode === "signin") {
    return (
      <FormContainer onSubmit={handleFormSubmit}>
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>

        {formError && (
          <div
            className={`p-4 mb-4 rounded-md ${
              formError.type === "error"
                ? "bg-red-50 text-red-800"
                : "bg-green-50 text-green-800"
            }`}
          >
            {formError.message}
          </div>
        )}

        <div className="space-y-4">
          <TextField
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            form={signInForm}
            icon={<EmailIcon />}
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Enter your password"
            form={signInForm}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />

          <div className="flex justify-between items-center">
            <CheckboxField
              name="remember"
              label="Remember me"
              form={signInForm}
            />
            <a
              href="#"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          disabled={isLoading || signInForm.formState.isSubmitting}
        >
          {isLoading || signInForm.formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </div>
          ) : (
            "Sign In"
          )}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign up
          </Link>
        </p>
      </FormContainer>
    );
  }

  // Sign Up Form
  const steps = ["Personal Info", "Address Info", "Financial Info"];
  const currentStepIndex =
    signupStep === "personal" ? 0 : signupStep === "address" ? 1 : 2;

  return (
    <FormContainer onSubmit={handleFormSubmit}>
      <h1 className="text-2xl font-bold text-center mb-6">
        Create Your Account
      </h1>

      {formError && (
        <div
          className={`p-4 mb-4 rounded-md ${
            formError.type === "error"
              ? "bg-red-50 text-red-800"
              : "bg-green-50 text-green-800"
          }`}
        >
          {formError.message}
        </div>
      )}

      <StepIndicator
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        steps={steps}
      />

      {/* Personal Information Step */}
      <FormStep
        title="Personal Information"
        isActive={signupStep === "personal"}
      >
        <div className="space-y-4">
          <TextField
            name="name"
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            form={signUpForm}
            icon={<UserIcon />}
          />

          <TextField
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            form={signUpForm}
            icon={<EmailIcon />}
          />

          <PasswordField
            name="password"
            label="Password"
            placeholder="Create a strong password"
            form={signUpForm}
            showPassword={showPassword}
            togglePasswordVisibility={togglePasswordVisibility}
          />

          <TextField
            name="mobile"
            label="Mobile Number"
            type="tel"
            placeholder="10-digit mobile number"
            form={signUpForm}
            icon={<PhoneIcon />}
            maxLength={10}
          />

          <TextField
            name="dateOfBirth"
            label="Date of Birth"
            type="date"
            placeholder=""
            form={signUpForm}
            icon={<CalendarIcon />}
            style={{ paddingLeft: "2.5rem" }}
          />
        </div>
      </FormStep>

      {/* Address Information Step */}
      <FormStep title="Address Information" isActive={signupStep === "address"}>
        <div className="space-y-4">
          <TextField
            name="addressLine1"
            label="Address Line 1"
            type="text"
            placeholder="Street address"
            form={signUpForm}
            icon={<LocationIcon />}
          />

          <TextField
            name="addressLine2"
            label="Address Line 2 (Optional)"
            type="text"
            placeholder="Apartment, suite, unit, etc."
            form={signUpForm}
            icon={<LocationIcon />}
          />

          <TextField
            name="city"
            label="City"
            type="text"
            placeholder="Enter your city"
            form={signUpForm}
            icon={<CityIcon />}
          />

          <TextField
            name="state"
            label="State"
            type="text"
            placeholder="Enter your state"
            form={signUpForm}
            icon={<StateIcon />}
          />

          <TextField
            name="pinCode"
            label="PIN Code"
            type="text"
            placeholder="6-digit PIN code"
            form={signUpForm}
            icon={<PinCodeIcon />}
            maxLength={6}
          />
        </div>
      </FormStep>

      {/* Financial Information Step */}
      <FormStep
        title="Financial Information"
        isActive={signupStep === "financial"}
      >
        <div className="space-y-4">
          <TextField
            name="pan"
            label="PAN Number"
            type="text"
            placeholder="Enter your PAN number"
            form={signUpForm}
            icon={<DocumentIcon />}
            maxLength={10}
          />

          <CheckboxField
            name="terms"
            label={
              <span>
                I agree to the{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-500"
                  onClick={(e) => e.preventDefault()}
                >
                  Privacy Policy
                </a>
              </span>
            }
            form={signUpForm}
          />
        </div>
      </FormStep>

      <FormNavigation
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        canGoNext={!isLoading && !signUpForm.formState.isSubmitting}
        canGoBack={signupStep !== "personal"}
        isSubmitting={isLoading || signUpForm.formState.isSubmitting}
        onNext={() => {
          const event = new Event("click") as unknown as React.FormEvent;
          handleFormSubmit(event);
        }}
        onBack={() => goToPreviousStep()}
      />

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Sign in
        </Link>
      </p>
    </FormContainer>
  );
};

export default AuthForm;
