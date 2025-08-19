import { z } from "zod";
import { CommonValidation } from "./utils/common-validations";

/**
 * Auth Form Validation Schemas
 */
export const signInSchema = z.object({
  email: CommonValidation.email,
  password: CommonValidation.simplePassword, // Using simpler password validation for login
  remember: z.boolean().optional(),
});

export const signUpSchema = z.object({
  // Personal Information
  firstName: CommonValidation.firstName,
  middleName: CommonValidation.middleName,
  lastName: CommonValidation.lastName,
  email: CommonValidation.email,
  password: CommonValidation.password,
  mobile: CommonValidation.phone,
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),

  // Address Information
  addressLine1: CommonValidation.address,
  addressLine2: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  city: CommonValidation.city,
  state: CommonValidation.state,
  pinCode: CommonValidation.pinCode,

  // Financial Information
  pan: CommonValidation.pan,

  // Terms and Conditions
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Form data types
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema> & {
  name?: string; // Add optional name property for backward compatibility
  _firstName?: string; // Internal use
  _lastName?: string; // Internal use
  _middleName?: string; // Internal use
};

/**
 * Transfer Form Validation Schema
 */
export const transferFormSchema = z.object({
  fromAccount: CommonValidation.accountNumber,
  toAccount: CommonValidation.accountNumber,
  amount: CommonValidation.amount,
  description: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferFormSchema>;

/**
 * Profile Form Validation Schema
 */
export const profileFormSchema = z.object({
  name: CommonValidation.name,
  email: CommonValidation.email,
  phone: CommonValidation.phoneOptional,
  address: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/**
 * Card Form Validation Schema
 */
export const cardFormSchema = z.object({
  cardholderName: CommonValidation.cardholderName,
  cardNumber: CommonValidation.cardNumber,
  expiryMonth: CommonValidation.expiryMonth,
  expiryYear: CommonValidation.expiryYear,
  cvv: CommonValidation.cvv,
});

export type CardFormValues = z.infer<typeof cardFormSchema>;
