"use client";

import { AuthContext, useProvideAuth } from "@/lib/hooks/useAuth";
import { useEffect } from "react";
import { installErrorInterceptor } from "@/lib/handlers/error-interceptor";

interface AppwriteProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that wraps the application with authentication context
 * This component is maintained for backward compatibility but uses the consolidated auth hook
 */
export function AppwriteAuthProvider({ children }: AppwriteProviderProps) {
  const auth = useProvideAuth();

  // Install error interceptor for guest scope errors when component mounts
  useEffect(() => {
    // Only run in development to keep production logs clean for monitoring
    if (process.env.NODE_ENV !== "production") {
      installErrorInterceptor();
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
