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
  SearchIcon,
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart2,
  Globe,
  ArrowUpDown,
  Tag,
  BookOpen,
  Briefcase,
  Cpu,
  Share2,
  Search,
  DollarSign,
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/types/indianStocks";

// Mock company data for the market explorer
const sectorData = [
  {
    name: "Technology",
    value: 12345.67,
    change: 2.34,
    companies: 42,
    icon: <Cpu className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "Financial Services",
    value: 9876.54,
    change: -0.75,
    companies: 36,
    icon: <Briefcase className="h-5 w-5 text-green-500" />,
  },
  {
    name: "Healthcare",
    value: 7654.32,
    change: 1.25,
    companies: 28,
    icon: <BookOpen className="h-5 w-5 text-red-500" />,
  },
  {
    name: "Consumer Goods",
    value: 6543.21,
    change: 0.45,
    companies: 34,
    icon: <Tag className="h-5 w-5 text-purple-500" />,
  },
  {
    name: "Telecommunications",
    value: 5432.1,
    change: -1.2,
    companies: 12,
    icon: <Share2 className="h-5 w-5 text-indigo-500" />,
  },
];

const marketData = [
  {
    name: "US Market",
    description: "NYSE, NASDAQ, OTC",
    mainIndex: "S&P 500",
    indexValue: 5482.34,
    change: 0.85,
    currency: "$",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    name: "European Market",
    description: "LSE, Euronext, XETRA",
    mainIndex: "STOXX 600",
    indexValue: 512.78,
    change: 0.25,
    currency: "€",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: "Asian Market",
    description: "Nikkei, KOSPI, Hang Seng",
    mainIndex: "Nikkei 225",
    indexValue: 39485.75,
    change: -0.45,
    currency: "¥",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    name: "Indian Market",
    description: "NSE, BSE",
    mainIndex: "NIFTY 50",
    indexValue: 24150.25,
    change: 1.15,
    currency: "₹",
    icon: <Globe className="h-5 w-5" />,
  },
];

const trendingStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 198.45,
    change: 2.34,
    volume: "34.5M",
    market: "NASDAQ",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    price: 820.75,
    change: 3.56,
    volume: "42.1M",
    market: "NASDAQ",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 410.34,
    change: 1.25,
    volume: "28.7M",
    market: "NASDAQ",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.25,
    change: -0.75,
    volume: "25.3M",
    market: "NASDAQ",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 215.65,
    change: -2.48,
    volume: "38.9M",
    market: "NASDAQ",
  },
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2945.6,
    change: 1.75,
    volume: "1.2M",
    market: "NSE",
  },
];

const upcomingIPOs = [
  {
    company: "InnoTech Solutions",
    symbol: "INNO",
    sector: "Technology",
    priceRange: "$22-26",
    offerDate: "Sep 5, 2025",
    leadUnderwriter: "Morgan Stanley",
  },
  {
    company: "GreenEnergy Innovations",
    symbol: "GREN",
    sector: "Energy",
    priceRange: "$18-22",
    offerDate: "Sep 12, 2025",
    leadUnderwriter: "Goldman Sachs",
  },
  {
    company: "HealthTech Systems",
    symbol: "HLTH",
    sector: "Healthcare",
    priceRange: "$30-35",
    offerDate: "Sep 18, 2025",
    leadUnderwriter: "JP Morgan",
  },
  {
    company: "Quantum Computing Inc.",
    symbol: "QNTM",
    sector: "Technology",
    priceRange: "$40-45",
    offerDate: "Sep 25, 2025",
    leadUnderwriter: "Bank of America",
  },
];

export default function StockExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMarketTab, setActiveMarketTab] = useState("global");

  return (
    <div className="space-y-6">
      {/* Market Explorer Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Stock Market Explorer</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button size="sm">
                <Search className="h-4 w-4 mr-2" />
                Advanced Search
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks, companies, ETFs..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Global Markets Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Global Markets Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketData.map((market, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {market.icon}
                    <span className="font-medium ml-2">{market.name}</span>
                  </div>
                  <Badge variant="outline">{market.description}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {market.mainIndex}
                    </span>
                    <div
                      className={`flex items-center ${
                        market.change >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {market.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span>
                        {market.change >= 0 ? "+" : ""}
                        {market.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-semibold">
                    {market.currency}
                    {market.indexValue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Tabs: Trending, Sectors, IPOs */}
      <Tabs defaultValue="trending" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="trending" className="flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trending Stocks
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Sectors
          </TabsTrigger>
          <TabsTrigger value="ipos" className="flex items-center">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Upcoming IPOs
          </TabsTrigger>
        </TabsList>

        {/* Trending Stocks Tab */}
        <TabsContent value="trending">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hot Stocks Right Now</CardTitle>
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
                      <th className="text-right font-medium p-2">MARKET</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {trendingStocks.map((stock, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2 font-medium">{stock.symbol}</td>
                        <td className="p-2 text-sm">{stock.name}</td>
                        <td className="p-2 text-right">${stock.price}</td>
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
                              {stock.change}%
                            </span>
                          </div>
                        </td>
                        <td className="p-2 text-right text-muted-foreground">
                          {stock.volume}
                        </td>
                        <td className="p-2 text-right">
                          <Badge variant="outline" className="text-xs">
                            {stock.market}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View All Trending Stocks
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Sectors Tab */}
        <TabsContent value="sectors">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Market Sectors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sectorData.map((sector, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {sector.icon}
                        <h3 className="font-medium ml-2">{sector.name}</h3>
                      </div>
                      <Badge>{sector.companies} companies</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-semibold">
                        ${sector.value.toLocaleString()}
                      </div>
                      <div
                        className={`flex items-center ${
                          sector.change >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {sector.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        <span>
                          {sector.change >= 0 ? "+" : ""}
                          {sector.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View Sector Breakdown
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* IPOs Tab */}
        <TabsContent value="ipos">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Upcoming IPOs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-xs">
                      <th className="text-left font-medium p-2">COMPANY</th>
                      <th className="text-left font-medium p-2">SYMBOL</th>
                      <th className="text-left font-medium p-2">SECTOR</th>
                      <th className="text-right font-medium p-2">
                        PRICE RANGE
                      </th>
                      <th className="text-right font-medium p-2">OFFER DATE</th>
                      <th className="text-right font-medium p-2">
                        LEAD UNDERWRITER
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {upcomingIPOs.map((ipo, index) => (
                      <tr key={index} className="hover:bg-muted/50">
                        <td className="p-2 font-medium">{ipo.company}</td>
                        <td className="p-2">{ipo.symbol}</td>
                        <td className="p-2">{ipo.sector}</td>
                        <td className="p-2 text-right">{ipo.priceRange}</td>
                        <td className="p-2 text-right">{ipo.offerDate}</td>
                        <td className="p-2 text-right text-muted-foreground">
                          {ipo.leadUnderwriter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Data updated daily
              </div>
              <Button variant="outline" size="sm">
                IPO Calendar
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Featured Investment Ideas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Featured Investment Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                <Globe className="h-16 w-16 text-white/80" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">International Exposure</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Diversify your portfolio with global markets
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-green-500 to-green-700 flex items-center justify-center">
                <TrendingUp className="h-16 w-16 text-white/80" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Growth Stocks</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  High-potential companies with strong growth prospects
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-500 to-purple-700 flex items-center justify-center">
                <DollarSign className="h-16 w-16 text-white/80" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2">Dividend Income</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Stable companies with consistent dividend payouts
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
