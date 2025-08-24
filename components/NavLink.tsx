"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { RoutePath } from "@/constants/route";
import Icon from "@/components/ui/Icon";

interface NavLinkProps {
  href: RoutePath;
  label: string;
  iconSrc: string;
  isActive?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

const NavLink = ({
  href,
  label,
  iconSrc,
  isActive,
  onClick,
  collapsed = false,
}: NavLinkProps) => {
  const pathname = usePathname();
  const isCurrentPath =
    pathname === href || pathname.startsWith(href + "/") || isActive;

  const linkContent = (
    <Link
      href={href}
      aria-current={isCurrentPath ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        collapsed ? "justify-center px-2 py-2" : "px-3 py-2.5",
        isCurrentPath
          ? "bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/30 dark:text-blue-300"
          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
      )}
      onClick={onClick}
    >
      {isCurrentPath && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-0.5 bg-blue-600 rounded-full dark:bg-blue-400" />
      )}
      <div
        className={cn(
          "flex-shrink-0 w-5 h-5 flex items-center justify-center",
          isCurrentPath
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-600 dark:text-gray-400"
        )}
      >
        {/* Try to render the icon using our Icon component */}
        <Icon
          name={iconSrc.replace("/icons/", "").replace(".svg", "")}
          className="h-5 w-5"
        />
      </div>

      {!collapsed && <span className="text-sm truncate">{label}</span>}

      {isCurrentPath && !collapsed && (
        <div className="ml-auto w-1.5 h-5 bg-blue-600/70 rounded-full dark:bg-blue-400/70" />
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-800 text-white border-0"
          >
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return linkContent;
};

export default NavLink;
