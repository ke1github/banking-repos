"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signOut } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  variant?: "icon" | "text";
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "text",
  className = "",
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/sign-in");
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
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
      variant="outline"
      onClick={handleLogout}
      className={`flex items-center gap-2 ${className}`}
    >
      <Image src="/icons/logout.svg" alt="Logout" width={20} height={20} />
      Logout
    </Button>
  );
};

export default LogoutButton;
