import { z } from "zod";

/**
 * Auth Form Validation Schemas
 */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
  remember: z.boolean().optional(),
});

export const signUpSchema = z.object({
  // Personal Information
  name: z
    .string()
    .min(1, { message: "Full name is required" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    })
    .trim(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .trim(),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    }),
  mobile: z
    .string()
    .min(1, { message: "Mobile number is required" })
    .regex(/^[0-9]{10}$/, {
      message: "Please enter a valid 10-digit mobile number",
    }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),

  // Address Information
  addressLine1: z
    .string()
    .min(1, { message: "Address line 1 is required" })
    .trim(),
  addressLine2: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  city: z.string().min(1, { message: "City is required" }).trim(),
  state: z.string().min(1, { message: "State is required" }).trim(),
  pinCode: z
    .string()
    .min(1, { message: "PIN code is required" })
    .regex(/^[0-9]{6}$/, { message: "Please enter a valid 6-digit PIN code" }),

  // Financial Information
  pan: z
    .string()
    .min(1, { message: "PAN number is required" })
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Please enter a valid PAN number",
    })
    .trim(),

  // Terms and Conditions
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Form data types
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

/**
 * Transfer Form Validation Schema
 */
export const transferFormSchema = z.object({
  fromAccount: z.string().min(1, { message: "Please select an account" }),
  toAccount: z.string().min(1, { message: "Please select a recipient" }),
  amount: z
    .string()
    .min(1, { message: "Amount is required" })
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0;
      },
      { message: "Please enter a valid amount greater than 0" }
    ),
  description: z.string().optional(),
});

export type TransferFormValues = z.infer<typeof transferFormSchema>;

/**
 * Profile Form Validation Schema
 */
export const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    })
    .trim(),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .trim(),
  phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Please enter a valid phone number",
    })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/**
 * Card Form Validation Schema
 */
export const cardFormSchema = z.object({
  cardholderName: z
    .string()
    .min(1, { message: "Cardholder name is required" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    }),
  cardNumber: z
    .string()
    .min(1, { message: "Card number is required" })
    .regex(/^[0-9]{16}$/, {
      message: "Card number must be 16 digits",
    }),
  expiryMonth: z
    .string()
    .min(1, { message: "Expiry month is required" })
    .regex(/^(0[1-9]|1[0-2])$/, {
      message: "Please enter a valid month (01-12)",
    }),
  expiryYear: z
    .string()
    .min(1, { message: "Expiry year is required" })
    .regex(/^[0-9]{2}$/, {
      message: "Please enter a valid 2-digit year",
    }),
  cvv: z
    .string()
    .min(1, { message: "CVV is required" })
    .regex(/^[0-9]{3,4}$/, {
      message: "CVV must be 3 or 4 digits",
    }),
});

export type CardFormValues = z.infer<typeof cardFormSchema>;
