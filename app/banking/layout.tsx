"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import Sidebar from "@/components/sidebar/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useInitializeSidebarStore } from "@/lib/hooks/useInitializeSidebarStore";

export default function BankingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setMode } = useSidebarMode();
  const { user } = useAuthStore();
  const pathname = usePathname();

  // Initialize the sidebar store on the client side
  useInitializeSidebarStore();

  // Check if current page is the dashboard/home page
  const isDashboard = pathname === "/banking";

  // Set the sidebar mode to 'banking' when banking pages load
  React.useEffect(() => {
    // Add a small delay to ensure this happens after initial hydration
    const timer = setTimeout(() => {
      setMode("banking");
    }, 0);

    return () => clearTimeout(timer);
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
      <main className={`flex-1 mt-16 lg:mt-0 ${isDashboard ? "lg:mr-80" : ""}`}>
        <div className="min-h-screen">{children}</div>
        <Footer />
      </main>

      {/* Right sidebar - only shown on dashboard */}
      {isDashboard && <RightSidebar user={userDisplayData} />}
    </div>
  );
}
