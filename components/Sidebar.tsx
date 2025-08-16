"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./NavLink";
import Logo from "@/components/ui/logo";
import UserAvatar from "@/components/ui/UserAvatar";
import { sidebarLinks } from "@/constants";

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
    <aside className="sidebar bg-white h-screen w-[256px] fixed left-0 top-0 border-r border-gray-100 shadow-sm hidden lg:flex flex-col">
      <div className="flex flex-col h-full overflow-y-auto">
        <div className="mb-6 flex items-center justify-start px-6 pt-6">
          <Link href="/">
            <Logo variant="default" />
          </Link>
        </div>

        <div className="flex-1 px-4">
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
        </div>

        {/* User and profile section */}
        <div className="mt-auto border-t border-gray-100 pt-4 pb-6 px-4">
          {user && (
            <div className="mb-4 flex items-center px-2">
              <UserAvatar
                src={user.image}
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
                className="mr-2"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <Link
                  href="/profile"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {sidebarLinks.profileLinks.map((link) => (
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
    </aside>
  );
};

export default Sidebar;
