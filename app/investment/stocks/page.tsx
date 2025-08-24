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
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import IndianMarketDashboard from "@/components/stocks/IndianMarketDashboard";

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
      icon: <Landmark className="h-4 w-4 mr-2" />,
      content: <IndianMarketDashboard />,
    },
    {
      value: "my-stocks",
      label: "My Stocks",
      icon: <PieChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="My Stock Portfolio"
          description="View and manage your stock holdings, including performance, allocation, and dividend information."
        />
      ),
    },
    {
      value: "watchlist",
      label: "Watchlist",
      icon: <BarChart className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Stock Watchlist"
          description="Monitor potential stock investments with customizable alerts and notifications."
        />
      ),
    },
    {
      value: "explore",
      label: "Explore Stocks",
      icon: <Globe className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Stock Explorer"
          description="Discover and research new stock investment opportunities across global markets."
        />
      ),
    },
    {
      value: "market-overview",
      label: "Market Overview",
      icon: <TrendingUp className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Market Overview"
          description="Get a comprehensive view of stock market performance, sector trends, and economic indicators."
        />
      ),
    },
    {
      value: "us-stocks",
      label: "US Stocks",
      icon: <DollarSign className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="US Stock Market"
          description="Explore US stock market opportunities, including NYSE and NASDAQ listings."
        />
      ),
    },
    {
      value: "trade",
      label: "Trade Stocks",
      icon: <ArrowLeftRight className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="Stock Trading"
          description="Execute stock trades with integrated brokerage accounts and real-time market data."
        />
      ),
    },
    {
      value: "ipo",
      label: "IPO Calendar",
      icon: <Building className="h-4 w-4 mr-2" />,
      content: (
        <PlaceholderContent
          title="IPO Calendar"
          description="Stay informed about upcoming initial public offerings and new stock listings."
        />
      ),
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
            className="w-full"
          />
        </CardContent>
      </Card>
    </div>
  );
}
