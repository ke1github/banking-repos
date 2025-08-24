"use client";

import React, { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export interface BaseUserProps {
  firstName: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export interface BaseSidebarProps {
  user: BaseUserProps;
  title: string;
  tabs?: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  children: ReactNode;
  bottomActions?: ReactNode;
}

const BaseSidebar = ({
  user,
  title,
  tabs,
  activeTab,
  onTabChange,
  children,
  bottomActions,
}: BaseSidebarProps) => {
  return (
    <aside className="w-80 bg-white border-l border-gray-200 h-screen fixed right-0 top-0 overflow-y-auto hidden lg:block">
      {/* Profile Section */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="Profile"
              width={48}
              height={48}
              className="rounded-full border-2 border-white"
            />
          ) : (
            <div className="w-12 h-12 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-white text-18 font-semibold">
              {user.firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-16 font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-12 text-blue-600">{title}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation - Only render if tabs are provided */}
      {tabs && tabs.length > 0 && (
        <div className="p-4 border-b">
          <div className="flex gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => onTabChange && onTabChange(tab.id)}
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-4 space-y-4">{children}</div>

      {/* Bottom Actions - Only render if provided */}
      {bottomActions && (
        <div className="p-4 border-t bg-gray-50 mt-auto">{bottomActions}</div>
      )}
    </aside>
  );
};

export default BaseSidebar;
