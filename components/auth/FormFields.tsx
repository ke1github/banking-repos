"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { SignInFormValues, SignUpFormValues } from "@/lib/validations";

interface TextFieldProps {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  form: UseFormReturn<any>;
  icon: React.ReactNode;
  maxLength?: number;
  style?: React.CSSProperties;
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  form,
  icon,
  maxLength,
  style,
}) => {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={type}
          placeholder={placeholder}
          className={`text-[16px] rounded-lg border w-full ${
            errors[name]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } p-2.5 pl-10 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1`}
          maxLength={maxLength}
          style={style}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <div
            className={`w-5 h-5 ${
              errors[name] ? "text-red-500" : "text-gray-400"
            }`}
          >
            {icon}
          </div>
        </div>
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
};

interface PasswordFieldProps {
  name: string;
  label: string;
  placeholder: string;
  form: UseFormReturn<any>;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  name,
  label,
  placeholder,
  form,
  showPassword,
  togglePasswordVisibility,
}) => {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[14px] font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={`text-[16px] rounded-lg border w-full ${
            errors[name]
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          } p-2.5 pl-10 pr-10 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1`}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`w-5 h-5 ${
              errors[name] ? "text-red-500" : "text-gray-400"
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
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
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
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
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          )}
        </button>
      </div>
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">
          {String(errors[name]?.message)}
        </p>
      )}
    </div>
  );
};

interface CheckboxFieldProps {
  name: string;
  label: React.ReactNode;
  form: UseFormReturn<any>;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  form,
}) => {
  const { register, formState } = form;
  const { errors } = formState;

  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          {...register(name)}
          id={name}
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>
      <div className="ml-2 text-sm">
        <label htmlFor={name} className="text-gray-700">
          {label}
        </label>
        {errors[name] && (
          <p className="text-sm text-red-500 mt-1">
            {String(errors[name]?.message)}
          </p>
        )}
      </div>
    </div>
  );
};
