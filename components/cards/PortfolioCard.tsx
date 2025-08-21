"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedCounter from "../AnimatedCounter";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Target,
  PieChart,
  Activity,
  BarChart3,
} from "lucide-react";

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
  const isCompact = variant === "compact";

  useEffect(() => {
    setIsClient(true);
  }, []);

  const quickActions = [
    {
      icon: Target,
      label: "Invest",
      href: "/investment/invest",
      color: "text-blue-600",
    },
    {
      icon: PieChart,
      label: "Rebalance",
      href: "/investment/rebalance",
      color: "text-green-600",
    },
    {
      icon: Activity,
      label: "Analytics",
      href: "/investment/analytics",
      color: "text-purple-600",
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
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="flex flex-col items-center justify-center py-3 border-r border-blue-500/30 last:border-r-0"
              aria-label={`Go to ${action.label}`}
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center mb-1">
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-12">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop (hidden md:flex) */}
      <div className="hidden md:flex w-full bg-blue-500 rounded-3xl overflow-hidden shadow-xl text-white relative transition-all duration-300 hover:shadow-2xl">
        <div className="flex-1 p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-20 font-semibold mb-2">
                Investment Portfolio
              </h2>
              <p className="text-14 text-white/80">
                {assets.length} asset classes • {riskScore} risk profile
              </p>
            </div>
            <div className="text-right">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-12 text-white/80">Portfolio</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-36 font-bold tabular-nums mb-2">
                {isClient && (
                  <AnimatedCounter {...counterConfig} end={totalValue} />
                )}
              </div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 ${
                    totalGain >= 0 ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {totalGain >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="text-14 font-medium">
                    {totalGain >= 0 ? "+" : ""}$
                    {Math.abs(totalGain).toLocaleString()} total gain
                  </span>
                </div>
                <Badge className="bg-white/20 text-white">
                  {ytdReturn >= 0 ? "+" : ""}
                  {ytdReturn}% YTD
                </Badge>
                <Badge className="bg-white/20 text-white">
                  {monthlyReturn >= 0 ? "+" : ""}
                  {monthlyReturn}% this month
                </Badge>
              </div>
            </div>

            {/* Asset Allocation Preview */}
            {assets.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-14 font-medium text-white/90">
                  Asset Allocation
                </h4>
                <div className="flex w-full h-2 rounded-full overflow-hidden bg-white/20">
                  {assets.map((asset, index) => (
                    <div
                      key={index}
                      className={asset.color}
                      style={{ width: `${asset.percentage}%` }}
                      title={`${asset.name}: ${asset.percentage}%`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {assets.slice(0, 4).map((asset, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${asset.color}`} />
                      <span className="text-12 text-white/80">
                        {asset.name} {asset.percentage}%
                      </span>
                      {asset.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-green-300" />
                      )}
                      {asset.trend === "down" && (
                        <TrendingDown className="w-3 h-3 text-red-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="w-80 bg-white/10 backdrop-blur-sm p-6">
          <h3 className="text-16 font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-14 font-medium">{action.label}</div>
                  <div className="text-12 text-white/70">
                    {action.label === "Invest" && "Add funds"}
                    {action.label === "Rebalance" && "Optimize allocation"}
                    {action.label === "Analytics" && "View performance"}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-4 rounded-xl bg-white/10">
            <h4 className="text-14 font-medium mb-3">Performance Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-12">
                <span className="text-white/70">1 Month</span>
                <span
                  className={
                    monthlyReturn >= 0 ? "text-green-300" : "text-red-300"
                  }
                >
                  {monthlyReturn >= 0 ? "+" : ""}
                  {monthlyReturn}%
                </span>
              </div>
              <div className="flex justify-between text-12">
                <span className="text-white/70">YTD</span>
                <span
                  className={ytdReturn >= 0 ? "text-green-300" : "text-red-300"}
                >
                  {ytdReturn >= 0 ? "+" : ""}
                  {ytdReturn}%
                </span>
              </div>
              <div className="flex justify-between text-12">
                <span className="text-white/70">Risk Level</span>
                <span className="text-white">{riskScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioCard;
