"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import NavLink from "./NavLink";
import Logo from "@/components/ui/logo";
import Icon from "@/components/ui/Icon";
import { sidebarLinks } from "@/constants";
import { ROUTES } from "@/constants/route";
import LogoutButton from "@/components/LogoutButton";
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

  // Auto-collapse sidebar on medium screens (md)
  useEffect(() => {
    const checkScreenSize = () => {
      const isMediumScreen = window.matchMedia("(min-width: 768px) and (max-width: 1023px)").matches;
      if (isMediumScreen && !collapsed) {
        setCollapsed(true);
        if (onCollapseChange) onCollapseChange(true);
      }
    };
    
    // Check on mount and window resize
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [collapsed, onCollapseChange]);

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

  return (
    <motion.aside
      className={cn(
        "sidebar h-screen fixed left-0 top-0 border-r border-gray-200 shadow-sm hidden md:flex flex-col overflow-hidden transition-all duration-300 z-40",
        getBgColor(),
        collapsed ? "w-[80px]" : "w-[256px]"
      )}
      initial={false}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
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
                {collapsed ? <Icon name="bank" className="h-5 w-5" /> : "Banking"}
              </div>
              <div className="flex items-center justify-center h-7 rounded-md px-3 py-1 text-sm font-medium text-muted-foreground">
                {collapsed ? <Icon name="trending-up" className="h-5 w-5" /> : "Investment"}
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
                    <Icon
                      name={expandedSections.main ? "chevron-up" : "chevron-down"}
                      className="h-3.5 w-3.5 text-gray-500"
                    />
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {(expandedSections.main || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
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
                    <Icon
                      name={expandedSections.accountsCards ? "chevron-up" : "chevron-down"}
                      className="h-3.5 w-3.5 text-gray-500"
                    />
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {(expandedSections.accountsCards || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
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

              {/* Payments section */}
              <div className="mb-4">
                {!collapsed && (
                  <div
                    className="px-2 mb-2 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection("payments")}
                  >
                    <h3 className="text-xs font-semibold uppercase text-gray-500">
                      Payments
                    </h3>
                    <Icon
                      name={expandedSections.payments ? "chevron-up" : "chevron-down"}
                      className="h-3.5 w-3.5 text-gray-500"
                    />
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {(expandedSections.payments || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-1 overflow-hidden"
                    >
                      {sidebarLinks.paymentLinks.map((link) => (
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
            </>
          ) : (
            // Investment links
            <>
              <div className="mb-4">
                {!collapsed && (
                  <div
                    className="px-2 mb-2 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection("investments")}
                  >
                    <h3 className="text-xs font-semibold uppercase text-gray-500">
                      Investments
                    </h3>
                    <Icon
                      name={expandedSections.investments ? "chevron-up" : "chevron-down"}
                      className="h-3.5 w-3.5 text-gray-500"
                    />
                  </div>
                )}
                <AnimatePresence initial={false}>
                  {(expandedSections.investments || collapsed) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
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
            </>
          )}
        </div>

        {/* Logout button in footer */}
        <div className={cn("border-t p-4", collapsed ? "px-2" : "px-4")}>
          <LogoutButton
            variant={collapsed ? "icon" : "text"}
            className={cn(
              "w-full justify-center",
              collapsed ? "px-2" : "px-3"
            )}
          />
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
