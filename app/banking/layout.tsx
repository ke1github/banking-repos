"use client";

import React from "react";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";

export default function BankingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setMode } = useSidebarMode();

  // Set the sidebar mode to 'banking' when banking pages load
  React.useEffect(() => {
    setMode("banking");
  }, [setMode]);

  return <>{children}</>;
}
