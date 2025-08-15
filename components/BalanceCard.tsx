"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DoughnutChart from "./DoughnutChart";
import AnimatedCounter from "./AnimatedCounter";

interface Account {
  id: string;
  name: string;
  // Add other properties as needed
}

interface BalanceCardProps {
  accounts?: Array<Account>;
  totalBanks: number;
  totalCurrentBalance: number;
}

// Shared AnimatedCounter configuration
const counterConfig = {
  start: 0,
  duration: 2.5,
  decimals: 2,
  prefix: "₹",
  separator: ",",
};

const BalanceCard = ({
  accounts = [],
  totalBanks,
  totalCurrentBalance,
}: BalanceCardProps) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Sample distribution data for visualization
  // In a real app, this would come from your account data
  const accountDistribution = [
    { type: "Checking", percentage: 40, color: "#0047B3" },
    { type: "Savings", percentage: 35, color: "#2065D8" },
    { type: "Investment", percentage: 25, color: "#2389FA" },
  ];

  // Set up the responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Mobile view
  if (isMobileView) {
    return (
      <div className="bg-blue-500 rounded-2xl overflow-hidden shadow-lg text-white">
        <div className="p-4 pb-6">
          <h3 className="text-base font-medium text-white">Total Balance</h3>
          <div className="text-xs text-white/80 mt-0.5">
            {accounts.length} accounts across {totalBanks} banks
          </div>

          <div className="text-[28px] font-bold mt-3">
            <AnimatedCounter {...counterConfig} end={totalCurrentBalance} />
          </div>

          {/* Bank indicator */}
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs font-medium">{totalBanks}</span>
            </div>
            <div className="text-[10px] text-center mt-0.5">Banks</div>
          </div>
        </div>

        {/* Action buttons - improving visibility */}
        <div className="grid grid-cols-3 bg-blue-600">
          <button className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/deposit.svg"
                alt="Deposit"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-xs">Deposit</span>
          </button>

          <button className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/money-send.svg"
                alt="Transfer"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-xs">Transfer</span>
          </button>

          <button className="flex flex-col items-center justify-center py-3">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
              <Image
                src="/icons/payment-transfer.svg"
                alt="Pay"
                width={20}
                height={20}
                className="brightness-200 invert"
              />
            </div>
            <span className="text-xs">Pay</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <section
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient mesh */}
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
      <div className="flex flex-col sm:flex-row items-center p-6 gap-6">
        {/* Chart section */}
        <div className="relative bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 flex-shrink-0 shadow-inner border border-blue-100/50">
          {/* Background pattern */}
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
                labels: accountDistribution.map((item) => item.type),
                values: accountDistribution.map((item) => item.percentage),
                colors: accountDistribution.map((item) => item.color),
              }}
              size={130}
              cutout={isHovered ? "70%" : "65%"}
              centerText={{ value: totalBanks, label: "Banks" }}
            />
          </div>

          {/* Animated dots on the chart container when hovered */}
          <div className="absolute inset-0 pointer-events-none">
            {isHovered && (
              <>
                <span className="absolute top-2 right-6 bg-blue-600 w-1.5 h-1.5 rounded-full animate-pulse"></span>
                <span className="absolute bottom-4 left-3 bg-blue-400 w-2 h-2 rounded-full animate-ping opacity-75"></span>
                <span className="absolute top-10 left-4 bg-blue-500 w-1 h-1 rounded-full animate-ping opacity-50"></span>
                <span className="absolute bottom-10 right-4 bg-blue-700 w-1.5 h-1.5 rounded-full animate-pulse opacity-70"></span>
              </>
            )}
          </div>

          <div className="absolute -bottom-2 -right-2">
            <div className="bg-blue-600 text-white text-xs font-medium rounded-full px-2 py-0.5 shadow-md flex items-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1"></span>
              Live
            </div>
          </div>
        </div>

        {/* Balance info section */}
        <div className="flex flex-1 flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
          <div className="flex flex-col gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Bank Accounts: {totalBanks}
              </h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-600">Total Current Balance</p>
              <span className="flex items-center text-xs text-green-600 font-medium bg-green-50 px-1.5 py-0.5 rounded-full">
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

            {/* Last update info */}
            <p className="text-xs text-gray-500 mt-0.5">
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

            {/* Account Distribution - Visual representation */}
            <div className="hidden sm:block mt-4">
              <div className="flex flex-col gap-2.5">
                {accountDistribution.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 group">
                    <span
                      className="w-2.5 h-2.5 rounded-full group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 min-w-[70px]">
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
                      <span className="text-xs font-medium text-gray-500 min-w-[35px] text-right">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <button className="flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition-colors group">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      d="M12 5v14m-7-7h14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="group-hover:underline">Add new account</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1 sm:ml-auto">
            <div className="relative bg-blue-50/50 px-4 py-3 rounded-lg">
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 items-center justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 6L9 17L4 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              <p
                className={`text-3xl md:text-4xl font-bold text-blue-700 transition-all duration-300 ${
                  isHovered ? "scale-110" : ""
                }`}
              >
                <AnimatedCounter {...counterConfig} end={totalCurrentBalance} />
              </p>
            </div>

            <p className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-sm text-gray-600 mt-3">
              <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span className="text-xs font-medium">Banks: {totalBanks}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-xs font-medium">
                  Accounts: {accounts.length}
                </span>
              </span>
            </p>

            {/* Connected services */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-1.5 text-center sm:text-right">
                Connected Services
              </p>
              <div className="flex gap-1.5">
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/visa.svg"
                    alt="Visa"
                    width={14}
                    height={14}
                  />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/mastercard.svg"
                    alt="Mastercard"
                    width={14}
                    height={14}
                  />
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Image
                    src="/icons/Paypass.svg"
                    alt="Paypass"
                    width={14}
                    height={14}
                  />
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex border-t border-gray-100/50 divide-x divide-gray-100/50 bg-white/80 backdrop-blur-sm">
        <button className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group">
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
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group">
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
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group">
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
        </button>
      </div>

      {/* View all accounts button */}
      <div className="flex border-t border-gray-100/50 px-6 py-3 bg-white/90">
        <button className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors group">
          View all accounts
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1.5 group-hover:translate-x-1 transition-transform"
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="ml-auto flex items-center">
          <span className="text-xs text-gray-500 mr-3">
            Updated today at 10:45 AM
          </span>
          <button className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BalanceCard;
