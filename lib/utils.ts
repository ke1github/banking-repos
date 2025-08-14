import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Utility functions for the banking app.
 */

/**
 * Formats a number as currency.
 * @param amount The amount to format.
 * @param currency The currency code, e.g., 'USD', 'EUR'.
 * @returns The formatted currency string.
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Generates a random integer between min and max (inclusive).
 * @param min Minimum value.
 * @param max Maximum value.
 * @returns Random integer.
 */
export function getRandomInt(min: number, max: number): number {
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}

/**
 * Validates if a string is a valid email address.
 * @param email The email string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Delays execution for a given number of milliseconds.
 * @param ms Milliseconds to delay.
 * @returns Promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
