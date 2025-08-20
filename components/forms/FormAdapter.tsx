"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";

// This is a higher-order component that adapts our simple form implementation
// to match the interface expected by components that require react-hook-form
export function withFormAdapter<P extends { form: UseFormReturn<any, any> }>(
  Component: React.ComponentType<P>
) {
  return function AdaptedComponent(
    props: Omit<P, "form"> & {
      form: {
        register: () => Record<string, unknown>;
        formState: { errors: Record<string, unknown>; isSubmitting: boolean };
        // Include other properties that might be used
        getValues: (fieldName?: string) => any;
        setValue: (...args: any[]) => void;
        watch: (...args: any[]) => any;
      };
    }
  ) {
    // Create an adapted form object that matches UseFormReturn
    const adaptedForm = {
      ...props.form,
      // Ensure register returns an object with name, onChange, etc.
      register: (name: string) => ({
        name,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          // This is just a placeholder - our simple form implementation
          // handles form values directly in the handleSubmit function
        },
        onBlur: () => {},
        ref: () => {},
      }),
    } as unknown as UseFormReturn<any, any>;

    // Pass the adapted form to the wrapped component
    return <Component {...(props as any)} form={adaptedForm} />;
  };
}

// Create adapted versions of form field components
import {
  TextField as OriginalTextField,
  PasswordField as OriginalPasswordField,
  CheckboxField as OriginalCheckboxField,
} from "./FormFields";

export const AdaptedTextField = withFormAdapter(OriginalTextField);
export const AdaptedPasswordField = withFormAdapter(OriginalPasswordField);
export const AdaptedCheckboxField = withFormAdapter(OriginalCheckboxField);
