"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { logoutAction } from "@/lib/actions/auth.actions";
import { safeAccount } from "@/lib/appwrite/config";
import { ROUTES } from "@/constants/route";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppwrite } from "@/lib/hooks/useAppwrite";
import { logAuthError } from "@/lib/utils/logger";

interface LogoutButtonProps {
  variant?: "icon" | "text";
  className?: string;
  buttonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

const LogoutButton = ({
  variant = "text",
  className = "",
  buttonVariant = "outline",
}: LogoutButtonProps) => {
  const router = useRouter();
  const { logout: clientLogout } = useAppwrite();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isPending || isLoading) return;

    setIsLoading(true);

    startTransition(async () => {
      try {
        // Call server action to delete server-side auth first
        // This ensures the server session is properly deleted
        await logoutAction();

        // Clear client session after server action completes
        try {
          await safeAccount.deleteSession("current");
        } catch (e) {
          logAuthError(e, "client_logout_button");
          // ignore if no session - server already handled it
        }

        // Clear local storage items
        try {
          localStorage.removeItem("remember");
          sessionStorage.removeItem("session-started");
        } catch (e) {
          logAuthError(e, "client_logout_storage_clear");
        }

        // Sync client-side auth state
        await clientLogout();

        toast.info("Logged out successfully");
        router.push(ROUTES.SIGN_IN);
      } catch (error) {
        logAuthError(error, "client_logout", {
          source: "logout_button",
          attempt: "full_logout_flow",
        });
        toast.error("Failed to log out. Please try again.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  if (variant === "icon") {
    return (
      <Button
        variant={buttonVariant}
        size="icon"
        onClick={handleLogout}
        className={`p-2 hover:bg-gray-100 ${className}`}
        aria-label="Logout"
        disabled={isPending || isLoading}
      >
        <Image src="/icons/logout.svg" alt="Logout" width={24} height={24} />
      </Button>
    );
  }

  return (
    <Button
      variant={buttonVariant}
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
      disabled={isPending || isLoading}
    >
      <Image src="/icons/logout.svg" alt="Logout" width={20} height={20} />
      {isPending || isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
};

export default LogoutButton;
