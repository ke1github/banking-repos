"use client";

import React from "react";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";

export default function InvestmentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setMode } = useSidebarMode();

  // Set the sidebar mode to 'investment' when investment pages load
  React.useEffect(() => {
    setMode("investment");
  }, [setMode]);

  return <>{children}</>;
}
