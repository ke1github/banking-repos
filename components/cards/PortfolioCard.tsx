"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from "../AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/route";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface Asset {
  name: string;
  percentage: number;
  value: number;
  color: string;
  trend: "up" | "down" | "neutral";
}

interface PortfolioCardProps {
  totalValue?: number;
  ytdReturn?: number;
  monthlyReturn?: number;
  totalGain?: number;
  assets?: Asset[];
  variant?: "full" | "compact";
  riskScore?: string;
}

const counterConfig = {
  start: 0,
  duration: 2.0,
  decimals: 2,
  prefix: "$",
  separator: ",",
};

const PortfolioCard = ({
  totalValue = 0,
  ytdReturn = 0,
  monthlyReturn = 0,
  totalGain = 0,
  assets = [],
  variant = "full",
  riskScore = "Moderate",
}: PortfolioCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // CTA actions for footer (similar to BalanceCard)
  const ctaActions = [
    {
      icon: "/icons/deposit.svg",
      label: "Buy Stocks",
      href: ROUTES.STOCKS,
      description: "Invest in stocks",
    },
    {
      icon: "/icons/money-send.svg",
      label: "Mutual Funds",
      href: ROUTES.MUTUAL_FUNDS,
      description: "SIP & lumpsum",
    },
    {
      icon: "/icons/payment-transfer.svg",
      label: "Screener",
      href: ROUTES.INVESTMENT_SCREENER,
      description: "Find best picks",
    },
  ];

  return (
    <>
      {/* Mobile (md:hidden) */}
      <div className="md:hidden w-full bg-blue-500 rounded-2xl overflow-hidden shadow-lg text-white relative">
        <div className="p-4 pb-6">
          <h3 className="text-16 font-semibold text-white">Portfolio Value</h3>
          <div className="text-12 text-white/80 mt-0.5">
            {assets.length} asset classes • {riskScore} risk
          </div>
          <div className="text-26 font-bold tabular-nums mt-3">
            <AnimatedCounter {...counterConfig} end={totalValue} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`flex items-center gap-1 ${
                totalGain >= 0 ? "text-green-300" : "text-red-300"
              }`}
            >
              {totalGain >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-12 font-medium">
                {totalGain >= 0 ? "+" : ""}$
                {Math.abs(totalGain).toLocaleString()}
              </span>
            </div>
            <Badge className="bg-white/20 text-white text-10 px-2 py-0.5">
              {ytdReturn >= 0 ? "+" : ""}
              {ytdReturn}% YTD
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="text-10 text-center mt-0.5">Portfolio</div>
          </div>
        </div>
        <div className="grid grid-cols-3 bg-blue-600">
          {ctaActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30 last:border-r-0"
              aria-label={`Go to ${action.label}`}
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
                <Image
                  src={action.icon}
                  alt={action.label}
                  width={20}
                  height={20}
                  className="brightness-200 invert"
                />
              </div>
              <span className="text-12">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop (hidden on mobile) */}
      <section
        className={`hidden md:block w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl relative ${
          variant === "compact"
            ? "bg-white"
            : "bg-gradient-to-br from-white to-blue-50"
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
            variant === "compact" ? "p-5" : "p-6"
          } gap-6`}
        >
          {/* Portfolio Icon/Chart */}
          <div
            className={`relative rounded-xl flex-shrink-0 shadow-inner border ${
              variant === "compact"
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
              <div className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center">
                <BarChart3 className="w-16 h-16 text-white" />
              </div>
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

          {/* Portfolio info */}
          <div className="flex flex-1 flex-col sm:flex-row items-center sm:items-start justify-between w-full gap-4">
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-20 md:text-24 font-semibold text-gray-900">
                  <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
                    <span>Investment Portfolio</span>
                  </span>
                </h2>
                <Badge variant="secondary" className="shrink-0">
                  {riskScore} Risk
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-14 text-gray-600 whitespace-nowrap">
                  Total Portfolio Value
                </p>
                <span
                  className={`flex items-center text-12 font-medium px-1.5 py-0.5 rounded-full ${
                    totalGain >= 0
                      ? "text-green-600 bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {totalGain >= 0 ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  )}
                  {totalGain >= 0 ? "+" : ""}$
                  {Math.abs(totalGain).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  YTD: {ytdReturn >= 0 ? "+" : ""}
                  {ytdReturn}%
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  Monthly: {monthlyReturn >= 0 ? "+" : ""}
                  {monthlyReturn}%
                </Badge>
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
              {variant === "full" && assets.length > 0 && (
                <div className="hidden sm:block mt-4">
                  <div className="flex flex-col gap-2.5">
                    <h4 className="text-12 font-medium text-gray-700">
                      Asset Allocation
                    </h4>
                    {assets.slice(0, 3).map((asset, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 group"
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full group-hover:scale-110 transition-transform ${asset.color}`}
                        ></span>
                        <div className="flex-1 flex items-center gap-2">
                          <span className="text-12 font-medium text-gray-700 min-w-[70px]">
                            {asset.name}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-700 ease-out ${asset.color}`}
                              style={{
                                width: isHovered
                                  ? `${asset.percentage}%`
                                  : "0%",
                                transitionDelay: `${index * 150}ms`,
                              }}
                            ></div>
                          </div>
                          <span className="text-12 font-medium text-gray-500 min-w-[35px] text-right">
                            {asset.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1 sm:ml-auto">
              {variant === "compact" ? (
                <p className="text-26 md:text-30 tabular-nums font-bold text-blue-700">
                  {isClient && (
                    <AnimatedCounter {...counterConfig} end={totalValue} />
                  )}
                </p>
              ) : (
                <div className="relative bg-blue-50/50 px-4 py-3 rounded-lg">
                  <p
                    className={`text-30 md:text-36 tabular-nums font-bold text-blue-700 transition-all duration-300 ${
                      isHovered ? "scale-110" : ""
                    }`}
                  >
                    {isClient && (
                      <AnimatedCounter {...counterConfig} end={totalValue} />
                    )}
                  </p>
                </div>
              )}
              {variant === "full" && (
                <p className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 text-14 text-gray-600 mt-3">
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <span className="text-12 font-medium">
                      Assets: {assets.length}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-12 font-medium">
                      Risk: {riskScore}
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
            {ctaActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium text-gray-700 hover:bg-blue-50/50 transition-colors group"
                aria-label={`Go to ${action.label}`}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100/50 flex items-center justify-center mr-1 group-hover:bg-blue-100 transition-colors">
                  <Image
                    src={action.icon}
                    alt={action.label}
                    width={16}
                    height={16}
                  />
                </div>
                <span className="group-hover:text-blue-700 transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default PortfolioCard;
