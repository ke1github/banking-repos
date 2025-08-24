"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

// Define variants using class-variance-authority
const buttonLinkVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gradient:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700",
        banking:
          "bg-blue-700 text-white hover:bg-blue-900 dark:bg-blue-800 dark:hover:bg-blue-700",
        investment:
          "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
        wide: "h-10 py-2 px-6",
        narrow: "h-9 py-1 px-3",
      },
      shape: {
        default: "rounded-md",
        rounded: "rounded-full",
        square: "rounded-none",
        pill: "rounded-full px-6",
      },
      hasIcon: {
        true: "gap-2",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      section: {
        banking: "bg-blue-700 hover:bg-blue-900 text-white",
        investment: "bg-blue-600 hover:bg-blue-700 text-white",
        dashboard: "bg-violet-600 hover:bg-violet-700 text-white",
        default: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      hasIcon: false,
      fullWidth: false,
      section: "default",
    },
  }
);

export interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonLinkVariants> {
  href: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  showArrow?: boolean;
  external?: boolean;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      className,
      children,
      href,
      variant,
      size,
      shape,
      hasIcon,
      fullWidth,
      section,
      icon,
      iconPosition = "left",
      showArrow = false,
      external = false,
      ...props
    },
    ref
  ) => {
    // Combine all the classes using the cn utility
    const buttonClassName = cn(
      buttonLinkVariants({
        variant,
        size,
        shape,
        hasIcon: !!icon || showArrow,
        fullWidth,
        section,
        className,
      })
    );

    // External link properties
    const externalProps = external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};

    return (
      <Link
        href={href}
        className={buttonClassName}
        ref={ref}
        {...externalProps}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
        {showArrow && <ChevronRight className="h-4 w-4" />}
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";

export { ButtonLink, buttonLinkVariants };
