"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TabList, { TabItem } from "@/components/ui/TabList";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  Target,
  DollarSign,
  Users,
  Calendar,
  Globe,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StockAnalysisProps {
  selectedStock: string | null;
}

const stockData = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2750.45,
    change: 45.2,
    changePercent: 1.67,
    marketCap: 18564000000000,
    volume: 8542000,
    sector: "Energy",
    exchange: "NSE",
    fundamentals: {
      pe: 24.5,
      pb: 2.1,
      roe: 12.8,
      debt: 2.8,
      dividend: 0.85,
      revenue: 8925600000000,
      profit: 712400000000,
      eps: 420.5,
      bookValue: 1310.2,
    },
    technical: {
      rsi: 58.4,
      macd: "Bullish",
      support: 2650,
      resistance: 2850,
      trend: "Uptrend",
      volume_trend: "High",
      bollinger: "Middle Band",
    },
    analyst: {
      rating: "Buy",
      target: 3100,
      consensus: 85,
      upgrades: 3,
      downgrades: 1,
    },
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4125.3,
    change: -25.75,
    changePercent: -0.62,
    marketCap: 15024000000000,
    volume: 2845000,
    sector: "IT",
    exchange: "NSE",
    fundamentals: {
      pe: 28.7,
      pb: 12.4,
      roe: 42.1,
      debt: 0.1,
      dividend: 3.2,
      revenue: 2253000000000,
      profit: 453600000000,
      eps: 125.8,
      bookValue: 332.4,
    },
    technical: {
      rsi: 42.1,
      macd: "Bearish",
      support: 4050,
      resistance: 4250,
      trend: "Sideways",
      volume_trend: "Normal",
      bollinger: "Lower Band",
    },
    analyst: {
      rating: "Hold",
      target: 4200,
      consensus: 65,
      upgrades: 1,
      downgrades: 2,
    },
  },
};

export default function StockAnalysis({ selectedStock }: StockAnalysisProps) {
  const [activeTab, setActiveTab] = useState("fundamental");

  const stock =
    selectedStock && stockData[selectedStock as keyof typeof stockData]
      ? stockData[selectedStock as keyof typeof stockData]
      : stockData.RELIANCE;

  const formatCurrency = (value: number) => {
    if (value >= 10000000000000) {
      return `₹${(value / 10000000000000).toFixed(1)}T`;
    } else if (value >= 1000000000000) {
      return `₹${(value / 1000000000000).toFixed(1)}T`;
    } else if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(0)}Cr`;
    }
    return `₹${value.toFixed(2)}`;
  };

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "buy":
      case "bullish":
      case "uptrend":
        return "text-green-600 bg-green-50 border-green-200";
      case "sell":
      case "bearish":
      case "downtrend":
        return "text-red-600 bg-red-50 border-red-200";
      case "hold":
      case "sideways":
      case "neutral":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stock Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-blue-600">
                  {stock.symbol}
                </h2>
                <Badge variant="outline">{stock.exchange}</Badge>
                <Badge variant="secondary">{stock.sector}</Badge>
              </div>
              <p className="text-gray-600">{stock.name}</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold">
                ₹{stock.price.toFixed(2)}
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 mt-1",
                  stock.change >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {stock.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)} ({stock.change >= 0 ? "+" : ""}
                {stock.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tabs */}
      <TabList
        items={[
          {
            value: "fundamental",
            label: "Fundamental Analysis",
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Valuation Metrics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        Valuation Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">P/E Ratio</span>
                        <span className="font-semibold">
                          {stock.fundamentals.pe}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">P/B Ratio</span>
                        <span className="font-semibold">
                          {stock.fundamentals.pb}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">EPS</span>
                        <span className="font-semibold">
                          ₹{stock.fundamentals.eps}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Book Value</span>
                        <span className="font-semibold">
                          ₹{stock.fundamentals.bookValue}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Financial Health */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        Financial Health
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ROE</span>
                        <span className="font-semibold text-green-600">
                          {stock.fundamentals.roe}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Debt/Equity</span>
                        <span className="font-semibold">
                          {stock.fundamentals.debt}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dividend Yield</span>
                        <span className="font-semibold text-blue-600">
                          {stock.fundamentals.dividend}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-semibold">
                          {formatCurrency(stock.fundamentals.revenue)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profitability */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                        Profitability
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Profit</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(stock.fundamentals.profit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin</span>
                        <span className="font-semibold">
                          {(
                            (stock.fundamentals.profit /
                              stock.fundamentals.revenue) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Market Cap</span>
                        <span className="font-semibold">
                          {formatCurrency(stock.marketCap)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Volume</span>
                        <span className="font-semibold">
                          {(stock.volume / 1000000).toFixed(1)}M
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          {
            value: "technical",
            label: "Technical Analysis",
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Technical Indicators */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <LineChart className="h-5 w-5 text-blue-500" />
                        Technical Indicators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">RSI (14)</span>
                        <Badge
                          className={cn(
                            "border",
                            stock.technical.rsi > 70
                              ? "text-red-600 bg-red-50 border-red-200"
                              : stock.technical.rsi < 30
                              ? "text-green-600 bg-green-50 border-green-200"
                              : "text-yellow-600 bg-yellow-50 border-yellow-200"
                          )}
                        >
                          {stock.technical.rsi}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">MACD</span>
                        <Badge
                          className={cn(
                            "border",
                            getSignalColor(stock.technical.macd)
                          )}
                        >
                          {stock.technical.macd}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Trend</span>
                        <Badge
                          className={cn(
                            "border",
                            getSignalColor(stock.technical.trend)
                          )}
                        >
                          {stock.technical.trend}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Bollinger</span>
                        <span className="font-semibold text-sm">
                          {stock.technical.bollinger}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support & Resistance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-green-500" />
                        Support & Resistance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Resistance</span>
                          <span className="font-semibold text-red-600">
                            ₹{stock.technical.resistance}
                          </span>
                        </div>
                        <div className="h-2 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded"></div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Current</span>
                          <span className="font-semibold">
                            ₹{stock.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Support</span>
                          <span className="font-semibold text-green-600">
                            ₹{stock.technical.support}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Volume Trend</span>
                          <Badge variant="outline">
                            {stock.technical.volume_trend}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Chart Patterns */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-purple-500" />
                        Chart Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                          <p className="text-sm text-gray-600">
                            Interactive Chart
                          </p>
                          <p className="text-xs text-gray-500">Coming Soon</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Pattern</span>
                          <Badge variant="outline">Ascending Triangle</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Signal</span>
                          <Badge className="text-green-600 bg-green-50 border-green-200 border">
                            Bullish
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
          {
            value: "sentiment",
            label: "Market Sentiment",
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Analyst Recommendations */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-500" />
                        Analyst Consensus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div
                          className={cn(
                            "text-3xl font-bold mb-2",
                            getSignalColor(stock.analyst.rating)
                          )}
                        >
                          {stock.analyst.rating.toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {stock.analyst.consensus}% of analysts agree
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Target Price</span>
                          <span className="font-semibold text-green-600">
                            ₹{stock.analyst.target}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Upside Potential
                          </span>
                          <span className="font-semibold text-green-600">
                            +
                            {(
                              ((stock.analyst.target - stock.price) /
                                stock.price) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-green-500" />
                        Recent Actions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Rating Upgrades
                            </div>
                            <div className="text-xs text-gray-500">
                              Last 30 days
                            </div>
                          </div>
                          <Badge className="text-green-600 bg-green-50 border-green-200 border">
                            {stock.analyst.upgrades}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <div className="flex-1">
                            <div className="text-sm font-medium">
                              Rating Downgrades
                            </div>
                            <div className="text-xs text-gray-500">
                              Last 30 days
                            </div>
                          </div>
                          <Badge className="text-red-600 bg-red-50 border-red-200 border">
                            {stock.analyst.downgrades}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Market Sentiment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-500" />
                        Market Buzz
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Social Sentiment
                          </span>
                          <Badge className="text-green-600 bg-green-50 border-green-200 border">
                            Positive
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">News Sentiment</span>
                          <Badge className="text-blue-600 bg-blue-50 border-blue-200 border">
                            Neutral
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">
                            Institutional Flow
                          </span>
                          <Badge className="text-green-600 bg-green-50 border-green-200 border">
                            Buying
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Retail Interest</span>
                          <Badge className="text-yellow-600 bg-yellow-50 border-yellow-200 border">
                            Moderate
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
