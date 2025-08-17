"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { signOut, getCurrentUser } from "@/lib/actions/user.actions";
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
  const [serverUser, setServerUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get user from server to ensure authentication is valid
        const { user: userData, error } = await getCurrentUser();

        if (error || !userData) {
          router.push("/sign-in");
          return;
        }

        setServerUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Show loading state while checking auth
  if (loading || isClientLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no user, we should have already redirected
  if (!serverUser) {
    return null;
  }

  // Construct user object for sidebar/navbar
  const userDisplayData = {
    firstName: serverUser.firstName,
    lastName: serverUser.lastName,
    email: serverUser.email,
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
