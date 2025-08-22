"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  BarChart3,
  DollarSign,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const marketOverviewData = {
  summary: {
    totalStocks: 4847,
    advancing: 2891,
    declining: 1742,
    unchanged: 214,
    totalVolume: 125600000000,
    totalTurnover: 67890000000000,
  },
  indices: [
    {
      name: "Nifty 50",
      value: 19845.3,
      change: 245.85,
      changePercent: 1.25,
      volume: "₹45,234Cr",
    },
    {
      name: "Sensex",
      value: 66589.93,
      change: 487.22,
      changePercent: 0.74,
      volume: "₹38,567Cr",
    },
    {
      name: "Nifty Bank",
      value: 44532.15,
      change: 623.45,
      changePercent: 1.42,
      volume: "₹12,890Cr",
    },
    {
      name: "Nifty IT",
      value: 32156.78,
      change: 812.34,
      changePercent: 2.59,
      volume: "₹8,456Cr",
    },
    {
      name: "Nifty Pharma",
      value: 15234.67,
      change: 287.45,
      changePercent: 1.92,
      volume: "₹3,245Cr",
    },
    {
      name: "Nifty Auto",
      value: 18967.23,
      change: -156.78,
      changePercent: -0.82,
      volume: "₹4,567Cr",
    },
  ],
  marketBreadth: {
    advanceDeclineRatio: 1.66,
    newHighs: 89,
    newLows: 23,
    volumeAdvancing: 68.5,
    volumeDeclining: 31.5,
  },
  globalMarkets: [
    {
      name: "Dow Jones",
      value: 35462.78,
      change: -123.45,
      changePercent: -0.35,
      status: "Closed",
    },
    {
      name: "S&P 500",
      value: 4567.89,
      change: 12.34,
      changePercent: 0.27,
      status: "Closed",
    },
    {
      name: "NASDAQ",
      value: 14234.56,
      change: 89.12,
      changePercent: 0.63,
      status: "Closed",
    },
    {
      name: "Nikkei 225",
      value: 32145.67,
      change: 234.56,
      changePercent: 0.74,
      status: "Live",
    },
    {
      name: "Hang Seng",
      value: 18967.34,
      change: -89.45,
      changePercent: -0.47,
      status: "Closed",
    },
    {
      name: "FTSE 100",
      value: 7456.78,
      change: 23.45,
      changePercent: 0.32,
      status: "Closed",
    },
  ],
  topGainers: [
    {
      symbol: "ADANIENT",
      name: "Adani Enterprises",
      price: 2567.45,
      change: 234.56,
      changePercent: 10.05,
    },
    {
      symbol: "SUNPHARMA",
      name: "Sun Pharma",
      price: 1134.78,
      change: 89.23,
      changePercent: 8.53,
    },
    {
      symbol: "DRREDDY",
      name: "Dr Reddy's Labs",
      price: 5234.67,
      change: 387.45,
      changePercent: 7.99,
    },
    {
      symbol: "CIPLA",
      name: "Cipla Ltd",
      price: 1345.89,
      change: 95.67,
      changePercent: 7.65,
    },
  ],
  topLosers: [
    {
      symbol: "TATAMOTORS",
      name: "Tata Motors",
      price: 567.89,
      change: -45.67,
      changePercent: -7.43,
    },
    {
      symbol: "MARUTI",
      name: "Maruti Suzuki",
      price: 9876.54,
      change: -623.45,
      changePercent: -5.95,
    },
    {
      symbol: "M&M",
      name: "M&M Ltd",
      price: 1567.34,
      change: -89.23,
      changePercent: -5.39,
    },
    {
      symbol: "EICHERMOT",
      name: "Eicher Motors",
      price: 3456.78,
      change: -167.89,
      changePercent: -4.63,
    },
  ],
};

export default function MarketOverview() {
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `₹${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(0)}Cr`;
    }
    return `₹${value.toFixed(2)}`;
  };

  const formatLargeNumber = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    return value.toString();
  };

  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Market Summary
            <Badge variant="outline" className="ml-auto">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {marketOverviewData.summary.totalStocks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {marketOverviewData.summary.advancing.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Advancing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {marketOverviewData.summary.declining.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Declining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {marketOverviewData.summary.unchanged.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Unchanged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatLargeNumber(marketOverviewData.summary.totalVolume)}
              </div>
              <div className="text-sm text-gray-600">Volume</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(marketOverviewData.summary.totalTurnover)}
              </div>
              <div className="text-sm text-gray-600">Turnover</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Major Indices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Major Indices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketOverviewData.indices.map((index) => (
              <div
                key={index.name}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{index.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {index.volume}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold">
                    {index.value.toLocaleString()}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Breadth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              Market Breadth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {marketOverviewData.marketBreadth.advanceDeclineRatio}
                </div>
                <div className="text-sm text-gray-600">A/D Ratio</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {marketOverviewData.marketBreadth.newHighs}
                </div>
                <div className="text-sm text-gray-600">New Highs</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">New Lows</span>
                <span className="font-semibold text-red-600">
                  {marketOverviewData.marketBreadth.newLows}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Volume Advancing</span>
                <span className="font-semibold text-green-600">
                  {marketOverviewData.marketBreadth.volumeAdvancing}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Volume Declining</span>
                <span className="font-semibold text-red-600">
                  {marketOverviewData.marketBreadth.volumeDeclining}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Markets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Global Markets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverviewData.globalMarkets.map((market) => (
                <div
                  key={market.name}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {market.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {market.value.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        market.status === "Live" ? "default" : "secondary"
                      }
                      className="mb-1 text-xs"
                    >
                      {market.status}
                    </Badge>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-sm",
                        market.change >= 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {market.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" />
                      )}
                      {market.change >= 0 ? "+" : ""}
                      {market.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverviewData.topGainers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 hover:bg-green-50 rounded transition-colors"
                >
                  <div>
                    <div className="font-semibold text-blue-600">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                    <div className="text-sm text-green-600 font-medium">
                      +{stock.change.toFixed(2)} (+
                      {stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketOverviewData.topLosers.map((stock) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-2 hover:bg-red-50 rounded transition-colors"
                >
                  <div>
                    <div className="font-semibold text-blue-600">
                      {stock.symbol}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                    <div className="text-sm text-red-600 font-medium">
                      {stock.change.toFixed(2)} (
                      {stock.changePercent.toFixed(2)}%)
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
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Stock Screener</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <DollarSign className="h-6 w-6" />
              <span className="text-sm">Market Movers</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Analyst Reports</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Activity className="h-6 w-6" />
              <span className="text-sm">Live Charts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
