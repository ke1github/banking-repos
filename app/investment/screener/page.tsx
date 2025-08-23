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
} from "lucide-react";
import InvestmentSearchBar from "@/components/investment/InvestmentSearchBar";
import IndianStockScreener from "@/components/investment/screeners/IndianStockScreener";
import StockScreener from "@/components/investment/screeners/StockScreener";
import MutualFundScreener from "@/components/investment/screeners/MutualFundScreener";
import CryptoScreener from "@/components/investment/screeners/CryptoScreener";
import BondScreener from "@/components/investment/screeners/BondScreener";
import ETFScreener from "@/components/investment/screeners/ETFScreener";
import IPOScreener from "@/components/investment/screeners/IPOScreener";
import CommodityScreener from "@/components/investment/screeners/CommodityScreener";
import { LoadingState } from "@/components/ui/data-states";

const screenerTabs = [
  {
    id: "indian-stocks",
    label: "Indian Stocks",
    icon: TrendingUp,
    color: "bg-blue-500",
    description: "NSE & BSE real-time data",
  },
  {
    id: "stocks",
    label: "Global Stocks",
    icon: Globe,
    color: "bg-purple-500",
    description: "International markets",
  },
  {
    id: "mutual-funds",
    label: "Mutual Funds",
    icon: BarChart3,
    color: "bg-green-500",
    description: "AMFI registered schemes",
  },
  {
    id: "crypto",
    label: "Crypto",
    icon: Coins,
    color: "bg-orange-500",
    description: "Digital currencies",
  },
  {
    id: "bonds",
    label: "Bonds",
    icon: Building2,
    color: "bg-purple-500",
    description: "Government & Corporate bonds",
  },
  {
    id: "etfs",
    label: "ETFs",
    icon: Globe,
    color: "bg-indigo-500",
    description: "Exchange Traded Funds",
  },
  {
    id: "ipos",
    label: "IPOs",
    icon: Zap,
    color: "bg-red-500",
    description: "Initial Public Offerings",
  },
  {
    id: "commodities",
    label: "Commodities",
    icon: Target,
    color: "bg-yellow-500",
    description: "Gold, Silver, Oil & more",
  },
];

function ScreenerContent() {
  const [activeTab, setActiveTab] = useState("indian-stocks");
  const [searchQuery, setSearchQuery] = useState("");

  const renderScreener = () => {
    switch (activeTab) {
      case "indian-stocks":
        return <IndianStockScreener searchQuery={searchQuery} />;
      case "stocks":
        return <StockScreener searchQuery={searchQuery} />;
      case "mutual-funds":
        return <MutualFundScreener searchQuery={searchQuery} />;
      case "crypto":
        return <CryptoScreener searchQuery={searchQuery} />;
      case "bonds":
        return <BondScreener searchQuery={searchQuery} />;
      case "etfs":
        return <ETFScreener searchQuery={searchQuery} />;
      case "ipos":
        return <IPOScreener searchQuery={searchQuery} />;
      case "commodities":
        return <CommodityScreener searchQuery={searchQuery} />;
      default:
        return <IndianStockScreener searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
            Investment Screener
          </h1>
          <p className="text-muted-foreground text-sm lg:text-base">
            Discover and analyze investment opportunities across multiple asset
            classes in the Indian market
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full">
          <InvestmentSearchBar
            onSearch={setSearchQuery}
            placeholder={`Search ${
              screenerTabs
                .find((tab) => tab.id === activeTab)
                ?.label.toLowerCase() || "investments"
            }...`}
            category={activeTab}
          />
        </div>

        {/* Market Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">NIFTY 50</p>
                  <p className="text-lg font-semibold">24,485.50</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+1.2%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">SENSEX</p>
                  <p className="text-lg font-semibold">80,845.75</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+0.8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BANK NIFTY</p>
                  <p className="text-lg font-semibold">52,125.30</p>
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span className="text-sm">-0.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">FII Flow</p>
                  <p className="text-lg font-semibold">₹2,845 Cr</p>
                </div>
                <div className="flex items-center text-green-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span className="text-sm">Inflow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Screener Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1">
            {screenerTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          {screenerTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardHeader>
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
                <CardContent>
                  <Suspense fallback={<LoadingState className="h-96" />}>
                    {renderScreener()}
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
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
