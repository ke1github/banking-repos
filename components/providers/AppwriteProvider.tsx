"use client";

import React from "react";
import {
  AppwriteAuthContext,
  useProvideAppwrite,
} from "@/lib/hooks/useAppwrite";

interface AppwriteProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application with Appwrite authentication context
 */
export function AppwriteAuthProvider({ children }: AppwriteProviderProps) {
  const auth = useProvideAppwrite();

  return (
    <AppwriteAuthContext.Provider value={auth}>
      {children}
    </AppwriteAuthContext.Provider>
  );
}
