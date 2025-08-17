"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { signOut } from "@/lib/actions/user.actions";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user: clientUser, isLoading: isClientLoading } = useAppwrite();
  const router = useRouter();

  // Redirect if unauthenticated (client-side check avoids guest-scope errors)
  React.useEffect(() => {
    if (!isClientLoading && !clientUser) {
      router.push("/sign-in");
    }
  }, [isClientLoading, clientUser, router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state while checking auth
  if (isClientLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user, we should have already redirected
  if (!clientUser) {
    return null;
  }

  // Construct user object for sidebar/navbar
  const userDisplayData = {
    firstName: clientUser.name?.split(" ")[0] ?? "",
    lastName: clientUser.name?.split(" ").slice(1).join(" ") ?? "",
    email: clientUser?.email ?? "",
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar user={userDisplayData} onLogout={handleLogout} />

      {/* Mobile navigation - visible only on mobile */}
      <div className="lg:hidden">
        <MobileNavbar user={userDisplayData} onLogout={handleLogout} />
      </div>

      {/* Main content area */}
      <main className="flex-1 mt-16 lg:mt-0">
        {children}
        <Footer />
      </main>
    </div>
  );
}
