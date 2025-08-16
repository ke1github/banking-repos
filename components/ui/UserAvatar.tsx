"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  firstName?: string;
  lastName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  fallbackClassName?: string;
  onClick?: () => void;
}

/**
 * UserAvatar component for displaying user profile images
 *
 * @example
 * // Basic usage with image
 * <UserAvatar src="/path/to/avatar.jpg" alt="John Doe" />
 *
 * // With user name (automatically generates initials)
 * <UserAvatar firstName="John" lastName="Doe" />
 *
 * // With explicit fallback initials
 * <UserAvatar fallback="JD" />
 *
 * // With firstName only (uses first letter as fallback)
 * <UserAvatar firstName="John" />
 *
 * // Different sizes
 * <UserAvatar src="/path/to/avatar.jpg" size="lg" />
 */
const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = "User Avatar",
  fallback,
  firstName,
  lastName,
  size = "md",
  className,
  fallbackClassName,
  onClick,
}) => {
  // Define size classes
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  // Determine the fallback initials
  const getFallbackInitials = (): string => {
    // If explicit fallback is provided, use it
    if (fallback) return fallback;

    // If firstName is provided, use first letter
    if (firstName) {
      // If lastName is also provided, use first letter of each
      if (lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`;
      }
      // Otherwise just use first letter of firstName
      return firstName.charAt(0);
    }

    // Default fallback
    return "U";
  };

  // Check if we need to show fallback
  const [showFallback, setShowFallback] = React.useState(!src);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden bg-gray-100 flex items-center justify-center",
        sizeClasses[size],
        onClick ? "cursor-pointer" : "",
        className
      )}
      onClick={onClick}
    >
      {src && !showFallback ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          onError={() => setShowFallback(true)}
        />
      ) : (
        <div
          className={cn(
            "bg-blue-100 text-blue-700 font-medium w-full h-full flex items-center justify-center",
            fallbackClassName
          )}
        >
          {getFallbackInitials().substring(0, 2)}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
