"use client";

import React from "react";
import { Button } from "../ui/button";

interface FormStepProps {
  title: string;
  children: React.ReactNode;
  isActive: boolean;
}

export const FormStep: React.FC<FormStepProps> = ({
  title,
  children,
  isActive,
}) => {
  if (!isActive) return null;

  return (
    <div className="animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      {children}
    </div>
  );
};

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  index < currentStep
                    ? "bg-blue-600 text-white"
                    : index === currentStep
                    ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index < currentStep ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs ${
                  index <= currentStep
                    ? "text-blue-600 font-medium"
                    : "text-gray-500"
                }`}
              >
                {step}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`flex-1 h-0.5 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoBack: boolean;
  isSubmitting: boolean;
  onNext: (e?: any) => void;
  onBack: () => void;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  canGoNext,
  canGoBack,
  isSubmitting,
  onNext,
  onBack,
}) => {
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={!canGoBack || isSubmitting}
        className="px-6"
      >
        Back
      </Button>

      <Button
        type="button"
        onClick={onNext}
        disabled={!canGoNext || isSubmitting}
        className="px-6"
      >
        {isSubmitting ? (
          <div className="flex items-center">
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
            Processing...
          </div>
        ) : isLastStep ? (
          "Create Account"
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
};

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8"
    >
      {children}
    </form>
  );
};
