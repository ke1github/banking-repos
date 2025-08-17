"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "@/lib/actions/user.actions";
import { account as appwriteAccount } from "@/lib/appwrite/config";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/route";

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

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "text",
  className = "",
  buttonVariant = "outline",
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear client session cookie first to avoid guest scope errors
    try {
      await appwriteAccount.deleteSession("current");
    } catch {
      // ignore if no session
    }
    try {
      localStorage.removeItem("remember");
      sessionStorage.removeItem("session-started");
    } catch {}
    await signOut();
    router.push(ROUTES.SIGN_IN);
  };

  if (variant === "icon") {
    return (
      <Button
        variant={buttonVariant}
        size="icon"
        onClick={handleLogout}
        className={`p-2 hover:bg-gray-100 ${className}`}
        aria-label="Logout"
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
    >
      <Image src="/icons/logout.svg" alt="Logout" width={20} height={20} />
      Logout
    </Button>
  );
};

export default LogoutButton;
