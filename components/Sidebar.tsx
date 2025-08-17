"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./NavLink";
import Logo from "@/components/ui/logo";
import UserAvatar from "@/components/ui/UserAvatar";
import { sidebarLinks } from "@/constants";
import { ROUTES } from "@/constants/route";
import LogoutButton from "@/components/LogoutButton";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

interface SidebarProps {
  user?: {
    firstName: string;
    lastName?: string;
    email?: string;
    image?: string;
  };
}

const Sidebar = ({ user }: SidebarProps) => {
  return (
    <aside className="sidebar h-screen w-[256px] fixed left-0 top-0 border-r border-gray-200 shadow-sm hidden lg:flex flex-col overflow-hidden bg-white">
      <div className="flex flex-col h-full">
        {/* Sticky header with logo */}
        <div className="sticky top-0 z-10 bg-white px-6 pt-6 pb-4 border-b">
          <Link href={ROUTES.HOME} aria-label="Go to dashboard">
            <Logo variant="default" />
          </Link>
        </div>

        {/* Scrollable nav content */}
        <div className="flex-1 px-4 overflow-y-auto py-4">
          {/* Main navigation section */}
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-gray-500">
              Main
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.mainLinks.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.route}
                  label={link.label}
                  iconSrc={link.imgURL}
                />
              ))}
            </div>
          </div>

          {/* Accounts section */}
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-gray-500">
              Accounts & Cards
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.accountsLinks.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.route}
                  label={link.label}
                  iconSrc={link.imgURL}
                />
              ))}
            </div>
          </div>

          {/* Payments section */}
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-gray-500">
              Payments
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.paymentLinks.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.route}
                  label={link.label}
                  iconSrc={link.imgURL}
                />
              ))}
            </div>
          </div>

          {/* Expense Management section */}
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-gray-500">
              Expense Management
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.expenseLinks.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.route}
                  label={link.label}
                  iconSrc={link.imgURL}
                />
              ))}
            </div>
          </div>

          {/* Cash Management section */}
          <div className="mb-6">
            <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-gray-500">
              Cash Management
            </h3>
            <div className="flex flex-col gap-1">
              {sidebarLinks.cashLinks.map((link) => (
                <NavLink
                  key={link.label}
                  href={link.route}
                  label={link.label}
                  iconSrc={link.imgURL}
                />
              ))}
            </div>
          </div>
        </div>

        {/* User and profile section */}
        <div className="mt-auto border-t border-gray-100 py-3 px-4">
          {user && (
            <div className="px-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                    aria-haspopup="menu"
                  >
                    <UserAvatar
                      src={user.image}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="sm"
                    />
                    <div className="min-w-0 text-left">
                      <div className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <svg
                      className="ml-auto h-4 w-4 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
                  side="top"
                  sideOffset={8}
                  className="p-2 w-[calc(100%-16px)]"
                  role="menu"
                  aria-label="User menu"
                >
                  {/* User header inside popover */}
                  <div className="px-3 py-2.5 flex items-center gap-3">
                    <UserAvatar
                      src={user.image}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="sm"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {user.firstName} {user.lastName}
                      </div>
                      {user.email && (
                        <div className="text-xs text-gray-500 truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="my-1 h-px bg-gray-100" />

                  {/* Actions */}
                  <Link
                    href={ROUTES.PROFILE}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                    role="menuitem"
                  >
                    <Image
                      src="/icons/edit.svg"
                      alt="Profile"
                      width={16}
                      height={16}
                    />
                    Profile
                  </Link>
                  <div className="my-1 h-px bg-gray-100" />
                  <LogoutButton
                    className="w-full justify-start text-red-600 hover:text-red-700 px-3 py-2 rounded-md hover:bg-gray-50"
                    buttonVariant="ghost"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
