"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Factory,
  Building,
  Cpu,
  Smartphone,
  Car,
  Home,
  Heart,
  Zap,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sectorData = [
  {
    name: "Information Technology",
    symbol: "IT",
    performance: 12.8,
    marketCap: 25647000000000,
    stocks: 125,
    topPerformers: ["TCS", "INFY", "WIPRO"],
    icon: Cpu,
    color: "blue",
  },
  {
    name: "Banking & Financial Services",
    symbol: "BFSI",
    performance: 8.4,
    marketCap: 18923000000000,
    stocks: 89,
    topPerformers: ["HDFCBANK", "ICICIBANK", "KOTAKBANK"],
    icon: Building,
    color: "green",
  },
  {
    name: "Energy & Oil",
    symbol: "ENERGY",
    performance: -2.1,
    marketCap: 15678000000000,
    stocks: 45,
    topPerformers: ["RELIANCE", "ONGC", "IOC"],
    icon: Zap,
    color: "orange",
  },
  {
    name: "Fast Moving Consumer Goods",
    symbol: "FMCG",
    performance: 5.7,
    marketCap: 12456000000000,
    stocks: 67,
    topPerformers: ["HINDUNILVR", "ITC", "NESTLEIND"],
    icon: Home,
    color: "purple",
  },
  {
    name: "Pharmaceuticals",
    symbol: "PHARMA",
    performance: 15.2,
    marketCap: 8934000000000,
    stocks: 78,
    topPerformers: ["SUNPHARMA", "DRREDDY", "CIPLA"],
    icon: Heart,
    color: "red",
  },
  {
    name: "Automotive",
    symbol: "AUTO",
    performance: -5.8,
    marketCap: 7823000000000,
    stocks: 56,
    topPerformers: ["MARUTI", "TATAMOTORS", "M&M"],
    icon: Car,
    color: "indigo",
  },
  {
    name: "Telecommunications",
    symbol: "TELECOM",
    performance: 3.2,
    marketCap: 6745000000000,
    stocks: 23,
    topPerformers: ["BHARTIARTL", "IDEA", "BSNL"],
    icon: Smartphone,
    color: "pink",
  },
  {
    name: "Manufacturing",
    symbol: "MANUFACTURING",
    performance: 7.9,
    marketCap: 5892000000000,
    stocks: 134,
    topPerformers: ["LT", "BAJAJ-AUTO", "TITAN"],
    icon: Factory,
    color: "yellow",
  },
];

const marketIndices = [
  { name: "Nifty 50", value: 19845.3, change: 245.85, changePercent: 1.25 },
  { name: "Sensex", value: 66589.93, change: 487.22, changePercent: 0.74 },
  { name: "Nifty Bank", value: 44532.15, change: 623.45, changePercent: 1.42 },
  { name: "Nifty IT", value: 32156.78, change: 812.34, changePercent: 2.59 },
];

export default function SectorPerformance() {
  const [sortBy, setSortBy] = useState<"performance" | "marketCap" | "stocks">(
    "performance"
  );
  const [filterPositive, setFilterPositive] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 1000000000000) {
      return `₹${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(0)}Cr`;
    }
    return `₹${value.toFixed(2)}`;
  };

  const getSortedData = () => {
    const filtered = filterPositive
      ? sectorData.filter((s) => s.performance > 0)
      : sectorData;

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "performance":
          return b.performance - a.performance;
        case "marketCap":
          return b.marketCap - a.marketCap;
        case "stocks":
          return b.stocks - a.stocks;
        default:
          return 0;
      }
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      orange: "bg-orange-500 text-white",
      purple: "bg-purple-500 text-white",
      red: "bg-red-500 text-white",
      indigo: "bg-indigo-500 text-white",
      pink: "bg-pink-500 text-white",
      yellow: "bg-yellow-500 text-white",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-6">
      {/* Market Indices Overview */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Market Indices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketIndices.map((index) => (
              <div key={index.name} className="text-center">
                <div className="text-lg font-semibold text-gray-700">
                  {index.name}
                </div>
                <div className="text-2xl font-bold">
                  {index.value.toLocaleString()}
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center gap-1 text-sm",
                    index.change >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {index.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {index.change >= 0 ? "+" : ""}
                  {index.change.toFixed(2)} ({index.change >= 0 ? "+" : ""}
                  {index.changePercent.toFixed(2)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sector Performance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sector Performance
          </h2>
          <p className="text-gray-600">
            Track performance across different market sectors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={filterPositive ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterPositive(!filterPositive)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {filterPositive ? "Show All" : "Positive Only"}
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="performance">Sort by Performance</option>
            <option value="marketCap">Sort by Market Cap</option>
            <option value="stocks">Sort by Stock Count</option>
          </select>
        </div>
      </div>

      {/* Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {getSortedData().map((sector) => {
          const Icon = sector.icon;
          return (
            <Card
              key={sector.symbol}
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      getColorClasses(sector.color)
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge
                    className={cn(
                      "border",
                      sector.performance >= 0
                        ? "text-green-600 bg-green-50 border-green-200"
                        : "text-red-600 bg-red-50 border-red-200"
                    )}
                  >
                    {sector.performance >= 0 ? "+" : ""}
                    {sector.performance.toFixed(1)}%
                  </Badge>
                </div>
                <div>
                  <CardTitle className="text-lg">{sector.name}</CardTitle>
                  <p className="text-sm text-gray-600">{sector.symbol}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Performance Indicator */}
                <div className="flex items-center gap-2">
                  {sector.performance >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      "font-semibold",
                      sector.performance >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    )}
                  >
                    {sector.performance >= 0 ? "+" : ""}
                    {sector.performance.toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-500">30d performance</span>
                </div>

                {/* Key Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Market Cap</span>
                    <span className="font-medium">
                      {formatCurrency(sector.marketCap)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Listed Stocks</span>
                    <span className="font-medium">{sector.stocks}</span>
                  </div>
                </div>

                {/* Top Performers */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Top Performers
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {sector.topPerformers.map((stock) => (
                      <Badge
                        key={stock}
                        variant="secondary"
                        className="text-xs"
                      >
                        {stock}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button variant="outline" size="sm" className="w-full">
                  View Sector Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sector Allocation Pie Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            Market Composition by Sector
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto text-blue-500 mb-4" />
              <p className="text-gray-600 font-medium">
                Interactive Sector Composition Chart
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Visual representation of market cap distribution
              </p>
              <Button variant="outline" size="sm" className="mt-4">
                View Interactive Chart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sector Rotation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Sector Rotation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Leading
              </div>
              <div className="space-y-1">
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  IT
                </Badge>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  Pharma
                </Badge>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  Manufacturing
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                Improving
              </div>
              <div className="space-y-1">
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  FMCG
                </Badge>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Banking
                </Badge>
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Telecom
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                Lagging
              </div>
              <div className="space-y-1">
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  Auto
                </Badge>
                <Badge className="bg-red-50 text-red-700 border-red-200">
                  Energy
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
