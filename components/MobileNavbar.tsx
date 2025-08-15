"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";

interface MobileNavbarProps {
  user: {
    firstName: string;
  };
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { href: "/", label: "Dashboard", icon: "/icons/home.svg" },
    {
      href: "/transactions",
      label: "Transactions",
      icon: "/icons/transaction.svg",
    },
    {
      href: "/transfers",
      label: "Transfers",
      icon: "/icons/payment-transfer.svg",
    },
    { href: "/cards", label: "Cards", icon: "/icons/credit-card.svg" },
    { href: "/settings", label: "Settings", icon: "/icons/edit.svg" },
  ];

  return (
    <div className="mobile-navbar">
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200 md:hidden">
        <div className="flex items-center gap-3">
          <Image
            src="/icons/logo.svg"
            alt="SP Banking"
            width={32}
            height={32}
          />
          <h1 className="text-18 font-semibold text-gray-900">SP Banking</h1>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-1">
              <Image
                src="/icons/hamburger.svg"
                alt="Menu"
                width={24}
                height={24}
              />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>

            <div className="mobilenav-sheet">
              <div className="flex flex-col">
                <div className="p-4 bg-bank-gradient text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-18 font-semibold">
                        {user.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-16 font-semibold">
                        Welcome, {user.firstName}
                      </p>
                      <p className="text-12 opacity-80">Manage your finances</p>
                    </div>
                  </div>
                </div>

                <div className="p-2 flex flex-col gap-1">
                  {navigationLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-25"
                      >
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={20}
                          height={20}
                        />
                        <span className="text-16 font-medium text-gray-700">
                          {link.label}
                        </span>
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </div>

              <div className="mt-auto border-t border-gray-200 p-4">
                <SheetClose asChild>
                  <Link
                    href="/logout"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-25 text-gray-700"
                  >
                    <Image
                      src="/icons/logout.svg"
                      alt="Logout"
                      width={20}
                      height={20}
                    />
                    <span className="text-16 font-medium">Logout</span>
                  </Link>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
