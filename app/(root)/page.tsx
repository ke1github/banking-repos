"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import { ROUTES } from "@/constants/route";

export default function RootPage() {
  const router = useRouter();
  const { mode } = useSidebarMode();

  useEffect(() => {
    // Redirect based on the current sidebar mode
    if (mode === "investment") {
      router.replace(ROUTES.INVESTMENTS);
    } else {
      // Default to banking
      router.replace(ROUTES.BANKING_HOME);
    }
  }, [mode, router]);

  // Return a loading state while redirecting
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
