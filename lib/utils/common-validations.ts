import { z } from "zod";

/**
 * Common validation schemas that can be reused across the app
 */
export const CommonValidation = {
  // User validation schemas
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

  simplePassword: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),

  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces",
    })
    .trim(),

  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .min(2, { message: "First name must be at least 2 characters long" })
    .regex(/^[a-zA-Z]*$/, {
      message: "First name can only contain letters",
    })
    .trim(),

  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .min(2, { message: "Last name must be at least 2 characters long" })
    .regex(/^[a-zA-Z]*$/, {
      message: "Last name can only contain letters",
    })
    .trim(),

  middleName: z
    .string()
    .regex(/^[a-zA-Z]*$/, {
      message: "Middle name can only contain letters",
    })
    .trim()
    .optional(),

  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^[0-9]{10}$/, {
      message: "Please enter a valid 10-digit phone number",
    }),

  phoneOptional: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, {
      message: "Please enter a valid phone number",
    })
    .optional()
    .or(z.literal("")),

  // Address validation
  address: z.string().min(1, { message: "Address is required" }).trim(),
  city: z.string().min(1, { message: "City is required" }).trim(),
  state: z.string().min(1, { message: "State is required" }).trim(),
  pinCode: z
    .string()
    .min(1, { message: "PIN code is required" })
    .regex(/^[0-9]{6}$/, { message: "Please enter a valid 6-digit PIN code" }),

  // Financial validation schemas
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

  accountNumber: z.string().min(1, { message: "Account is required" }),

  pan: z
    .string()
    .min(1, { message: "PAN number is required" })
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: "Please enter a valid PAN number (e.g., ABCDE1234F)",
    })
    .transform((val) => val.toUpperCase()),

  // Card validation
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
};
