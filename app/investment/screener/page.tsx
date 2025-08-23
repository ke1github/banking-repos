"use client";

import React, { useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  Globe,
  Coins,
  Building2,
  Zap,
  Target,
  PieChart,
  BarChart2,
  LineChart,
} from "lucide-react";
import InvestmentSearchBar from "@/components/investment/InvestmentSearchBar";
import IndianStockScreener from "@/components/investment/screeners/IndianStockScreener";
import EnhancedIndianStockScreener from "@/components/investment/screeners/EnhancedIndianStockScreener";
import StockScreener from "@/components/investment/screeners/StockScreener";
import MutualFundScreener from "@/components/investment/screeners/MutualFundScreener";
import CryptoScreener from "@/components/investment/screeners/CryptoScreener";
import BondScreener from "@/components/investment/screeners/BondScreener";
import ETFScreener from "@/components/investment/screeners/ETFScreener";
import IPOScreener from "@/components/investment/screeners/IPOScreener";
import CommodityScreener from "@/components/investment/screeners/CommodityScreener";
import { LoadingState } from "@/components/ui/data-states";

// Centralized market overview data
const marketIndices = [
  {
    name: "NIFTY 50",
    value: "24,485.50",
    change: "+1.2%",
    trend: "up" as const,
  },
  {
    name: "SENSEX",
    value: "80,845.75",
    change: "+0.8%",
    trend: "up" as const,
  },
  {
    name: "BANK NIFTY",
    value: "52,125.30",
    change: "-0.5%",
    trend: "down" as const,
  },
  {
    name: "FII Flow",
    value: "₹2,845 Cr",
    change: "Inflow",
    trend: "up" as const,
    icon: DollarSign,
  },
];

// Reusable MarketOverviewCard component
const MarketOverviewCard = ({
  name,
  value,
  change,
  trend,
  icon: CustomIcon,
}: (typeof marketIndices)[0]) => {
  const Icon = CustomIcon || (trend === "up" ? TrendingUp : TrendingDown);
  const colorClass = trend === "up" ? "text-green-600" : "text-red-600";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{name}</p>
            <p className="text-lg font-semibold">{value}</p>
          </div>
          <div className={`flex items-center ${colorClass}`}>
            <Icon className="h-4 w-4 mr-1" />
            <span className="text-sm">{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const screenerTabs = [
  {
    id: "indian-stocks",
    label: "Indian Stocks",
    icon: TrendingUp,
    color: "bg-blue-500",
    description: "NSE & BSE real-time data",
    component: IndianStockScreener,
  },
  {
    id: "enhanced-indian-stocks",
    label: "Advanced Indian Stocks",
    icon: BarChart2,
    color: "bg-blue-700",
    description: "Comprehensive analysis with financial ratios",
    component: EnhancedIndianStockScreener,
  },
  {
    id: "global-stocks",
    label: "Global Stocks",
    icon: Globe,
    color: "bg-purple-500",
    description: "International markets",
    component: StockScreener,
  },
  {
    id: "mutual-funds",
    label: "Mutual Funds",
    icon: BarChart3,
    color: "bg-green-500",
    description: "AMFI registered schemes",
    component: MutualFundScreener,
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Coins,
    color: "bg-orange-500",
    description: "Digital currencies",
    component: CryptoScreener,
  },
  {
    id: "bonds",
    label: "Bonds",
    icon: Building2,
    color: "bg-gray-500",
    description: "Government & Corporate bonds",
    component: BondScreener,
  },
  {
    id: "etfs",
    label: "ETFs",
    icon: PieChart,
    color: "bg-indigo-500",
    description: "Exchange Traded Funds",
    component: ETFScreener,
  },
  {
    id: "ipos",
    label: "IPOs",
    icon: Zap,
    color: "bg-red-500",
    description: "Initial Public Offerings",
    component: IPOScreener,
  },
  {
    id: "commodities",
    label: "Commodities",
    icon: Target,
    color: "bg-yellow-500",
    description: "Gold, Silver, Oil & more",
    component: CommodityScreener,
  },
];

function ScreenerContent() {
  const [activeTab, setActiveTab] = useState("indian-stocks");
  const [searchQuery, setSearchQuery] = useState("");

  // Get the current active tab configuration
  const currentTab = screenerTabs.find((tab) => tab.id === activeTab);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          Investment Screener
        </h1>
        <p className="text-muted-foreground">
          Discover and analyze investment opportunities across multiple asset
          classes in the Indian market
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <InvestmentSearchBar
          onSearch={setSearchQuery}
          placeholder={`Search ${
            currentTab?.label.toLowerCase() || "investments"
          }...`}
          category={activeTab}
        />
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {marketIndices.map((index) => (
          <MarketOverviewCard key={index.name} {...index} />
        ))}
      </div>

      {/* Screener Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-6 h-auto">
          {screenerTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 p-2 h-auto min-h-[60px]"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs text-center leading-tight">
                  {tab.label}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          {screenerTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <Card className="border-0 shadow-none">
                <CardHeader className="px-0 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${tab.color}`}>
                        <tab.icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>{tab.label} Screener</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {tab.description}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {searchQuery ? "Filtered" : "All"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="px-0">
                  <Suspense fallback={<LoadingState className="h-96" />}>
                    <tab.component searchQuery={searchQuery} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}

export default function ScreenerPage() {
  return (
    <Suspense fallback={<LoadingState className="h-96" />}>
      <ScreenerContent />
    </Suspense>
  );
}
