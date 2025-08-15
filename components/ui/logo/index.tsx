"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "small" | "large";
  showText?: boolean;
  className?: string;
  imageClassName?: string;
  textClassName?: string;
}

export const Logo = ({
  variant = "default",
  showText = true,
  className,
  imageClassName,
  textClassName,
}: LogoProps) => {
  // Size mappings based on variant
  const sizeMap = {
    small: {
      width: 24,
      height: 24,
      className: "w-6 h-6",
      textClass: "text-sm",
    },
    default: {
      width: 32,
      height: 32,
      className: "w-8 h-8",
      textClass: "text-lg",
    },
    large: {
      width: 40,
      height: 40,
      className: "w-10 h-10",
      textClass: "text-xl",
    },
  };

  const {
    width,
    height,
    className: variantClass,
    textClass,
  } = sizeMap[variant];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src="/icons/logo.svg"
        alt="SP Banking Logo"
        width={width}
        height={height}
        className={cn(variantClass, imageClassName)}
      />
      {showText && (
        <h2
          className={cn(
            "font-semibold text-gray-900",
            textClass,
            textClassName
          )}
        >
          SP BANKING
        </h2>
      )}
    </div>
  );
};

export default Logo;
