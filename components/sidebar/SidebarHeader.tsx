"use client";

import React from "react";
import Link from "next/link";
import { ROUTES } from "@/constants/route";
import Logo from "@/components/ui/logo";
import Icon from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed,
  toggleCollapse,
}) => {
  return (
    <>
      {/* Collapse toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-4 z-50"
        onClick={toggleCollapse}
      >
        <Icon
          name={collapsed ? "chevron-right" : "chevron-left"}
          className="h-4 w-4"
        />
      </Button>

      {/* Sticky header with logo */}
      <div
        className={cn(
          "sticky top-0 z-10 bg-inherit px-6 pt-6 pb-4 border-b flex items-center",
          collapsed ? "justify-center px-2" : "px-6"
        )}
      >
        <Link href={ROUTES.HOME} aria-label="Go to dashboard" className="block">
          <Logo
            variant="default"
            showText={!collapsed}
            className="text-gray-900 sidebar-logo-container"
          />
        </Link>
      </div>
    </>
  );
};

export default SidebarHeader;
