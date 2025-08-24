"use client";

import React from "react";
import Image from "next/image";

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
      <Image
        src="/icons/logo.svg"
        alt="SP Banking Logo"
        width={size}
        height={size}
        className="h-auto"
      />
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
