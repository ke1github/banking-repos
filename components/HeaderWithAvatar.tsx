"use client";

import React, { useState } from "react";
import Link from "next/link";
import UserAvatar from "@/components/ui/UserAvatar";
import { FiSettings, FiBell, FiLogOut } from "react-icons/fi";
import { ROUTES } from "@/constants/route";

const HeaderWithAvatar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Example user data
  const user = {
    firstName: "John",
    lastName: "Doe",
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://i.pravatar.cc/300?img=8", // Example avatar URL
  };

  return (
    <header className="bg-white shadow-sm py-3 px-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href={ROUTES.HOME} className="text-blue-600 text-xl font-bold">
            SP Banking
          </Link>

          <nav className="hidden md:ml-8 md:flex md:space-x-4">
            <Link
              href={ROUTES.HOME}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Dashboard
            </Link>
            <Link
              href={ROUTES.ACCOUNTS}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Accounts
            </Link>
            <Link
              href={ROUTES.TRANSACTIONS}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-blue-600"
            >
              Transactions
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-gray-100 focus:outline-none">
            <FiBell size={20} />
          </button>

          {/* User dropdown */}
          <div className="relative">
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={toggleDropdown}
            >
              <UserAvatar
                src={user.avatarUrl}
                firstName={user.firstName}
                lastName={user.lastName}
                size="sm"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user.name}
              </span>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UserAvatar
                    src={user.avatarUrl}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    size="xs"
                    className="mr-2"
                  />
                  Your Profile
                </Link>
                <Link
                  href={ROUTES.SETTINGS}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FiSettings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
                <button className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  <FiLogOut className="w-4 h-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderWithAvatar;
