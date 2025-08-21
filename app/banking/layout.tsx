"use client";

import React from "react";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function BankingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setMode } = useSidebarMode();
  const { user } = useAuthStore();

  // Set the sidebar mode to 'banking' when banking pages load
  React.useEffect(() => {
    setMode("banking");
  }, [setMode]);

  // Construct user object for sidebar/navbar
  const userDisplayData = user
    ? {
        firstName: user.firstName || user.name?.split(" ")[0] || "User",
        lastName:
          user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
        email: user.email || "",
      }
    : {
        firstName: "Guest",
        lastName: "",
        email: "",
      };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar user={userDisplayData} />

      {/* Mobile navigation - visible only on mobile */}
      <div className="lg:hidden">
        <MobileNavbar
          user={{
            firstName: userDisplayData.firstName,
            lastName: userDisplayData.lastName,
          }}
        />
      </div>

      {/* Main content area */}
      <main className="flex-1 mt-16 lg:mt-0 lg:mr-80">
        <div className="min-h-screen">{children}</div>
        <Footer />
      </main>

      {/* Right sidebar */}
      <RightSidebar user={userDisplayData} />
    </div>
  );
}
