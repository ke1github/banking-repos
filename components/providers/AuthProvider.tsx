"use client";

import React, { useState, useEffect } from "react";
import LoadingFallback from "@/components/LoadingFallback";
import { AuthContext, useProvideAuth } from "@/lib/hooks/useAuth-rewritten";
import { installErrorInterceptor } from "@/lib/handlers/error-interceptor";
import { useInitializeStores } from "@/lib/stores";

// Enhanced AuthProvider implementation using our consolidated hook
function AuthProvider({ children }: { children: React.ReactNode }) {
  console.log("AuthProvider: Initializing...");
  const auth = useProvideAuth();
  const { initialize } = useInitializeStores();
  console.log("AuthProvider: Got auth and initialize", {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
  });

  // Initialize all stores on component mount
  useEffect(() => {
    console.log("AuthProvider: Running initialize effect");
    initialize();
    console.log("AuthProvider: Initialize completed");
  }, [initialize]);

  // Install error interceptor for guest scope errors when component mounts
  useEffect(() => {
    // Only run in development to keep production logs clean for monitoring
    if (process.env.NODE_ENV !== "production") {
      installErrorInterceptor();
    }
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export default function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Directly render the AuthProvider without any hydration checks
  return <AuthProvider>{children}</AuthProvider>;
}
