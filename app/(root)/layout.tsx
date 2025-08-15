"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If user data is loaded and there's no authenticated user, redirect to sign in
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/sign-in");
    }
  }, [user, isLoading, router]);
  // Show loading state or null if not authenticated
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Convert user to the format expected by sidebar/navbar
  const userDisplayData = {
    firstName: user.name.split(" ")[0],
    lastName: user.name.split(" ").slice(1).join(" "),
    email: user.email,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <Sidebar user={userDisplayData} />

      {/* Mobile navigation - visible only on mobile */}
      <div className="lg:hidden">
        <MobileNavbar user={userDisplayData} />
      </div>

      {/* Main content area */}
      <main className="flex-1 mt-16 lg:mt-0">
        {children}
        <Footer />
      </main>
    </div>
  );
}
