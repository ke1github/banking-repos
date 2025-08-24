"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TabList from "@/components/ui/TabList";
import { Badge } from "@/components/ui/badge";
import {
  Landmark,
  Building,
  TrendingUp,
  ArrowLeftRight,
  Globe,
  DollarSign,
  BarChart,
  PieChart,
  Sparkles,
  LineChart,
  Newspaper,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import IndianMarketDashboard from "@/components/stocks/IndianMarketDashboard";
import MyStocksPortfolio from "@/components/stocks/MyStocksPortfolio";
import StockWatchlist from "@/components/stocks/StockWatchlist";
import StockExplorer from "@/components/stocks/StockExplorer";
import USStocksMarket from "@/components/stocks/USStocksMarket";
import MarketOverview from "@/components/stocks/MarketOverview";
import StockTrading from "@/components/stocks/StockTrading";
import AutomatedInvesting from "@/components/stocks/AutomatedInvesting";
import IPOCalendar from "@/components/stocks/IPOCalendar";
import StockAnalytics from "@/components/stocks/StockAnalytics";
import StockNews from "@/components/stocks/StockNews";

// This is a placeholder component - in a real implementation, you'd have proper components
const PlaceholderContent = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Separator />
    <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
      <p className="text-muted-foreground">{title} would appear here</p>
    </div>
  </div>
);

export default function StocksPage() {
  const [activeTab, setActiveTab] = useState("indian-market");

  const stocksTabs = [
    {
      value: "indian-market",
      label: "Indian Market",
      icon: <Landmark className="h-4 w-4" />,
      content: <IndianMarketDashboard />,
    },
    {
      value: "my-stocks",
      label: "My Stocks",
      icon: <PieChart className="h-4 w-4" />,
      content: <MyStocksPortfolio />,
    },
    {
      value: "watchlist",
      label: "Watchlist",
      icon: <BarChart className="h-4 w-4" />,
      content: <StockWatchlist />,
    },
    {
      value: "explore",
      label: "Explore Stocks",
      icon: <Globe className="h-4 w-4" />,
      content: <StockExplorer />,
    },
    {
      value: "market-overview",
      label: "Market Overview",
      icon: <TrendingUp className="h-4 w-4" />,
      content: <MarketOverview />,
    },
    {
      value: "us-stocks",
      label: "US Stocks",
      icon: <DollarSign className="h-4 w-4" />,
      content: <USStocksMarket />,
    },
    {
      value: "trade",
      label: "Trade Stocks",
      icon: <ArrowLeftRight className="h-4 w-4" />,
      content: <StockTrading />,
    },
    {
      value: "automated",
      label: "Automated Investing",
      icon: <Sparkles className="h-4 w-4" />,
      content: <AutomatedInvesting />,
    },
    {
      value: "ipo",
      label: "IPO Calendar",
      icon: <Building className="h-4 w-4" />,
      content: <IPOCalendar />,
    },
    {
      value: "analytics",
      label: "Stock Analytics",
      icon: <LineChart className="h-4 w-4" />,
      content: <StockAnalytics />,
    },
    {
      value: "news",
      label: "Market News",
      icon: <Newspaper className="h-4 w-4" />,
      content: <StockNews />,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">Stocks</h1>
        <p className="text-muted-foreground">
          Manage your stock investments and explore new opportunities
        </p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Stock Market Dashboard</CardTitle>
            <Badge variant="outline" className="text-xs font-normal py-0 h-5">
              Live Data
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <TabList
            items={stocksTabs}
            defaultValue="indian-market"
            value={activeTab}
            onValueChange={setActiveTab}
            variant="boxed"
            size="sm"
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
