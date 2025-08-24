"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { HeaderBox } from "@/components/HeaderBox";
import PortfolioCard from "@/components/cards/PortfolioCard";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Target,
  Search,
  BarChart4,
  Calculator,
} from "lucide-react";

export default function InvestmentHome() {
  const portfolioData = {
    totalValue: 249500.0,
    ytdReturn: 12.4,
    monthlyReturn: 2.8,
    totalGain: 45230.5,
    assets: [
      {
        name: "Stocks",
        percentage: 45,
        value: 112275,
        color: "bg-blue-500",
        trend: "up" as const,
      },
      {
        name: "Bonds",
        percentage: 30,
        value: 74850,
        color: "bg-blue-400",
        trend: "up" as const,
      },
      {
        name: "ETFs",
        percentage: 15,
        value: 37425,
        color: "bg-blue-300",
        trend: "down" as const,
      },
      {
        name: "Cash",
        percentage: 10,
        value: 24950,
        color: "bg-blue-200",
        trend: "neutral" as const,
      },
    ],
  };

  const topHoldings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      value: 15420,
      change: 2.3,
      percentage: 6.2,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      value: 12850,
      change: 1.8,
      percentage: 5.1,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      value: 10950,
      change: -0.5,
      percentage: 4.4,
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      value: 8640,
      change: 3.2,
      percentage: 3.5,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <HeaderBox
        type="default"
        title="Investment Portfolio"
        subtitle="Track your investments, analyze performance, and grow your wealth"
      />

      {/* Portfolio Card - Reusable Component */}
      <PortfolioCard
        totalValue={portfolioData.totalValue}
        ytdReturn={portfolioData.ytdReturn}
        monthlyReturn={portfolioData.monthlyReturn}
        totalGain={portfolioData.totalGain}
        assets={portfolioData.assets}
        riskScore="Moderate"
        variant="full"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {portfolioData.assets.map((asset, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{asset.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {asset.percentage}%
                    </span>
                    <span className="text-sm font-medium">
                      ${asset.value.toLocaleString()}
                    </span>
                    {asset.trend === "up" && (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    )}
                    {asset.trend === "down" && (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${asset.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${asset.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Holdings */}
        <Card>
          <CardHeader>
            <CardTitle>Top Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topHoldings.map((holding, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {holding.symbol}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{holding.symbol}</p>
                      <p className="text-xs text-gray-500">{holding.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${holding.value.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs ${
                          holding.change >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {holding.change >= 0 ? "+" : ""}
                        {holding.change}%
                      </span>
                      <span className="text-xs text-gray-500">
                        ({holding.percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Invest More</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <PieChart className="h-5 w-5" />
              <span className="text-sm">Rebalance</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <Target className="h-5 w-5" />
              <span className="text-sm">Set Goals</span>
            </Button>
            <Button className="h-20 flex flex-col gap-2" variant="outline">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Performance</span>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink
              href="/investment/screener"
              section="investment"
              icon={<Search className="h-4 w-4" />}
              size="wide"
            >
              Stock Screener
            </ButtonLink>
            <ButtonLink
              href="/investment/fundamental-analysis"
              section="investment"
              variant="outline"
              icon={<BarChart4 className="h-4 w-4" />}
            >
              Fundamental Analysis
            </ButtonLink>
            <ButtonLink
              href="/investment/calculators"
              section="investment"
              variant="secondary"
              icon={<Calculator className="h-4 w-4" />}
              shape="rounded"
            >
              Investment Calculators
            </ButtonLink>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
