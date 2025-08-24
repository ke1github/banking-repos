"use client";

// This file provides a consistent theme configuration for the banking app
// Use these colors throughout the application to maintain visual consistency

export const bankingTheme = {
  // Primary colors
  primary: {
    main: "blue-700",
    light: "blue-600",
    dark: "blue-800",
    gradient: "from-blue-600 to-blue-800",
    hover: "blue-900",
  },

  // Accent colors for specific sections
  banking: {
    main: "blue-700",
    light: "blue-500",
    dark: "blue-900",
    accent: "blue-100",
  },

  investment: {
    main: "blue-700",
    light: "blue-600",
    dark: "blue-800",
    accent: "blue-100",
  },

  // Status colors
  status: {
    success: "green-600",
    warning: "amber-500",
    error: "red-600",
    info: "sky-500",
  },

  // Background colors
  background: {
    light: "white",
    muted: "gray-50",
    subtle: "blue-50",
    gradient: "from-blue-50 to-blue-100",
  },

  // Text colors
  text: {
    primary: "gray-900",
    secondary: "gray-600",
    muted: "gray-400",
    accent: "blue-700",
  },
};

// Usage:
// import { bankingTheme } from "@/lib/theme";
// <div className={`text-${bankingTheme.primary.main} bg-${bankingTheme.background.muted}`}>
//   Content here
// </div>
