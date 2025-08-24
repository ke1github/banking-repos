"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Bell,
  Newspaper,
  BarChart3,
  DollarSign,
  Clock,
} from "lucide-react";
import BaseSidebar, {
  BaseUserProps,
} from "@/components/ui/sidebar/BaseSidebar";

interface InvestmentRightSidebarProps {
  user?: BaseUserProps;
}

const InvestmentRightSidebar = ({
  user = { firstName: "Guest" },
}: InvestmentRightSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"performance" | "news">(
    "performance"
  );

  // Mock data for investment-specific content
  const marketData = [
    { symbol: "S&P 500", value: "4,557.12", change: "+0.68%", trend: "up" },
    { symbol: "NASDAQ", value: "14,346.85", change: "+1.22%", trend: "up" },
    { symbol: "DOW", value: "35,462.78", change: "-0.23%", trend: "down" },
    { symbol: "VTI", value: "245.67", change: "+0.45%", trend: "up" },
  ];

  const topPerformers = [
    { name: "Apple Inc.", symbol: "AAPL", change: "+3.24%", price: "$182.50" },
    { name: "Microsoft", symbol: "MSFT", change: "+2.18%", price: "$378.92" },
    { name: "NVIDIA", symbol: "NVDA", change: "+4.67%", price: "$456.23" },
  ];

  const investmentNews = [
    {
      title: "Fed Signals Potential Rate Cuts",
      time: "2 hours ago",
      category: "Market News",
    },
    {
      title: "Tech Stocks Rally on AI Optimism",
      time: "4 hours ago",
      category: "Technology",
    },
    {
      title: "Q3 Earnings Season Preview",
      time: "6 hours ago",
      category: "Earnings",
    },
    {
      title: "Emerging Markets Show Strength",
      time: "1 day ago",
      category: "Global Markets",
    },
  ];

  const upcomingEvents = [
    {
      title: "Portfolio Rebalancing Due",
      date: "Tomorrow",
      type: "action",
    },
    {
      title: "AAPL Earnings Release",
      date: "Nov 2, 2024",
      type: "earnings",
    },
    {
      title: "Monthly Investment Review",
      date: "Nov 15, 2024",
      type: "review",
    },
  ];

  // Tab configuration for BaseSidebar
  const tabs = [
    {
      id: "performance",
      label: "Performance",
      icon: BarChart3,
    },
    {
      id: "news",
      label: "News",
      icon: Newspaper,
    },
  ];

  // Bottom actions for BaseSidebar
  const bottomActions = (
    <div className="space-y-2">
      <Button className="w-full" size="sm">
        <DollarSign className="w-4 h-4 mr-2" />
        Invest Now
      </Button>
      <Button variant="outline" className="w-full" size="sm">
        <BarChart3 className="w-4 h-4 mr-2" />
        View Detailed Analysis
      </Button>
    </div>
  );

  // Content for the active tab
  const renderTabContent = () => {
    if (activeTab === "performance") {
      return (
        <>
          {/* Market Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-14 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketData.map((market, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="text-12 font-medium text-gray-900">
                      {market.symbol}
                    </p>
                    <p className="text-10 text-gray-500">{market.value}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1 ${
                      market.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {market.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-11 font-medium">{market.change}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Performers */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-14 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topPerformers.map((stock, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-12 font-medium text-gray-900">
                        {stock.symbol}
                      </p>
                      <p className="text-10 text-gray-500">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-11 font-medium text-gray-900">
                        {stock.price}
                      </p>
                      <p className="text-10 text-green-600 font-medium">
                        {stock.change}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-14 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.type === "action"
                        ? "bg-orange-100"
                        : event.type === "earnings"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    {event.type === "action" && (
                      <Target className="w-4 h-4 text-orange-600" />
                    )}
                    {event.type === "earnings" && (
                      <DollarSign className="w-4 h-4 text-blue-600" />
                    )}
                    {event.type === "review" && (
                      <BarChart3 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-12 font-medium text-gray-900">
                      {event.title}
                    </p>
                    <p className="text-10 text-gray-500">{event.date}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      );
    } else {
      return (
        <>
          {/* Investment News */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-14 flex items-center gap-2">
                <Newspaper className="w-4 h-4" />
                Latest News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {investmentNews.map((news, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Clock className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-12 font-medium text-gray-900 leading-relaxed">
                        {news.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className="text-10 px-2 py-0.5"
                        >
                          {news.category}
                        </Badge>
                        <span className="text-10 text-gray-500">
                          {news.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < investmentNews.length - 1 && (
                    <hr className="border-gray-100" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Alerts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-14 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Market Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-12 font-medium text-green-800">
                    Portfolio up 2.3% today
                  </span>
                </div>
                <p className="text-10 text-green-600 mt-1">
                  Strong performance across tech holdings
                </p>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="text-12 font-medium text-blue-800">
                    Rebalancing recommended
                  </span>
                </div>
                <p className="text-10 text-blue-600 mt-1">
                  Asset allocation has drifted from target
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      );
    }
  };

  return (
    <BaseSidebar
      user={user}
      title="Investment Portfolio"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as "performance" | "news")}
      bottomActions={bottomActions}
    >
      {renderTabContent()}
    </BaseSidebar>
  );
};

export default InvestmentRightSidebar;
