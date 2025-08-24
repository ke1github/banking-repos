"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  BarChart,
  DollarSign,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Star,
  Clock,
  BookOpen,
  Activity,
  Briefcase,
  Bookmark,
  Plus,
} from "lucide-react";

// Mock data for US stocks
const topUSStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 198.45,
    change: 2.34,
    changePercent: 1.19,
    volume: "34.5M",
    marketCap: "$3.1T",
    pe: 32.5,
    sector: "Technology",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 410.34,
    change: 5.12,
    changePercent: 1.26,
    volume: "28.7M",
    marketCap: "$3.0T",
    pe: 35.8,
    sector: "Technology",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.25,
    change: -1.35,
    changePercent: -0.75,
    volume: "25.3M",
    marketCap: "$1.8T",
    pe: 41.2,
    sector: "Consumer Cyclical",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc. Class A",
    price: 164.38,
    change: 2.14,
    changePercent: 1.32,
    volume: "18.6M",
    marketCap: "$2.0T",
    pe: 24.7,
    sector: "Communication Services",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 512.78,
    change: 8.45,
    changePercent: 1.68,
    volume: "16.9M",
    marketCap: "$1.3T",
    pe: 27.3,
    sector: "Communication Services",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 215.65,
    change: -5.27,
    changePercent: -2.39,
    volume: "38.9M",
    marketCap: "$685B",
    pe: 58.4,
    sector: "Automotive",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 820.75,
    change: 15.45,
    changePercent: 1.92,
    volume: "42.1M",
    marketCap: "$2.0T",
    pe: 48.2,
    sector: "Technology",
  },
  {
    symbol: "BRK.B",
    name: "Berkshire Hathaway Inc. Class B",
    price: 428.32,
    change: 1.34,
    changePercent: 0.31,
    volume: "3.8M",
    marketCap: "$928B",
    pe: 18.9,
    sector: "Financial Services",
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 182.46,
    change: -0.54,
    changePercent: -0.29,
    volume: "8.2M",
    marketCap: "$531B",
    pe: 11.2,
    sector: "Financial Services",
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group Incorporated",
    price: 528.75,
    change: 6.24,
    changePercent: 1.19,
    volume: "2.1M",
    marketCap: "$487B",
    pe: 21.5,
    sector: "Healthcare",
  },
];

const usMarketIndices = [
  {
    name: "S&P 500",
    symbol: "SPX",
    value: 5482.34,
    change: 24.12,
    changePercent: 0.44,
    yearToDate: 15.2,
  },
  {
    name: "Dow Jones",
    symbol: "DJI",
    value: 41345.67,
    change: 156.23,
    changePercent: 0.38,
    yearToDate: 11.8,
  },
  {
    name: "NASDAQ Composite",
    symbol: "IXIC",
    value: 18012.78,
    change: 112.45,
    changePercent: 0.63,
    yearToDate: 18.5,
  },
  {
    name: "Russell 2000",
    symbol: "RUT",
    value: 2178.92,
    change: -5.25,
    changePercent: -0.24,
    yearToDate: 7.2,
  },
];

const sectorPerformance = [
  { name: "Technology", change: 1.25, yearToDate: 21.3 },
  { name: "Healthcare", change: 0.75, yearToDate: 8.7 },
  { name: "Financial Services", change: -0.35, yearToDate: 9.2 },
  { name: "Consumer Cyclical", change: 0.45, yearToDate: 12.5 },
  { name: "Communication Services", change: 0.85, yearToDate: 15.8 },
  { name: "Industrials", change: -0.15, yearToDate: 7.9 },
  { name: "Energy", change: 2.15, yearToDate: 14.3 },
  { name: "Utilities", change: -0.25, yearToDate: -1.2 },
  { name: "Real Estate", change: -0.55, yearToDate: 3.5 },
  { name: "Basic Materials", change: 1.05, yearToDate: 6.8 },
];

const earningsCalendar = [
  {
    symbol: "ADBE",
    name: "Adobe Inc.",
    date: "Sep 12, 2025",
    time: "After Market",
    epsEstimate: 4.85,
    lastEps: 4.48,
    surprise: "+8.3%",
  },
  {
    symbol: "ORCL",
    name: "Oracle Corporation",
    date: "Sep 15, 2025",
    time: "After Market",
    epsEstimate: 1.45,
    lastEps: 1.35,
    surprise: "+7.4%",
  },
  {
    symbol: "FDX",
    name: "FedEx Corporation",
    date: "Sep 17, 2025",
    time: "After Market",
    epsEstimate: 5.12,
    lastEps: 4.94,
    surprise: "+3.6%",
  },
  {
    symbol: "NKE",
    name: "Nike, Inc.",
    date: "Sep 24, 2025",
    time: "After Market",
    epsEstimate: 0.86,
    lastEps: 0.82,
    surprise: "+4.9%",
  },
  {
    symbol: "MU",
    name: "Micron Technology, Inc.",
    date: "Sep 26, 2025",
    time: "After Market",
    epsEstimate: 1.25,
    lastEps: 0.95,
    surprise: "+31.6%",
  },
];

export default function USStocksMarket() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("top-stocks");

  // Filter stocks based on search query
  const filteredStocks = topUSStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* US Market Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                US Stock Market
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                NYSE, NASDAQ, and other US exchanges
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Last updated: 2:30 PM ET</span>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search US stocks by symbol or company name..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* US Indices Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {usMarketIndices.map((index, i) => (
              <div
                key={i}
                className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-sm font-medium">{index.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {index.symbol}
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      index.yearToDate >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    YTD {index.yearToDate >= 0 ? "+" : ""}
                    {index.yearToDate}%
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-xl font-bold">
                    {index.value.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center ${
                      index.change >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {index.change >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {index.change >= 0 ? "+" : ""}
                      {index.change} ({index.changePercent >= 0 ? "+" : ""}
                      {index.changePercent}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs
        defaultValue="top-stocks"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="top-stocks" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Top Stocks
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Sectors
          </TabsTrigger>
          <TabsTrigger value="earnings" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Earnings
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Market Activity
          </TabsTrigger>
        </TabsList>

        {/* Top Stocks Tab */}
        <TabsContent value="top-stocks">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">US Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs">
                      <th className="text-left font-medium p-2">SYMBOL</th>
                      <th className="text-left font-medium p-2">COMPANY</th>
                      <th className="text-right font-medium p-2">PRICE</th>
                      <th className="text-right font-medium p-2">CHANGE</th>
                      <th className="text-right font-medium p-2">VOLUME</th>
                      <th className="text-right font-medium p-2">MARKET CAP</th>
                      <th className="text-right font-medium p-2">P/E</th>
                      <th className="text-right font-medium p-2">SECTOR</th>
                      <th className="text-right font-medium p-2">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredStocks.map((stock, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2 font-medium">{stock.symbol}</td>
                        <td className="p-2 text-sm max-w-[200px] truncate">
                          {stock.name}
                        </td>
                        <td className="p-2 text-right">
                          ${stock.price.toFixed(2)}
                        </td>
                        <td
                          className={`p-2 text-right ${
                            stock.change >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          <div className="flex items-center justify-end">
                            {stock.change >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            <span>
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change.toFixed(2)} (
                              {stock.changePercent >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-right text-muted-foreground">
                          {stock.volume}
                        </td>
                        <td className="p-2 text-right">{stock.marketCap}</td>
                        <td className="p-2 text-right">
                          {stock.pe.toFixed(1)}
                        </td>
                        <td className="p-2 text-right">
                          <Badge variant="outline" className="text-xs">
                            {stock.sector}
                          </Badge>
                        </td>
                        <td className="p-2 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Star className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Bookmark className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            {filteredStocks.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No stocks match your search criteria.
                </p>
              </div>
            )}
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredStocks.length} of {topUSStocks.length} stocks
              </div>
              <Button variant="outline" size="sm">
                View All US Stocks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sectors Tab */}
        <TabsContent value="sectors">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">US Sector Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sectorPerformance.map((sector, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{sector.name}</div>
                      <div className="text-xs text-muted-foreground">
                        YTD: {sector.yearToDate >= 0 ? "+" : ""}
                        {sector.yearToDate}%
                      </div>
                    </div>
                    <div
                      className={`flex items-center ${
                        sector.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {sector.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {sector.change >= 0 ? "+" : ""}
                        {sector.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Sector Breakdown
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Earnings Tab */}
        <TabsContent value="earnings">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Upcoming Earnings Releases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs">
                      <th className="text-left font-medium p-2">DATE</th>
                      <th className="text-left font-medium p-2">SYMBOL</th>
                      <th className="text-left font-medium p-2">COMPANY</th>
                      <th className="text-right font-medium p-2">TIME</th>
                      <th className="text-right font-medium p-2">
                        EPS ESTIMATE
                      </th>
                      <th className="text-right font-medium p-2">LAST EPS</th>
                      <th className="text-right font-medium p-2">SURPRISE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {earningsCalendar.map((earning, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2 text-sm">{earning.date}</td>
                        <td className="p-2 font-medium">{earning.symbol}</td>
                        <td className="p-2 text-sm max-w-[200px] truncate">
                          {earning.name}
                        </td>
                        <td className="p-2 text-right text-sm">
                          {earning.time}
                        </td>
                        <td className="p-2 text-right">
                          ${earning.epsEstimate.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">
                          ${earning.lastEps.toFixed(2)}
                        </td>
                        <td
                          className={`p-2 text-right ${
                            earning.surprise.startsWith("+")
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {earning.surprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                Full Earnings Calendar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Market Activity Tab */}
        <TabsContent value="activity">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Most Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUSStocks
                    .slice(0, 5)
                    .sort((a, b) => {
                      const volumeA =
                        parseFloat(a.volume.replace(/[KMB]/g, "")) *
                        (a.volume.includes("B")
                          ? 1000000000
                          : a.volume.includes("M")
                          ? 1000000
                          : a.volume.includes("K")
                          ? 1000
                          : 1);
                      const volumeB =
                        parseFloat(b.volume.replace(/[KMB]/g, "")) *
                        (b.volume.includes("B")
                          ? 1000000000
                          : b.volume.includes("M")
                          ? 1000000
                          : b.volume.includes("K")
                          ? 1000
                          : 1);
                      return volumeB - volumeA;
                    })
                    .map((stock, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {stock.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>${stock.price.toFixed(2)}</div>
                          <div
                            className={`text-xs ${
                              stock.change >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Biggest Gainers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topUSStocks
                    .slice()
                    .sort((a, b) => b.changePercent - a.changePercent)
                    .slice(0, 5)
                    .map((stock, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            {stock.name}
                          </div>
                        </div>
                        <div className="text-right">
                          <div>${stock.price.toFixed(2)}</div>
                          <div className="text-xs text-green-600">
                            +{stock.changePercent.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Market Movers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <ArrowUpRight className="h-4 w-4 mr-2 text-green-600" />
                    Biggest Gainers
                  </h3>
                  <div className="space-y-2">
                    {topUSStocks
                      .slice()
                      .sort((a, b) => b.changePercent - a.changePercent)
                      .slice(0, 3)
                      .map((stock, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{stock.symbol}</span>
                          <span className="text-green-600">
                            +{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <ArrowDownRight className="h-4 w-4 mr-2 text-red-600" />
                    Biggest Losers
                  </h3>
                  <div className="space-y-2">
                    {topUSStocks
                      .slice()
                      .sort((a, b) => a.changePercent - b.changePercent)
                      .slice(0, 3)
                      .map((stock, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{stock.symbol}</span>
                          <span className="text-red-600">
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-blue-600" />
                    Volume Leaders
                  </h3>
                  <div className="space-y-2">
                    {topUSStocks
                      .slice(0, 3)
                      .sort((a, b) => {
                        const volumeA =
                          parseFloat(a.volume.replace(/[KMB]/g, "")) *
                          (a.volume.includes("B")
                            ? 1000000000
                            : a.volume.includes("M")
                            ? 1000000
                            : a.volume.includes("K")
                            ? 1000
                            : 1);
                        const volumeB =
                          parseFloat(b.volume.replace(/[KMB]/g, "")) *
                          (b.volume.includes("B")
                            ? 1000000000
                            : b.volume.includes("M")
                            ? 1000000
                            : b.volume.includes("K")
                            ? 1000
                            : 1);
                        return volumeB - volumeA;
                      })
                      .map((stock, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-sm"
                        >
                          <span>{stock.symbol}</span>
                          <span>{stock.volume}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Stocks to Watchlist
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
