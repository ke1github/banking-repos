"use client";

import React from "react";

import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { ROUTES } from "@/constants/route";
import { signOut } from "@/lib/actions/user.actions";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MobileNavbar from "@/components/MobileNavbar";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user: clientUser, isLoading: isClientLoading } = useAppwrite();

  const redirectingRef = React.useRef(false);

  // Redirect if unauthenticated (client-side check avoids guest-scope errors)
  React.useEffect(() => {
    if (!isClientLoading && !clientUser && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace(ROUTES.SIGN_IN);
    }
  }, [isClientLoading, clientUser, router]);

  const handleLogout = async () => {
    try {
      try {
        await appwriteAccount.deleteSession("current");
      } catch {
        // ignore if no session exists
      }
      await signOut();
      router.push(ROUTES.SIGN_IN);
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

  // If no user, we should have already redirected; show a safe fallback
  if (!clientUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
      <Sidebar user={userDisplayData} />

      {/* Mobile navigation - visible only on mobile */}
      <div className="lg:hidden">
        <MobileNavbar user={userDisplayData} onLogout={handleLogout} />
      </div>

      {/* Main content area */}
      <main className="flex-1 mt-16 lg:mt-0">
        {children}
        <Footer />
      </main>

      {/* Implementation toggle for demos */}
      <div className="hidden lg:block">
        <div className="relative">
          {process.env.NODE_ENV !== "production" && (
            <React.Suspense fallback={null}>
              <div className="z-50">
                {/* Dynamically import the toggle component */}
                {(() => {
                  const ImplementationToggle = React.lazy(
                    () => import("@/components/ImplementationToggle")
                  );
                  return <ImplementationToggle />;
                })()}
              </div>
            </React.Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
