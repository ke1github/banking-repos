"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import DoughnutChart from "../DoughnutChart";
import AnimatedCounter from "../AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/route";

interface Account {
  id: string;
  name: string;
}

interface BalanceCardProps {
  accounts?: Array<Account>;
  totalBanks?: number;
  totalCurrentBalance?: number;
  variant?: "full" | "compact";
  title?: string;
  amount?: number;
  currency?: string;
  trend?: string;
  percentage?: number;
}

const counterConfig = {
  start: 0,
  duration: 2.0,
  decimals: 2,
  prefix: "₹",
  separator: ",",
};

const BalanceCard = ({
  accounts = [],
  totalBanks = 0,
  totalCurrentBalance = 0,
  variant = "full",
  title,
  amount,
  currency,
  trend,
  percentage,
}: BalanceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const isCompact = variant === "compact";

  useEffect(() => {
    // Set isClient to true once component mounts (client-side)
    setIsClient(true);
  }, []);

  const accountDistribution = [
    { type: "Checking", percentage: 40, color: "#0047B3" },
    { type: "Savings", percentage: 35, color: "#2065D8" },
    { type: "Investment", percentage: 25, color: "#2389FA" },
  ];

  return (
    <>
      {/* Mobile (md:hidden) */}
      <div className="md:hidden w-full bg-blue-500 rounded-2xl overflow-hidden shadow-lg text-white relative">
        <div className="p-4 pb-6">
          <h3 className="text-16 font-semibold text-white">Total Balance</h3>
          <div className="text-12 text-white/80 mt-0.5">
            {accounts.length} accounts across {totalBanks} banks
          </div>
          <div className="text-26 font-bold tabular-nums mt-3">
            <AnimatedCounter {...counterConfig} end={totalCurrentBalance} />
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-medium">{totalBanks}</span>
            </div>
            <div className="text-10 text-center mt-0.5">Banks</div>
          </div>
        </div>
        <div className="grid grid-cols-3 bg-blue-600">
          <Link
            href={ROUTES.DEPOSITS}
            className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30"
            aria-label="Go to Deposits"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/deposit.svg"
                alt="Deposit"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-12">Deposit</span>
          </Link>
          <Link
            href={ROUTES.TRANSFERS}
            className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30"
            aria-label="Go to Transfers"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/money-send.svg"
                alt="Transfer"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-12">Transfer</span>
          </Link>
          <Link
            href={ROUTES.SEND_MONEY}
            className="flex flex-col items-center justify-center py-3"
            aria-label="Go to Send Money"
          >
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/payment-transfer.svg"
                alt="Pay"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-12">Pay</span>
          </Link>
        </div>
      </div>

      {/* Desktop (hidden on mobile) */}
      <section
        className={`hidden md:block w-full md:max-w-[520px] lg:max-w-[560px] xl:max-w-[600px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative ${
          isCompact ? "bg-white" : "bg-gradient-to-br from-white to-blue-50"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background gradient mesh (full only) */}
        {variant === "full" && (
          <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
            <Image
              src="/icons/gradient-mesh.svg"
              alt=""
              fill
              className={`object-cover transition-opacity duration-700 ${
                isHovered ? "opacity-70" : "opacity-40"
              }`}
            />
          </div>
        )}

        <div
          className={`flex flex-col sm:flex-row items-center ${
            isCompact ? "p-5" : "p-6"
          } gap-6`}
        >
          {/* Chart */}
          <div
            className={`relative rounded-xl flex-shrink-0 shadow-inner border ${
              isCompact
                ? "bg-blue-50 p-5 border-blue-100/70"
                : "bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 border-blue-100/50"
            }`}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
              <Image
                src="/icons/Lines.svg"
                alt=""
                fill
                className="object-cover opacity-30"
              />
            </div>
            <div
              className={`transition-transform duration-500 ease-out ${
                isHovered ? "scale-105" : ""
              }`}
            >
              <DoughnutChart
                data={{
                  labels: accountDistribution.map((i) => i.type),
                  values: accountDistribution.map((i) => i.percentage),
                  colors: accountDistribution.map((i) => i.color),
                }}
                size={isCompact ? 110 : 130}
                cutout={
                  isHovered
                    ? isCompact
                      ? "68%"
                      : "70%"
                    : isCompact
                    ? "64%"
                    : "65%"
                }
                centerText={{ value: totalBanks, label: "Banks" }}
              />
            </div>
            {variant === "full" && (
              <div className="absolute -bottom-2 -right-2">
                <div className="bg-blue-600 text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md flex items-center">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
                  Live
                </div>
              </div>
            )}
          </div>

          {/* Balance info */}
          <div className="flex flex-1 flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-20 md:text-24 font-semibold text-gray-900">
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
                    <span>Bank Accounts:</span>
                    <span className="font-semibold">{totalBanks}</span>
                  </span>
                </h2>
                <Badge variant="secondary" className="shrink-0">
                  Active
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-14 text-gray-600 whitespace-nowrap">
                  Total Current Balance
                </p>
                <span className="flex items-center text-12 text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-0.5"
                  >
                    <path
                      d="M7 17L17 7M17 7H8M17 7V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  2.3%
                </span>
              </div>
              {variant === "full" && (
                <p className="text-12 text-gray-500 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M12 6V12L16 14"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Last updated: Today, 10:45 AM
                  </span>
                </p>
              )}
              {variant === "full" && (
                <div className="hidden sm:block mt-4">
                  <div className="flex flex-col gap-2.5">
                    {accountDistribution.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 group"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-12 font-medium text-gray-700 min-w-[70px]">
                            {item.type}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700 ease-out"
                              style={{
                                width: isHovered ? `${item.percentage}%` : "0%",
                                backgroundColor: item.color,
                                transitionDelay: `${index * 150}ms`,
                              }}
                            ></div>
                          </div>
                          <span className="text-12 font-medium text-gray-500 min-w-[35px] text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1 sm:ml-auto">
              {isCompact ? (
                <p className="text-26 md:text-30 tabular-nums font-bold text-blue-700">
                  <AnimatedCounter
                    {...counterConfig}
                    end={totalCurrentBalance}
                  />
                </p>
              ) : (
                <div className="relative bg-blue-50/50 px-4 py-3 rounded-lg">
                  <p
                    className={`text-30 md:text-36 tabular-nums font-bold text-blue-700 transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    <AnimatedCounter
                      {...counterConfig}
                      end={totalCurrentBalance}
                    />
                  </p>
                </div>
              )}
              {variant === "full" && (
                <p className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-14 text-gray-600 mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-12 font-medium">
                      Banks: {totalBanks}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-12 font-medium">
                      Accounts: {accounts.length}
                    </span>
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions (desktop only) */}
        {variant === "full" && (
          <div className="hidden md:flex border-t border-gray-100/50 divide-x divide-gray-100/50 bg-white/80 backdrop-blur-sm">
            <Link
              href={ROUTES.DEPOSITS}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group"
              aria-label="Go to Deposits"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center mr-1 group-hover:bg-blue-100 transition-colors">
                <Image
                  src="/icons/deposit.svg"
                  alt="Deposit"
                  width={16}
                  height={16}
                />
              </div>
              <span className="group-hover:text-blue-700 transition-colors">
                Deposit
              </span>
            </Link>
            <Link
              href={ROUTES.TRANSFERS}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group"
              aria-label="Go to Transfers"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center mr-1 group-hover:bg-blue-100 transition-colors">
                <Image
                  src="/icons/money-send.svg"
                  alt="Transfer"
                  width={16}
                  height={16}
                />
              </div>
              <span className="group-hover:text-blue-700 transition-colors">
                Transfer
              </span>
            </Link>
            <Link
              href={ROUTES.SEND_MONEY}
              className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group"
              aria-label="Go to Send Money"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center mr-1 group-hover:bg-blue-100 transition-colors">
                <Image
                  src="/icons/payment-transfer.svg"
                  alt="Pay"
                  width={16}
                  height={16}
                />
              </div>
              <span className="group-hover:text-blue-700 transition-colors">
                Pay
              </span>
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default BalanceCard;
