"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  BarChart3,
  Star,
  ExternalLink,
  ArrowUpDown,
  Download,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  pe: number;
  pb: number;
  dividendYield: number;
  high52w: number;
  low52w: number;
  sector: string;
  exchange: string;
  isFavorite?: boolean;
}

interface StockScreenerProps {
  searchQuery: string;
}

// Mock Indian stock data - In production, replace with real API calls
const mockStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2750.45,
    change: 45.2,
    changePercent: 1.67,
    volume: 8542000,
    marketCap: 18564000000000,
    pe: 24.5,
    pb: 2.1,
    dividendYield: 0.85,
    high52w: 2968.0,
    low52w: 2220.3,
    sector: "Energy",
    exchange: "NSE",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4125.3,
    change: -25.75,
    changePercent: -0.62,
    volume: 2845000,
    marketCap: 15024000000000,
    pe: 28.7,
    pb: 12.4,
    dividendYield: 3.2,
    high52w: 4592.25,
    low52w: 3311.0,
    sector: "IT",
    exchange: "NSE",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    price: 1845.6,
    change: 12.85,
    changePercent: 0.7,
    volume: 5684000,
    marketCap: 7659000000000,
    pe: 25.8,
    pb: 8.9,
    dividendYield: 2.8,
    high52w: 1953.9,
    low52w: 1351.65,
    sector: "IT",
    exchange: "NSE",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    price: 1625.75,
    change: 8.45,
    changePercent: 0.52,
    volume: 12450000,
    marketCap: 12456000000000,
    pe: 18.9,
    pb: 2.8,
    dividendYield: 1.2,
    high52w: 1791.8,
    low52w: 1363.55,
    sector: "Banking",
    exchange: "NSE",
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    price: 1180.9,
    change: -5.3,
    changePercent: -0.45,
    volume: 8965000,
    marketCap: 8234000000000,
    pe: 16.2,
    pb: 2.4,
    dividendYield: 0.9,
    high52w: 1257.65,
    low52w: 895.4,
    sector: "Banking",
    exchange: "NSE",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    price: 2675.85,
    change: 18.9,
    changePercent: 0.71,
    volume: 1254000,
    marketCap: 6254000000000,
    pe: 55.7,
    pb: 12.8,
    dividendYield: 1.8,
    high52w: 2844.45,
    low52w: 2172.0,
    sector: "FMCG",
    exchange: "NSE",
  },
  {
    symbol: "ITC",
    name: "ITC Limited",
    price: 485.3,
    change: 2.15,
    changePercent: 0.44,
    volume: 15684000,
    marketCap: 6025000000000,
    pe: 26.4,
    pb: 4.2,
    dividendYield: 4.8,
    high52w: 497.95,
    low52w: 387.45,
    sector: "FMCG",
    exchange: "NSE",
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Limited",
    price: 1625.4,
    change: -12.85,
    changePercent: -0.78,
    volume: 4568000,
    marketCap: 9456000000000,
    pe: 22.8,
    pb: 3.6,
    dividendYield: 0.6,
    high52w: 1765.9,
    low52w: 900.05,
    sector: "Telecom",
    exchange: "NSE",
  },
];

const sectors = [
  "All",
  "Banking",
  "IT",
  "Energy",
  "FMCG",
  "Telecom",
  "Auto",
  "Pharma",
  "Metals",
];
const exchanges = ["All", "NSE", "BSE"];

export default function StockScreener({ searchQuery }: StockScreenerProps) {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>(mockStocks);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Stock;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter states
  const [filters, setFilters] = useState({
    sector: "All",
    exchange: "All",
    priceRange: [0, 5000] as [number, number],
    marketCapRange: [0, 20000000] as [number, number], // in crores
    peRange: [0, 100] as [number, number],
    pbRange: [0, 20] as [number, number],
    dividendYieldRange: [0, 10] as [number, number],
    minVolume: 0,
  });

  // Apply filters and search
  useEffect(() => {
    const filtered = stocks.filter((stock) => {
      // Search filter
      if (
        searchQuery &&
        !stock.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Sector filter
      if (filters.sector !== "All" && stock.sector !== filters.sector) {
        return false;
      }

      // Exchange filter
      if (filters.exchange !== "All" && stock.exchange !== filters.exchange) {
        return false;
      }

      // Price range
      if (
        stock.price < filters.priceRange[0] ||
        stock.price > filters.priceRange[1]
      ) {
        return false;
      }

      // Market cap range (convert to crores)
      const marketCapCrores = stock.marketCap / 10000000;
      if (
        marketCapCrores < filters.marketCapRange[0] ||
        marketCapCrores > filters.marketCapRange[1]
      ) {
        return false;
      }

      // PE range
      if (stock.pe < filters.peRange[0] || stock.pe > filters.peRange[1]) {
        return false;
      }

      // PB range
      if (stock.pb < filters.pbRange[0] || stock.pb > filters.pbRange[1]) {
        return false;
      }

      // Dividend yield range
      if (
        stock.dividendYield < filters.dividendYieldRange[0] ||
        stock.dividendYield > filters.dividendYieldRange[1]
      ) {
        return false;
      }

      // Minimum volume
      if (stock.volume < filters.minVolume) {
        return false;
      }

      return true;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null || bValue == null) return 0;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setFilteredStocks(filtered);
  }, [stocks, searchQuery, filters, sortConfig]);

  const handleSort = (key: keyof Stock) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const resetFilters = () => {
    setFilters({
      sector: "All",
      exchange: "All",
      priceRange: [0, 5000],
      marketCapRange: [0, 20000000],
      peRange: [0, 100],
      pbRange: [0, 20],
      dividendYieldRange: [0, 10],
      minVolume: 0,
    });
  };

  const refreshData = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // In real app, fetch fresh data from API
    setLoading(false);
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;
  const formatMarketCap = (cap: number) => `₹${(cap / 10000000).toFixed(0)} Cr`;
  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`;
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`;
    return volume.toLocaleString();
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const icon = isPositive ? TrendingUp : TrendingDown;
    const Icon = icon;

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-sm">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={loading}
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Sector Filter */}
            <div className="space-y-2">
              <Label>Sector</Label>
              <Select
                value={filters.sector}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sector: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Exchange Filter */}
            <div className="space-y-2">
              <Label>Exchange</Label>
              <Select
                value={filters.exchange}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, exchange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {exchanges.map((exchange) => (
                    <SelectItem key={exchange} value={exchange}>
                      {exchange}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Volume */}
            <div className="space-y-2">
              <Label>Min Volume</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minVolume}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    minVolume: Number(e.target.value) || 0,
                  }))
                }
              />
            </div>
          </div>

          <Separator />

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label>
                Price Range (₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                )
              </Label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: value as [number, number],
                  }))
                }
                max={5000}
                step={50}
                className="w-full"
              />
            </div>

            {/* Market Cap Range */}
            <div className="space-y-3">
              <Label>
                Market Cap (₹{(filters.marketCapRange[0] / 10000).toFixed(0)}K
                Cr - ₹{(filters.marketCapRange[1] / 10000).toFixed(0)}K Cr)
              </Label>
              <Slider
                value={filters.marketCapRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    marketCapRange: value as [number, number],
                  }))
                }
                max={20000000}
                step={1000000}
                className="w-full"
              />
            </div>

            {/* PE Range */}
            <div className="space-y-3">
              <Label>
                P/E Ratio ({filters.peRange[0]} - {filters.peRange[1]})
              </Label>
              <Slider
                value={filters.peRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    peRange: value as [number, number],
                  }))
                }
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* PB Range */}
            <div className="space-y-3">
              <Label>
                P/B Ratio ({filters.pbRange[0]} - {filters.pbRange[1]})
              </Label>
              <Slider
                value={filters.pbRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    pbRange: value as [number, number],
                  }))
                }
                max={20}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Dividend Yield Range */}
            <div className="space-y-3">
              <Label>
                Dividend Yield ({filters.dividendYieldRange[0]}% -{" "}
                {filters.dividendYieldRange[1]}%)
              </Label>
              <Slider
                value={filters.dividendYieldRange}
                onValueChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    dividendYieldRange: value as [number, number],
                  }))
                }
                max={10}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {filteredStocks.length} Stock
            {filteredStocks.length !== 1 ? "s" : ""} Found
          </h3>
          {searchQuery && (
            <Badge variant="secondary">Searching: "{searchQuery}"</Badge>
          )}
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stocks Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("symbol")}
                      className="h-auto p-0 font-semibold"
                    >
                      Symbol <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("price")}
                      className="h-auto p-0 font-semibold"
                    >
                      Price <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("changePercent")}
                      className="h-auto p-0 font-semibold"
                    >
                      Change <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("volume")}
                      className="h-auto p-0 font-semibold"
                    >
                      Volume <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("marketCap")}
                      className="h-auto p-0 font-semibold"
                    >
                      Market Cap <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("pe")}
                      className="h-auto p-0 font-semibold"
                    >
                      P/E <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("pb")}
                      className="h-auto p-0 font-semibold"
                    >
                      P/B <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("dividendYield")}
                      className="h-auto p-0 font-semibold"
                    >
                      Dividend <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.symbol} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{stock.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {stock.exchange}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stock.name}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(stock.price)}
                    </TableCell>
                    <TableCell>
                      {formatChange(stock.change, stock.changePercent)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatVolume(stock.volume)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatMarketCap(stock.marketCap)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {stock.pe.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {stock.pb.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {stock.dividendYield.toFixed(1)}%
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {stock.sector}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredStocks.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No stocks found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
