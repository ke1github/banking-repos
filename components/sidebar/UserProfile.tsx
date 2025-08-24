"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/route";
import Icon from "@/components/ui/Icon";
import UserAvatar from "@/components/ui/UserAvatar";
import LogoutButton from "@/components/LogoutButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UserProfileProps {
  user?: {
    firstName: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
  collapsed: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, collapsed }) => {
  if (!user) return null;

  return (
    <div className={cn("mt-auto border-t py-4", collapsed ? "px-1" : "px-4")}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center gap-3 justify-start hover:bg-gray-100 rounded-lg py-2",
              collapsed && "justify-center"
            )}
          >
            <UserAvatar
              src={user.image}
              firstName={user.firstName}
              lastName={user.lastName}
              size="sm"
              fallback={user.firstName?.charAt(0) || "U"}
            />
            {!collapsed && (
              <div className="flex flex-col items-start flex-1 min-w-0 text-left">
                <span className="font-medium truncate">
                  {user.firstName} {user.lastName}
                </span>
                {user.email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                )}
              </div>
            )}
            {!collapsed && (
              <Icon name="chevron-right" className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          <div className="grid gap-1">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={ROUTES.PROFILE}>
                <Icon name="user" className="h-4 w-4" />
                <span className="ml-2">Profile</span>
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href={ROUTES.SETTINGS}>
                <Icon name="settings" className="h-4 w-4" />
                <span className="ml-2">Settings</span>
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserProfile;
