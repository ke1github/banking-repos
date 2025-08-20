"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ROUTES } from "@/constants/route";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth-rewritten";

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
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async () => {
    if (isPending || isLoading) return;

    setIsLoading(true);

    startTransition(async () => {
      try {
        // Use the logout function from our auth hook
        await logout();

        // Clear auth cookie from client side
        document.cookie = "auth=; path=/; max-age=0";

        // Clear local storage items
        try {
          localStorage.removeItem("remember");
          sessionStorage.removeItem("session-started");
        } catch (e) {
          console.error("Error clearing storage:", e);
        }

        toast.info("Logged out successfully");
        router.push(ROUTES.SIGN_IN);
      } catch (error) {
        console.error("Failed to log out:", error);
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
