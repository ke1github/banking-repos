"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

interface SidebarTabsProps {
  mode: "banking" | "investment";
  collapsed: boolean;
  isHydrated: boolean;
  onTabChange: (value: string) => void;
}

const SidebarTabs: React.FC<SidebarTabsProps> = ({
  mode,
  collapsed,
  isHydrated,
  onTabChange,
}) => {
  return (
    <div className={cn("pt-4", collapsed ? "px-1" : "px-4")}>
      {isHydrated ? (
        <Tabs
          value={mode}
          className="w-full"
          onValueChange={onTabChange}
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
              {collapsed ? <Icon name="bank" className="h-5 w-5" /> : "Banking"}
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
            {collapsed ? (
              <Icon name="trending-up" className="h-5 w-5" />
            ) : (
              "Investment"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarTabs;
