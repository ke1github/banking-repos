"use client";

import {
  AppwriteAuthContext,
  useProvideAppwrite,
} from "@/lib/hooks/useAppwrite";
import { useEffect } from "react";
import { installErrorInterceptor } from "@/lib/utils/error-interceptor";

interface AppwriteProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application with Appwrite authentication context
 */
export function AppwriteAuthProvider({ children }: AppwriteProviderProps) {
  const auth = useProvideAppwrite();

  // Install error interceptor for guest scope errors when component mounts
  useEffect(() => {
    // Only run in development to keep production logs clean for monitoring
    if (process.env.NODE_ENV !== "production") {
      installErrorInterceptor();
    }
  }, []);

  return (
    <AppwriteAuthContext.Provider value={auth}>
      {children}
    </AppwriteAuthContext.Provider>
  );
}
