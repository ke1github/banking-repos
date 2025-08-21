"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import { ROUTES } from "@/constants/route";

export default function RootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mode } = useSidebarMode();

  useEffect(() => {
    // Check if there's a specific redirect after auth
    const callbackUrl = searchParams.get("callbackUrl");

    if (callbackUrl) {
      // If there's a callback URL, use it
      router.push(callbackUrl);
      return;
    }

    // Otherwise redirect based on the current sidebar mode
    if (mode === "investment") {
      router.push(ROUTES.INVESTMENTS);
    } else {
      // Default to banking
      router.push(ROUTES.BANKING_HOME);
    }
  }, [mode, router, searchParams]);

  // Return a loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
