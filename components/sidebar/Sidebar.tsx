"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { sidebarLinks } from "@/constants";
import { ROUTES } from "@/constants/route";
import { cn } from "@/lib/utils";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import { useHydration } from "@/lib/hooks/useHydration";
import { useTheme } from "next-themes";

// Import custom scrollbar styles
import "./scrollbar.css";

// Import subcomponents
import SidebarHeader from "./SidebarHeader";
import SidebarTabs from "./SidebarTabs";
import SidebarSection from "./SidebarSection";
import UserProfile from "./UserProfile";

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
    dashboard: true,
    analytics: true,
    fundamental: true,
    profile: false,
  });

  // Auto-collapse sidebar on medium screens (md)
  useEffect(() => {
    const checkScreenSize = () => {
      const isMediumScreen = window.matchMedia(
        "(min-width: 768px) and (max-width: 1023px)"
      ).matches;
      if (isMediumScreen && !collapsed) {
        setCollapsed(true);
        if (onCollapseChange) onCollapseChange(true);
      }
    };

    // Check on mount and window resize
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
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
        collapsed ? "w-[80px]" : "w-[300px]"
      )}
      initial={false}
      animate={{ width: collapsed ? 80 : 300 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col h-full relative">
        {/* Header component with logo and collapse button */}
        <SidebarHeader collapsed={collapsed} toggleCollapse={toggleCollapse} />

        {/* Tabs for Banking and Investment */}
        <SidebarTabs
          mode={mode}
          collapsed={collapsed}
          isHydrated={isHydrated}
          onTabChange={handleTabChange}
        />

        {/* Scrollable nav content with custom scrollbar */}
        <div
          className={cn(
            "flex-1 overflow-y-auto py-4 sidebar-scrollbar",
            collapsed ? "px-1" : "px-4"
          )}
        >
          {mode === "banking" ? (
            // Banking links
            <>
              {/* Main navigation section */}
              <SidebarSection
                title="Main"
                sectionKey="main"
                links={sidebarLinks.mainLinks}
                isExpanded={expandedSections.main}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Accounts section */}
              <SidebarSection
                title="Accounts & Cards"
                sectionKey="accountsCards"
                links={sidebarLinks.accountsLinks}
                isExpanded={expandedSections.accountsCards}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Payments section */}
              <SidebarSection
                title="Payments"
                sectionKey="payments"
                links={sidebarLinks.paymentLinks}
                isExpanded={expandedSections.payments}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Expense Management section */}
              <SidebarSection
                title="Expense Management"
                sectionKey="expenseManagement"
                links={sidebarLinks.expenseLinks}
                isExpanded={expandedSections.expenseManagement}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Cash Management section */}
              <SidebarSection
                title="Cash Management"
                sectionKey="cashManagement"
                links={sidebarLinks.cashLinks}
                isExpanded={expandedSections.cashManagement}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />
            </>
          ) : (
            // Investment links
            <>
              {/* Dashboard section */}
              <SidebarSection
                title="Dashboard"
                sectionKey="dashboard"
                links={sidebarLinks.dashboardLinks}
                isExpanded={expandedSections.dashboard}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Investments section */}
              <SidebarSection
                title="Investments"
                sectionKey="investments"
                links={sidebarLinks.investmentLinks}
                isExpanded={expandedSections.investments}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Analytics section */}
              <SidebarSection
                title="Analytics"
                sectionKey="analytics"
                links={sidebarLinks.analyticsLinks}
                isExpanded={expandedSections.analytics}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Fundamental Analysis section */}
              <SidebarSection
                title="Analysis"
                sectionKey="fundamental"
                links={sidebarLinks.fundamentalLinks}
                isExpanded={expandedSections.fundamental}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />

              {/* Investment Tools section */}
              <SidebarSection
                title="Tools"
                sectionKey="investmentTools"
                links={sidebarLinks.investmentToolsLinks}
                isExpanded={expandedSections.investmentTools}
                isCollapsed={collapsed}
                onToggle={toggleSection}
              />
            </>
          )}
        </div>

        {/* User profile section */}
        <UserProfile user={user} collapsed={collapsed} />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
