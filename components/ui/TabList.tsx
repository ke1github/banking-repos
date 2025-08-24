"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export interface TabItem {
  value: string;
  label: string;
  content?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabListProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "pills" | "underline" | "boxed";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  contentClassName?: string;
  showContent?: boolean;
  renderTabContent?: (item: TabItem) => React.ReactNode;
  pageStyle?: "default" | "calculators" | "screener" | "compact";
}

const TabList: React.FC<TabListProps> = ({
  items,
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  variant = "default",
  size = "md",
  fullWidth = false,
  className = "",
  tabsListClassName = "",
  tabsTriggerClassName = "",
  tabsContentClassName = "",
  contentClassName = "",
  showContent = true,
  renderTabContent,
  pageStyle = "default",
}) => {
  // Get the initial value - either the provided value, defaultValue, or the first tab's value
  const initialValue =
    value || defaultValue || (items.length > 0 ? items[0].value : "");

  // Apply page-specific styles
  const getPageSpecificStyles = () => {
    // Default is empty strings - use the props as is
    let pageClasses = {
      container: "",
      tabsList: "",
      tabsTrigger: "",
      content: "",
    };

    switch (pageStyle) {
      case "calculators":
        pageClasses = {
          container: "w-full",
          tabsList: "flex-wrap gap-2 pb-2",
          tabsTrigger: "px-3 py-2 text-sm",
          content: "mt-6 w-full",
        };
        size = "sm"; // Override size for calculators
        fullWidth = false; // Override fullWidth for calculators
        break;

      case "screener":
        pageClasses = {
          container: "w-full",
          tabsList: "border-b border-gray-200 flex-wrap gap-1",
          tabsTrigger: "font-medium",
          content: "mt-4 w-full",
        };
        fullWidth = true; // Override fullWidth for screener
        break;

      case "compact":
        pageClasses = {
          container: "w-full",
          tabsList: "gap-1 flex-wrap",
          tabsTrigger: "text-xs px-2 py-1",
          content: "mt-3 w-full",
        };
        size = "sm"; // Override size for compact
        break;

      default:
        // Add default gap for wrapping
        pageClasses = {
          container: "w-full",
          tabsList: "gap-1 py-1",
          tabsTrigger: "",
          content: "mt-4 w-full",
        };
        break;
    }

    return pageClasses;
  };

  const pageClasses = getPageSpecificStyles();

  // Determine classes based on variants
  const getTabsListClasses = () => {
    const baseClasses = "flex flex-wrap";

    const orientationClasses =
      orientation === "vertical" ? "flex-col" : "flex-row";

    const variantClasses = {
      default: "bg-gray-100 p-1 rounded-lg",
      pills: "gap-2",
      underline: "border-b border-gray-200",
      boxed: "border-b border-gray-200",
    };

    const sizeClasses = {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    };

    const widthClasses = fullWidth ? "w-full" : "";

    return `${baseClasses} ${orientationClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${pageClasses.tabsList} ${tabsListClassName}`;
  };

  const getTabsTriggerClasses = (disabled?: boolean) => {
    const baseClasses = "transition-all flex flex-col md:flex-row items-center";

    const variantClasses = {
      default:
        "data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md px-3 py-1.5",
      pills:
        "data-[state=active]:bg-primary data-[state=active]:text-white rounded-full px-4 py-1.5",
      underline:
        "border-b-2 border-transparent data-[state=active]:border-primary pb-2 px-4",
      boxed:
        "border-b-2 border-transparent data-[state=active]:border-primary pb-2 px-4 data-[state=active]:bg-white",
    };

    const sizeClasses = {
      sm: "text-sm py-1.5 px-2",
      md: "text-base py-2 px-3",
      lg: "text-lg py-2.5 px-4",
    };

    const disabledClasses = disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer";
    const flexClasses = fullWidth ? "flex-1 justify-center" : "";

    return `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${flexClasses} ${pageClasses.tabsTrigger} ${tabsTriggerClassName}`;
  };

  return (
    <Tabs
      defaultValue={initialValue}
      value={value}
      onValueChange={onValueChange}
      className={`${orientation === "vertical" ? "flex" : "block"} ${
        pageClasses.container
      } ${className}`}
    >
      <TabsList className={getTabsListClasses()}>
        {items.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className={getTabsTriggerClasses(item.disabled)}
          >
            {item.icon && (
              <span className="mb-1 md:mb-0 md:mr-1">{item.icon}</span>
            )}
            <span className="text-center">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {showContent && (
        <div className={`${pageClasses.content} ${contentClassName}`}>
          {items.map((item) => (
            <TabsContent
              key={item.value}
              value={item.value}
              className={tabsContentClassName}
            >
              {renderTabContent ? renderTabContent(item) : item.content}
            </TabsContent>
          ))}
        </div>
      )}
    </Tabs>
  );
};

export default TabList;
