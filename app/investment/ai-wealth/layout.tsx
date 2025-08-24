"use client";

import { useEffect } from "react";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";

export default function WealthManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure investment mode is selected in sidebar
  const { setMode } = useSidebarMode();

  useEffect(() => {
    setMode("investment");
  }, [setMode]);

  return children;
}
