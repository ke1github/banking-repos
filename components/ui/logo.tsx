"use client";

import React from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

interface LogoProps {
  variant?: "default" | "large" | "small";
  className?: string;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  variant = "default",
  className = "",
  showText = true,
}) => {
  const size = variant === "large" ? 48 : variant === "small" ? 24 : 32;

  return (
    <div className={`flex items-center ${className}`}>
      <ErrorBoundary
        fallback={
          <div className="bg-blue-600 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center">
            SP
          </div>
        }
      >
        <Image
          src="/icons/logo.svg"
          alt="SP Banking Logo"
          width={size}
          height={size}
          className="h-auto"
        />
      </ErrorBoundary>

      {showText && (
        <span
          className={`ml-2 font-semibold lg:inline-block ${
            variant === "large"
              ? "text-xl"
              : variant === "small"
              ? "text-sm"
              : "text-base"
          }`}
          style={{ display: "inline-block" }}
        >
          SP Banking
        </span>
      )}
    </div>
  );
};

export default Logo;
