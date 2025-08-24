"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  LineChart,
  PieChart,
  ArrowRight,
  Info,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Mock data for sector performance
const sectorPerformanceData = [
  { name: "Technology", performance: 12.5 },
  { name: "Healthcare", performance: 8.2 },
  { name: "Consumer Cyclical", performance: -3.5 },
  { name: "Financial", performance: 5.7 },
  { name: "Communication", performance: 7.8 },
  { name: "Industrial", performance: 4.3 },
  { name: "Energy", performance: -2.1 },
  { name: "Materials", performance: 3.6 },
  { name: "Utilities", performance: 1.9 },
  { name: "Real Estate", performance: -1.4 },
];

// Mock data for market breadth
const marketBreadthData = [
  { name: "Jan", advancing: 2300, declining: 1800, unchanged: 400 },
  { name: "Feb", advancing: 2100, declining: 2000, unchanged: 450 },
  { name: "Mar", advancing: 1800, declining: 2400, unchanged: 350 },
  { name: "Apr", advancing: 2500, declining: 1600, unchanged: 400 },
  { name: "May", advancing: 2700, declining: 1400, unchanged: 450 },
  { name: "Jun", advancing: 2300, declining: 1900, unchanged: 400 },
];

// Mock data for volatility index
const volatilityData = [
  { date: "Jan", value: 18 },
  { date: "Feb", value: 22 },
  { date: "Mar", value: 28 },
  { date: "Apr", value: 23 },
  { date: "May", value: 16 },
  { date: "Jun", value: 19 },
  { date: "Jul", value: 15 },
  { date: "Aug", value: 17 },
  { date: "Sep", value: 20 },
];

// Mock data for sector allocation
const sectorAllocationData = [
  { name: "Technology", value: 35 },
  { name: "Healthcare", value: 20 },
  { name: "Financial", value: 15 },
  { name: "Consumer", value: 12 },
  { name: "Industrial", value: 10 },
  { name: "Other", value: 8 },
];

// Colors for pie chart
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export default function StockAnalytics() {
  const [analysisTab, setAnalysisTab] = useState("market-breadth");

  // Format dollar values
  const formatDollar = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  // Format percentage values
  const formatPercent = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Stock Market Analytics
          </h1>
          <p className="text-muted-foreground">
            Advanced analytics and technical indicators for the US stock market
          </p>
        </div>
        <Button variant="outline" size="sm">
          <BarChart className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Main analytics grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Volatility Index */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center text-base">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Volatility Index (VIX)
              </div>
              <Badge variant="outline" className="ml-2">
                {volatilityData[volatilityData.length - 1].value}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm">
              Market fear gauge - higher values indicate more volatility
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={volatilityData}>
                <defs>
                  <linearGradient id="colorVix" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value: number) => [`${value}`, "VIX"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorVix)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-2 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">30-Day Avg</p>
                <p className="font-medium">19.8</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">1Y High</p>
                <p className="font-medium">32.7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Performance */}
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center">
              <BarChart className="h-4 w-4 mr-2" />
              Sector Performance
            </CardTitle>
            <CardDescription className="text-sm">
              Monthly performance by sector (%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <ReBarChart data={sectorPerformanceData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" tickFormatter={(value) => `${value}%`} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, "Performance"]}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                {/* Custom Bar renderer to handle different colors */}
                {sectorPerformanceData.map((item, index) => (
                  <Bar
                    key={`bar-${index}`}
                    dataKey="performance"
                    name={item.name}
                    fill={item.performance >= 0 ? "#10b981" : "#ef4444"}
                  />
                ))}
              </ReBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Detailed Market Analysis</CardTitle>
          <Tabs
            defaultValue="market-breadth"
            className="w-full"
            onValueChange={setAnalysisTab}
          >
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full max-w-md gap-2">
              <TabsTrigger
                value="market-breadth"
                className="flex items-center justify-center"
              >
                <BarChart className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Market Breadth</span>
              </TabsTrigger>
              <TabsTrigger
                value="sector-rotation"
                className="flex items-center justify-center"
              >
                <PieChart className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Sector Rotation</span>
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="flex items-center justify-center"
              >
                <LineChart className="h-4 w-4 mr-1 sm:mr-2" />
                <span>Technical</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="pt-6">
          <TabsContent value="market-breadth" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Advancing vs Declining Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Market breadth indicators show the number of advancing vs
                    declining stocks
                  </p>
                </div>
                <Badge
                  variant={
                    marketBreadthData[marketBreadthData.length - 1].advancing >
                    marketBreadthData[marketBreadthData.length - 1].declining
                      ? "default"
                      : "destructive"
                  }
                  className={
                    marketBreadthData[marketBreadthData.length - 1].advancing >
                    marketBreadthData[marketBreadthData.length - 1].declining
                      ? "bg-green-500"
                      : ""
                  }
                >
                  {marketBreadthData[marketBreadthData.length - 1].advancing >
                  marketBreadthData[marketBreadthData.length - 1].declining
                    ? "Bullish"
                    : "Bearish"}
                </Badge>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ReBarChart data={marketBreadthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      const formattedName =
                        name === "advancing"
                          ? "Advancing"
                          : name === "declining"
                          ? "Declining"
                          : "Unchanged";
                      return [value, formattedName];
                    }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "none",
                      borderRadius: "4px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="advancing" fill="#10b981" name="Advancing" />
                  <Bar dataKey="declining" fill="#ef4444" name="Declining" />
                  <Bar dataKey="unchanged" fill="#6b7280" name="Unchanged" />
                </ReBarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Advance/Decline Ratio
                  </p>
                  <p className="text-xl font-semibold">1.93</p>
                  <Badge variant="outline" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.24
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    New Highs/Lows
                  </p>
                  <p className="text-xl font-semibold">2.45</p>
                  <Badge variant="outline" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +0.32
                  </Badge>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    McClellan Oscillator
                  </p>
                  <p className="text-xl font-semibold">+125</p>
                  <Badge variant="outline" className="mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sector-rotation" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Sector Allocation Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Current market capital distribution across sectors
                  </p>
                </div>
                <Badge variant="outline">Monthly View</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={sectorAllocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({
                          name,
                          percent,
                        }: {
                          name: string;
                          percent?: number;
                        }) =>
                          `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                        }
                      >
                        {sectorAllocationData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [
                          `${value}%`,
                          "Allocation",
                        ]}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          border: "none",
                          borderRadius: "4px",
                          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Current Leaders</p>
                      <Badge variant="default" className="bg-green-500">
                        Bullish
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Technology</span>
                        <Badge
                          variant="outline"
                          className="bg-[#0088FE] text-white"
                        >
                          +2.3%
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Healthcare</span>
                        <Badge
                          variant="outline"
                          className="bg-[#00C49F] text-white"
                        >
                          +1.7%
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Financial</span>
                        <Badge
                          variant="outline"
                          className="bg-[#FFBB28] text-white"
                        >
                          +1.2%
                        </Badge>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Current Laggards</p>
                      <Badge variant="destructive">Bearish</Badge>
                    </div>
                    <Separator className="my-3" />
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Energy</span>
                        <Badge
                          variant="outline"
                          className="bg-[#FF8042] text-white"
                        >
                          -1.5%
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Real Estate</span>
                        <Badge
                          variant="outline"
                          className="bg-[#8884d8] text-white"
                        >
                          -0.9%
                        </Badge>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm">Consumer Cyclical</span>
                        <Badge
                          variant="outline"
                          className="bg-[#82ca9d] text-white"
                        >
                          -0.6%
                        </Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="technical" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Technical Indicators</h3>
                  <p className="text-sm text-muted-foreground">
                    Aggregated technical signals from major indices
                  </p>
                </div>
                <Badge variant="outline">S&P 500</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 border-green-200">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Moving Averages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">BULLISH</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      8/12 indicators bullish
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-200">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Oscillators
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">BEARISH</span>
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      3/7 indicators bearish
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-yellow-200">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Pivot Points
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">NEUTRAL</span>
                      <ArrowRight className="h-5 w-5 text-yellow-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Near S1 support level
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-200">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">BUY</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Overall technical rating
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 border rounded-lg bg-muted/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">
                      Technical Analysis Disclaimer
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Technical indicators are for informational purposes only
                      and should not be used as the sole basis for any
                      investment decision. Past performance is not indicative of
                      future results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="text-xs">
          <Info className="mr-1 h-3 w-3" />
          Data as of {new Date().toLocaleDateString()}
        </Button>
      </div>
    </div>
  );
}
