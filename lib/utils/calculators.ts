/**
 * Common calculation utilities for financial calculators
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const parseNumericInput = (value: string): number => {
  const cleaned = value.replace(/[,\s]/g, "");
  return parseFloat(cleaned) || 0;
};

export const validatePositiveNumber = (value: string): boolean => {
  const num = parseNumericInput(value);
  return num > 0 && !isNaN(num);
};

export const calculatePercentage = (part: number, whole: number): number => {
  return whole > 0 ? (part / whole) * 100 : 0;
};

export const roundToDecimalPlaces = (
  num: number,
  decimalPlaces: number = 2
): number => {
  return (
    Math.round(num * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)
  );
};
