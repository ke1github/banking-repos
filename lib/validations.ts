import { z } from "zod";

// Login form validation schema
export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  remember: z.boolean().optional().default(false),
});

// Registration form validation schema
export const signUpSchema = z
  .object({
    // Personal Information
    firstName: z
      .string()
      .min(2, { message: "First name must be at least 2 characters" }),
    middleName: z.string().optional(),
    lastName: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    mobile: z
      .string()
      .min(10, { message: "Please enter a valid mobile number" }),
    dateOfBirth: z.string().refine(
      (val) => {
        // Basic date validation - can be enhanced
        return val && new Date(val).toString() !== "Invalid Date";
      },
      { message: "Please enter a valid date of birth" }
    ),

    // Address Information
    addressLine1: z.string().min(1, { message: "Address is required" }),
    addressLine2: z.string().optional(),
    city: z.string().min(1, { message: "City is required" }),
    state: z.string().min(1, { message: "State is required" }),
    pinCode: z.string().min(6, { message: "Please enter a valid PIN code" }),

    // Financial Information
    pan: z
      .string()
      .min(10, { message: "Please enter a valid 10-character PAN" }),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Password reset request validation schema
export const resetRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Password reset validation schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Types for form values
// Transfer form validation schema
export const transferFormSchema = z.object({
  fromAccount: z.string().min(1, { message: "Source account is required" }),
  toAccount: z.string().min(1, { message: "Destination account is required" }),
  amount: z
    .number()
    .min(0.01, { message: "Amount is required and must be positive" }),
  description: z.string().optional(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type ResetRequestFormValues = z.infer<typeof resetRequestSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type TransferFormValues = z.infer<typeof transferFormSchema>;
