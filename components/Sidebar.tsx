"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import NavLink from "./NavLink";
import Logo from "@/components/ui/logo";
import Icon from "@/components/ui/Icon";
import UserAvatar from "@/components/ui/UserAvatar";
import { sidebarLinks } from "@/constants";
import { ROUTES } from "@/constants/route";
import LogoutButton from "@/components/LogoutButton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import { useHydration } from "@/lib/hooks/useHydration";
import { useTheme } from "next-themes";

interface SidebarProps {
  user?: {
    firstName: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
  initialCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
}

const Sidebar = ({
  user,
  initialCollapsed = false,
  onCollapseChange,
}: SidebarProps) => {
  const { mode, setMode } = useSidebarMode();
  const router = useRouter();
  const isHydrated = useHydration();
  const { theme } = useTheme();
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    main: true,
    accountsCards: true,
    payments: true,
    expenseManagement: true,
    cashManagement: true,
    tools: true,
    portfolio: true,
    investments: true,
    investmentTools: true,
  });

  const handleTabChange = (value: string) => {
    const newMode = value as "banking" | "investment";
    setMode(newMode);

    // Navigate to the appropriate dashboard
    if (newMode === "investment") {
      router.push(ROUTES.INVESTMENTS);
    } else {
      router.push(ROUTES.BANKING_HOME);
    }
  };

  const toggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Determine background color based on theme
  const getBgColor = () => {
    if (theme === "dark") {
      return "bg-gray-900";
    }
    return "bg-white";
  };

  // Define animation variants for sidebar
  const sidebarVariants = {
    expanded: { width: 256 },
    collapsed: { width: 80 },
  };

  // Define animation variants for section content
  const sectionVariants = {
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.3 },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      {/* Mobile sidebar toggle button for medium screens */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 shadow-lg rounded-full h-12 w-12 md:hidden"
        onClick={toggleCollapse}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <motion.aside
        className={cn(
          "sidebar h-screen fixed left-0 top-0 border-r border-gray-200 shadow-sm hidden md:flex flex-col overflow-hidden transition-all duration-300 z-40",
          getBgColor(),
          { "w-[256px]": !collapsed, "w-[80px]": collapsed }
        )}
        variants={sidebarVariants}
        initial="expanded"
        animate={collapsed ? "collapsed" : "expanded"}
      >
        <div className="flex flex-col h-full relative">
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
            <Link
              href={ROUTES.HOME}
              aria-label="Go to dashboard"
              className="block"
            >
              <Logo
                variant="default"
                showText={!collapsed}
                className="text-gray-900 sidebar-logo-container"
              />
            </Link>
          </div>

          {/* Tabs for Banking and Investment */}
          <div className={cn("pt-4", collapsed ? "px-1" : "px-4")}>
            {isHydrated ? (
              <Tabs
                value={mode}
                className="w-full"
                onValueChange={handleTabChange}
                id="sidebar-tabs"
              >
                <TabsList
                  className={cn(
                    "grid w-full",
                    collapsed ? "grid-cols-1 gap-1" : "grid-cols-2"
                  )}
                >
                  <TabsTrigger
                    value="banking"
                    id="banking-tab"
                    className={collapsed ? "px-2" : ""}
                  >
                    {collapsed ? (
                      <Icon name="bank" className="h-5 w-5" />
                    ) : (
                      "Banking"
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="investment"
                    id="investment-tab"
                    className={collapsed ? "px-2" : ""}
                  >
                    {collapsed ? (
                      <Icon name="trending-up" className="h-5 w-5" />
                    ) : (
                      "Investment"
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="h-9 bg-muted rounded-lg p-1 grid grid-cols-2 gap-1">
                <div className="flex items-center justify-center h-7 rounded-md bg-background shadow px-3 py-1 text-sm font-medium">
                  Banking
                </div>
                <div className="flex items-center justify-center h-7 rounded-md px-3 py-1 text-sm font-medium text-muted-foreground">
                  Investment
                </div>
              </div>
            )}
          </div>

          {/* Scrollable nav content */}
          <div
            className={cn(
              "flex-1 overflow-y-auto py-4",
              collapsed ? "px-1" : "px-4"
            )}
          >
            {mode === "banking" ? (
              // Banking links
              <>
                {/* Main navigation section */}
                <div className="mb-4">
                  {!collapsed && (
                    <div
                      className="px-2 mb-2 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("main")}
                    >
                      <h3 className="text-xs font-semibold uppercase text-gray-500">
                        Main
                      </h3>
                      {expandedSections.main ? (
                        <Icon
                          name="chevron-up"
                          className="h-3.5 w-3.5 text-gray-500"
                        />
                      ) : (
                        <Icon
                          name="chevron-down"
                          className="h-3.5 w-3.5 text-gray-500"
                        />
                      )}
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {(expandedSections.main || collapsed) && (
                      <motion.div
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={!collapsed ? sectionVariants : {}}
                        className="flex flex-col gap-1 overflow-hidden"
                      >
                        {sidebarLinks.mainLinks.map((link) => (
                          <NavLink
                            key={link.label}
                            href={link.route}
                            label={link.label}
                            iconSrc={link.imgURL}
                            collapsed={collapsed}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accounts section */}
                <div className="mb-4">
                  {!collapsed && (
                    <div
                      className="px-2 mb-2 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("accountsCards")}
                    >
                      <h3 className="text-xs font-semibold uppercase text-gray-500">
                        Accounts & Cards
                      </h3>
                      {expandedSections.accountsCards ? (
                        <Icon
                          name="chevron-up"
                          className="h-3.5 w-3.5 text-gray-500"
                        />
                      ) : (
                        <Icon
                          name="chevron-down"
                          className="h-3.5 w-3.5 text-gray-500"
                        />
                      )}
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {(expandedSections.accountsCards || collapsed) && (
                      <motion.div
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={!collapsed ? sectionVariants : {}}
                        className="flex flex-col gap-1 overflow-hidden"
                      >
                        {sidebarLinks.accountsLinks.map((link) => (
                          <NavLink
                            key={link.label}
                            href={link.route}
                            label={link.label}
                            iconSrc={link.imgURL}
                            collapsed={collapsed}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rest of banking sections... */}
              </>
            ) : (
              // Investment links
              <>
                {/* Portfolio section */}
                <div className="mb-4">
                  {!collapsed && (
                    <div
                      className="px-2 mb-2 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("portfolio")}
                    >
                      <h3 className="text-xs font-semibold uppercase text-gray-500">
                        Portfolio
                      </h3>
                      {expandedSections.portfolio ? (
                        <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
                      )}
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {(expandedSections.portfolio || collapsed) && (
                      <motion.div
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={!collapsed ? sectionVariants : {}}
                        className="flex flex-col gap-1 overflow-hidden"
                      >
                        {sidebarLinks.investmentLinks.map((link) => (
                          <NavLink
                            key={link.label}
                            href={link.route}
                            label={link.label}
                            iconSrc={link.imgURL}
                            collapsed={collapsed}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Rest of investment sections... */}
              </>
            )}
          </div>

          {/* User profile section at bottom */}
          <div className={cn("border-t p-4", collapsed ? "px-2" : "px-4")}>
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center w-full rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left",
                      collapsed ? "justify-center" : "justify-between"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3",
                        collapsed ? "justify-center" : ""
                      )}
                    >
                      <UserAvatar
                        src={user?.image}
                        firstName={user?.firstName || ""}
                        lastName={user?.lastName}
                        className="h-8 w-8"
                      />
                      {!collapsed && (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium line-clamp-1">
                            {user.firstName} {user.lastName}
                          </span>
                          {user.email && (
                            <span className="text-xs text-gray-500 line-clamp-1">
                              {user.email}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!collapsed && (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="flex flex-col gap-1">
                    <NavLink
                      href={ROUTES.PROFILE}
                      label="My Profile"
                      iconSrc="/icons/user.svg"
                    />
                    <NavLink
                      href={ROUTES.SETTINGS}
                      label="Settings"
                      iconSrc="/icons/settings.svg"
                    />
                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    <LogoutButton />
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse mt-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
