"use client";

import React, { useState, useEffect } from "react";

import { ROUTES } from "@/constants/route";
import Sidebar from "@/components/sidebar/Sidebar";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import MobileSidebarToggle from "@/components/MobileSidebarToggle";
import { useRouter } from "next/navigation";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useInitializeStores } from "@/lib/stores";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuthStore();
  const { initialize } = useInitializeStores();
  const redirectingRef = React.useRef(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Initialize stores on component mount
  React.useEffect(() => {
    initialize();
  }, [initialize]);

  // Check for mobile screen size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);

      // Auto-collapse sidebar on smaller desktop screens
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Redirect if unauthenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace(ROUTES.SIGN_IN);
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push(ROUTES.SIGN_IN);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user, we should have already redirected; show a safe fallback
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Construct user object for sidebar/navbar
  const userDisplayData = {
    firstName: user.firstName || user.name?.split(" ")[0] || "",
    lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
    email: user.email || "",
  };

  return (
    <GlobalErrorBoundary>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Desktop Sidebar - hidden on mobile */}
        <Sidebar
          user={userDisplayData}
          initialCollapsed={sidebarCollapsed}
          onCollapseChange={setSidebarCollapsed}
        />

        {/* Mobile navigation - visible only on mobile */}
        {isMobile && (
          <MobileNavbar user={userDisplayData} onLogout={handleLogout} />
        )}

        {/* Mobile sidebar toggle button */}
        {isMobile && (
          <MobileSidebarToggle
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        )}

        {/* Main content area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isMobile ? "mt-16" : sidebarCollapsed ? "ml-[80px]" : "ml-[256px]"
          }`}
        >
          {children}
          <Footer />
        </main>
      </div>
    </GlobalErrorBoundary>
  );
}
