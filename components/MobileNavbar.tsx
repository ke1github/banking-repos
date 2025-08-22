"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sidebarLinks } from "@/constants";
import UserAvatar from "@/components/ui/UserAvatar";
import { ROUTES } from "@/constants/route";
import { useSidebarMode } from "@/lib/hooks/useSidebarMode";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import * as SheetPrimitive from "@radix-ui/react-dialog";

interface MobileNavbarProps {
  user: {
    firstName: string;
    lastName?: string;
    image?: string;
  };
  onLogout?: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode } = useSidebarMode();
  const router = useRouter();

  const handleTabChange = (value: string) => {
    const newMode = value as "banking" | "investment";
    setMode(newMode);

    // Navigate to the appropriate dashboard
    if (newMode === "investment") {
      router.push(ROUTES.INVESTMENTS);
    } else {
      router.push(ROUTES.BANKING_HOME);
    }

    // Close the mobile menu
    setIsOpen(false);
  };

  // Define the type for sidebar link objects
  interface SidebarLink {
    route: string;
    label: string;
    imgURL: string;
  }

  // Using the same structured links as sidebar
  const { mainLinks, accountsLinks, paymentLinks } = sidebarLinks as {
    mainLinks: SidebarLink[];
    accountsLinks: SidebarLink[];
    paymentLinks: SidebarLink[];
  };

  return (
    <div className="mobile-navbar fixed w-full top-0 left-0 z-50">
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white border-b border-gray-200 md:hidden shadow-sm">
        <Logo variant="default" className="py-1" />

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

          <SheetContent
            side="left"
            className="p-0 w-72 max-w-[80vw] flex flex-col overflow-hidden z-[100] shadow-xl"
          >
            <SheetPrimitive.Close className="absolute right-3 top-3 rounded-full w-6 h-6 flex items-center justify-center bg-white/10 text-white z-10">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetPrimitive.Close>
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation Menu</SheetTitle>
            </SheetHeader>

            <div className="mobilenav-sheet flex flex-col h-full overflow-y-auto">
              <div className="flex flex-col flex-1">
                <div className="p-4 bg-blue-600 text-white sticky top-0 z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <UserAvatar
                      src={user.image}
                      firstName={user.firstName}
                      lastName={user.lastName}
                      size="md"
                      className="ring-2 ring-white/30"
                      fallbackClassName="bg-white/20 text-white"
                    />
                    <div>
                      <p className="text-base font-semibold">
                        Welcome, {user.firstName}
                      </p>
                      <p className="text-xs opacity-80">Manage your finances</p>
                    </div>
                  </div>

                  {/* Banking/Investment Tabs */}
                  <Tabs
                    value={mode}
                    className="w-full"
                    onValueChange={handleTabChange}
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-white/20">
                      <TabsTrigger
                        value="banking"
                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                      >
                        Banking
                      </TabsTrigger>
                      <TabsTrigger
                        value="investment"
                        className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
                      >
                        Investment
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex flex-col">
                  {mode === "banking" ? (
                    <>
                      {/* Banking Links */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Main
                        </h3>
                        <div className="flex flex-col">
                          {mainLinks.map((link) => (
                            <SheetClose asChild key={link.route}>
                              <Link
                                href={link.route}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                              >
                                <Image
                                  src={link.imgURL}
                                  alt={link.label}
                                  width={20}
                                  height={20}
                                  className="opacity-75"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {link.label}
                                </span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>

                      {/* Accounts Links */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Accounts & Cards
                        </h3>
                        <div className="flex flex-col">
                          {accountsLinks.map((link) => (
                            <SheetClose asChild key={link.route}>
                              <Link
                                href={link.route}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                              >
                                <Image
                                  src={link.imgURL}
                                  alt={link.label}
                                  width={20}
                                  height={20}
                                  className="opacity-75"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {link.label}
                                </span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>

                      {/* Payment Links */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Payments
                        </h3>
                        <div className="flex flex-col">
                          {paymentLinks.map((link) => (
                            <SheetClose asChild key={link.route}>
                              <Link
                                href={link.route}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                              >
                                <Image
                                  src={link.imgURL}
                                  alt={link.label}
                                  width={20}
                                  height={20}
                                  className="opacity-75"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                  {link.label}
                                </span>
                              </Link>
                            </SheetClose>
                          ))}
                        </div>
                      </div>

                      {/* Banking Tools */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Tools
                        </h3>
                        <div className="flex flex-col">
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.BANKING_CALCULATORS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/calculator.svg"
                                alt="Banking Calculators"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Banking Calculators
                              </span>
                            </Link>
                          </SheetClose>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Investment Links */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Portfolio
                        </h3>
                        <div className="flex flex-col">
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.INVESTMENTS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/home.svg"
                                alt="Dashboard"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Dashboard
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.PORTFOLIO}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/chart-line.svg"
                                alt="My Portfolio"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                My Portfolio
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.INVESTMENT_PERFORMANCE}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/activity.svg"
                                alt="Performance"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Performance
                              </span>
                            </Link>
                          </SheetClose>
                        </div>
                      </div>

                      {/* Investment Types */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Investments
                        </h3>
                        <div className="flex flex-col">
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.STOCKS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/trending-up.svg"
                                alt="Stocks"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Stocks
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.MUTUAL_FUNDS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/pie-chart.svg"
                                alt="Mutual Funds"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Mutual Funds
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.BONDS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/shield.svg"
                                alt="Bonds"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Bonds
                              </span>
                            </Link>
                          </SheetClose>
                        </div>
                      </div>

                      {/* Tools */}
                      <div className="px-2 pt-3">
                        <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                          Tools
                        </h3>
                        <div className="flex flex-col">
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.INVESTMENT_SCREENER}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/search.svg"
                                alt="Investment Screener"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Investment Screener
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.INVESTMENT_PLANNER}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/trending-up.svg"
                                alt="Investment Planner"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Investment Planner
                              </span>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link
                              href={ROUTES.INVESTMENT_CALCULATORS}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50"
                            >
                              <Image
                                src="/icons/calculator.svg"
                                alt="Calculators"
                                width={20}
                                height={20}
                                className="opacity-75"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                Calculators
                              </span>
                            </Link>
                          </SheetClose>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="border-t border-gray-200 px-2 pt-3 pb-2 mt-auto">
                  <h3 className="px-3 mb-1 text-xs font-semibold uppercase text-gray-500">
                    Account
                  </h3>
                  <div className="flex flex-col">
                    {/* Profile link */}
                    <SheetClose asChild>
                      <Link
                        href={ROUTES.PROFILE}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50 text-gray-700"
                      >
                        <Image
                          src="/icons/edit.svg"
                          alt="Profile"
                          width={20}
                          height={20}
                          className="opacity-75"
                        />
                        <span className="text-sm font-medium">Profile</span>
                      </Link>
                    </SheetClose>
                    {/* Logout button */}
                    <SheetClose asChild>
                      <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50/70 active:bg-blue-50 text-gray-700 w-full text-left"
                      >
                        <Image
                          src="/icons/logout.svg"
                          alt="Logout"
                          width={20}
                          height={20}
                          className="opacity-75"
                        />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileNavbar;
