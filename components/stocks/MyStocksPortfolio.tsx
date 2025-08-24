"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  RefreshCw,
  Settings,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatIndianCurrency } from "@/lib/types/indianStocks";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

interface StockHolding {
  symbol: string;
  companyName: string;
  exchange: "NSE" | "BSE";
  avgCost: number;
  quantity: number;
  currentPrice: number;
  value: number;
  dayChange: number;
  dayChangePercent: number;
  overallGain: number;
  overallGainPercent: number;
  sector: string;
}

export default function MyStocksPortfolio() {
  const [sortBy, setSortBy] = useState<string>("value");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterSector, setFilterSector] = useState<string | null>(null);
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");

  // Mock data for a user's stock portfolio
  const mockStockHoldings: StockHolding[] = [
    {
      symbol: "RELIANCE",
      companyName: "Reliance Industries Ltd",
      exchange: "NSE",
      avgCost: 2150.75,
      quantity: 15,
      currentPrice: 2345.6,
      value: 35184.0,
      dayChange: 25.5,
      dayChangePercent: 1.1,
      overallGain: 2942.75,
      overallGainPercent: 9.13,
      sector: "Energy",
    },
    {
      symbol: "INFY",
      companyName: "Infosys Limited",
      exchange: "NSE",
      avgCost: 1450.25,
      quantity: 20,
      currentPrice: 1520.4,
      value: 30408.0,
      dayChange: -12.3,
      dayChangePercent: -0.8,
      overallGain: 1403.0,
      overallGainPercent: 4.84,
      sector: "IT",
    },
    {
      symbol: "HDFCBANK",
      companyName: "HDFC Bank Limited",
      exchange: "NSE",
      avgCost: 1620.5,
      quantity: 12,
      currentPrice: 1710.25,
      value: 20523.0,
      dayChange: 15.75,
      dayChangePercent: 0.93,
      overallGain: 1077.0,
      overallGainPercent: 5.54,
      sector: "Banking",
    },
    {
      symbol: "TCS",
      companyName: "Tata Consultancy Services",
      exchange: "NSE",
      avgCost: 3250.0,
      quantity: 5,
      currentPrice: 3450.8,
      value: 17254.0,
      dayChange: 35.4,
      dayChangePercent: 1.04,
      overallGain: 1004.0,
      overallGainPercent: 6.18,
      sector: "IT",
    },
    {
      symbol: "TATASTEEL",
      companyName: "Tata Steel Limited",
      exchange: "NSE",
      avgCost: 105.75,
      quantity: 100,
      currentPrice: 124.3,
      value: 12430.0,
      dayChange: 2.15,
      dayChangePercent: 1.76,
      overallGain: 1855.0,
      overallGainPercent: 17.55,
      sector: "Metal",
    },
    {
      symbol: "SBIN",
      companyName: "State Bank of India",
      exchange: "NSE",
      avgCost: 520.25,
      quantity: 25,
      currentPrice: 610.45,
      value: 15261.25,
      dayChange: -5.2,
      dayChangePercent: -0.84,
      overallGain: 2255.0,
      overallGainPercent: 17.33,
      sector: "Banking",
    },
    {
      symbol: "ASIANPAINT",
      companyName: "Asian Paints Limited",
      exchange: "NSE",
      avgCost: 3100.5,
      quantity: 4,
      currentPrice: 2950.75,
      value: 11803.0,
      dayChange: -45.25,
      dayChangePercent: -1.51,
      overallGain: -598.0,
      overallGainPercent: -4.82,
      sector: "Consumer",
    },
    {
      symbol: "ITC",
      companyName: "ITC Limited",
      exchange: "BSE",
      avgCost: 240.5,
      quantity: 50,
      currentPrice: 410.3,
      value: 20515.0,
      dayChange: 5.45,
      dayChangePercent: 1.35,
      overallGain: 8490.0,
      overallGainPercent: 70.6,
      sector: "FMCG",
    },
  ];

  // Calculate portfolio summary
  const portfolioSummary = {
    totalValue: mockStockHoldings.reduce((sum, stock) => sum + stock.value, 0),
    totalInvestment: mockStockHoldings.reduce(
      (sum, stock) => sum + stock.avgCost * stock.quantity,
      0
    ),
    dayChange: mockStockHoldings.reduce(
      (sum, stock) => sum + stock.dayChange * stock.quantity,
      0
    ),
    overallGain: mockStockHoldings.reduce(
      (sum, stock) => sum + stock.overallGain,
      0
    ),
    dayChangePercent: 0,
    overallGainPercent: 0,
  };

  // Calculate percentages
  portfolioSummary.dayChangePercent =
    (portfolioSummary.dayChange /
      (portfolioSummary.totalValue - portfolioSummary.dayChange)) *
    100;

  portfolioSummary.overallGainPercent =
    (portfolioSummary.overallGain / portfolioSummary.totalInvestment) * 100;

  // Get unique sectors for filtering
  const sectors = Array.from(
    new Set(mockStockHoldings.map((stock) => stock.sector))
  );

  // Prepare data for portfolio allocation chart (by sector)
  const sectorAllocationData = sectors
    .map((sector) => {
      const sectorStocks = mockStockHoldings.filter(
        (stock) => stock.sector === sector
      );
      const sectorValue = sectorStocks.reduce(
        (sum, stock) => sum + stock.value,
        0
      );
      return {
        name: sector,
        value: sectorValue,
      };
    })
    .sort((a, b) => b.value - a.value);

  // Prepare data for top holdings chart
  const topHoldingsData = [...mockStockHoldings]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map((stock) => ({
      name: stock.symbol,
      value: stock.value,
    }));

  // Colors for pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
  ];

  // Prepare performance data (mock historical data)
  const performanceData = [
    { month: "Jan", value: portfolioSummary.totalValue * 0.85 },
    { month: "Feb", value: portfolioSummary.totalValue * 0.88 },
    { month: "Mar", value: portfolioSummary.totalValue * 0.92 },
    { month: "Apr", value: portfolioSummary.totalValue * 0.89 },
    { month: "May", value: portfolioSummary.totalValue * 0.94 },
    { month: "Jun", value: portfolioSummary.totalValue * 0.97 },
    { month: "Jul", value: portfolioSummary.totalValue * 0.98 },
    { month: "Aug", value: portfolioSummary.totalValue },
  ];

  // Prepare stocks performance data
  const stocksPerformanceData = mockStockHoldings
    .sort((a, b) => b.overallGainPercent - a.overallGainPercent)
    .map((stock) => ({
      name: stock.symbol,
      gain: stock.overallGainPercent,
    }));

  // Custom tooltip for Pie Chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border shadow-sm rounded-sm text-xs">
          <p className="font-medium">{payload[0].name}</p>
          <p>{formatIndianCurrency(payload[0].value)}</p>
          <p className="text-muted-foreground">
            {((payload[0].value / portfolioSummary.totalValue) * 100).toFixed(
              1
            )}
            %
          </p>
        </div>
      );
    }
    return null;
  };

  // Sort and filter stocks
  const sortedAndFilteredStocks = [...mockStockHoldings]
    .filter((stock) => filterSector === null || stock.sector === filterSector)
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "symbol":
          comparison = a.symbol.localeCompare(b.symbol);
          break;
        case "value":
          comparison = a.value - b.value;
          break;
        case "gainPercent":
          comparison = a.overallGainPercent - b.overallGainPercent;
          break;
        case "dayChange":
          comparison = a.dayChangePercent - b.dayChangePercent;
          break;
        default:
          comparison = a.value - b.value;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>My Stock Portfolio</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold">
                {formatIndianCurrency(portfolioSummary.totalValue)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Day's Change</div>
              <div
                className={`text-2xl font-bold flex items-center ${
                  portfolioSummary.dayChange >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {portfolioSummary.dayChange >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                {formatIndianCurrency(Math.abs(portfolioSummary.dayChange))}
                <span className="ml-1 text-base">
                  ({portfolioSummary.dayChange >= 0 ? "+" : "-"}
                  {Math.abs(portfolioSummary.dayChangePercent).toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Overall Gain/Loss
              </div>
              <div
                className={`text-2xl font-bold flex items-center ${
                  portfolioSummary.overallGain >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {portfolioSummary.overallGain >= 0 ? (
                  <TrendingUp className="h-5 w-5 mr-1" />
                ) : (
                  <TrendingDown className="h-5 w-5 mr-1" />
                )}
                {formatIndianCurrency(Math.abs(portfolioSummary.overallGain))}
                <span className="ml-1 text-base">
                  ({portfolioSummary.overallGain >= 0 ? "+" : "-"}
                  {Math.abs(portfolioSummary.overallGainPercent).toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Total Investment
              </div>
              <div className="text-2xl font-bold">
                {formatIndianCurrency(portfolioSummary.totalInvestment)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sector Allocation Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2" />
                Sector Allocation
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setChartType("pie")}>
                    Pie Chart
                    {chartType === "pie" && <span className="ml-1">✓</span>}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setChartType("bar")}>
                    Bar Chart
                    {chartType === "bar" && <span className="ml-1">✓</span>}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {chartType === "pie" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                      }
                      labelLine={false}
                    >
                      {sectorAllocationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectorAllocationData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip
                      formatter={(value: any) => [
                        formatIndianCurrency(value),
                        "Value",
                      ]}
                      labelFormatter={(label) => `Sector: ${label}`}
                    />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Performance Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Portfolio Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatIndianCurrency(value).split(",")[0] + "K"
                    }
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      formatIndianCurrency(value),
                      "Portfolio Value",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Holdings Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Top Holdings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topHoldingsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) =>
                      formatIndianCurrency(value).split(",")[0] + "K"
                    }
                  />
                  <Tooltip
                    formatter={(value: any) => [
                      formatIndianCurrency(value),
                      "Value",
                    ]}
                  />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock Performance Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Stock Performance (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stocksPerformanceData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={60} />
                  <Tooltip
                    formatter={(value: any) => [
                      `${value.toFixed(2)}%`,
                      "Gain/Loss",
                    ]}
                  />
                  <Bar
                    dataKey="gain"
                    fill="#82ca9d"
                    shape={(props: any) => {
                      // Customize bar colors based on positive/negative values
                      const { x, y, width, height, value } = props;
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={value >= 0 ? "#4ade80" : "#f87171"}
                          rx={2}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Stock Holdings
            </CardTitle>
            <div className="flex items-center space-x-2">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Sector</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterSector(null)}>
                    All Sectors
                    {filterSector === null && <span className="ml-1">✓</span>}
                  </DropdownMenuItem>
                  {sectors.map((sector) => (
                    <DropdownMenuItem
                      key={sector}
                      onClick={() => setFilterSector(sector)}
                    >
                      {sector}
                      {filterSector === sector && (
                        <span className="ml-1">✓</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Sort</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort Holdings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("value");
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    }}
                  >
                    By Value{" "}
                    {sortBy === "value" && (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("symbol");
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    }}
                  >
                    By Symbol{" "}
                    {sortBy === "symbol" && (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("gainPercent");
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    }}
                  >
                    By Overall Gain %{" "}
                    {sortBy === "gainPercent" &&
                      (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortBy("dayChange");
                      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
                    }}
                  >
                    By Day's Change %{" "}
                    {sortBy === "dayChange" &&
                      (sortOrder === "desc" ? "↓" : "↑")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto w-full">
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs">
                  <th className="text-left font-medium p-2">STOCK</th>
                  <th className="text-right font-medium p-2">QTY</th>
                  <th className="text-right font-medium p-2">AVG COST</th>
                  <th className="text-right font-medium p-2">CURRENT</th>
                  <th className="text-right font-medium p-2">VALUE</th>
                  <th className="text-right font-medium p-2">DAY'S CHANGE</th>
                  <th className="text-right font-medium p-2">OVERALL G/L</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedAndFilteredStocks.map((stock) => (
                  <tr
                    key={`${stock.symbol}_${stock.exchange}`}
                    className="hover:bg-muted/50"
                  >
                    <td className="p-2">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <span className="truncate max-w-[150px]">
                          {stock.companyName}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-1 text-[10px] h-4 px-1"
                        >
                          {stock.exchange}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-2 text-right">{stock.quantity}</td>
                    <td className="p-2 text-right">
                      <div>{formatIndianCurrency(stock.avgCost)}</div>
                    </td>
                    <td className="p-2 text-right">
                      <div className="flex justify-end items-center">
                        {formatIndianCurrency(stock.currentPrice)}
                        <span
                          className={`ml-1 text-xs ${
                            stock.dayChange >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {stock.dayChange >= 0 ? "+" : ""}
                          {stock.dayChangePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-right font-medium">
                      {formatIndianCurrency(stock.value)}
                    </td>
                    <td className="p-2 text-right">
                      <div
                        className={`flex justify-end items-center ${
                          stock.dayChange >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stock.dayChange >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <span>
                          {formatIndianCurrency(
                            Math.abs(stock.dayChange * stock.quantity)
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-2 text-right">
                      <div
                        className={`flex justify-end items-center ${
                          stock.overallGain >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {stock.overallGain >= 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        <div>
                          <div>
                            {formatIndianCurrency(Math.abs(stock.overallGain))}
                          </div>
                          <div className="text-xs">
                            {stock.overallGain >= 0 ? "+" : "-"}
                            {Math.abs(stock.overallGainPercent).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {sortedAndFilteredStocks.length} of{" "}
            {mockStockHoldings.length} holdings
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Settings className="h-4 w-4" />
            <span>Portfolio Settings</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
