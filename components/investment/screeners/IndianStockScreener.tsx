"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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
import { indianStockService } from "@/lib/api/indianStockService";
import {
  IndianStockData,
  NSEStockData,
  BSEStockData,
  formatIndianCurrency,
  formatVolume,
} from "@/lib/types/indianStocks";

interface EnhancedStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  pb?: number;
  dividendYield?: number;
  high52w?: number;
  low52w?: number;
  sector?: string;
  exchange: "NSE" | "BSE";
  isFavorite?: boolean;
  lastUpdate: string;
}

interface ScreenerFilters {
  priceMin: number;
  priceMax: number;
  marketCapMin: number;
  marketCapMax: number;
  peMin: number;
  peMax: number;
  changeMin: number;
  changeMax: number;
  exchange: "ALL" | "NSE" | "BSE";
  sector: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface IndianStockScreenerProps {
  searchQuery?: string;
}

export default function IndianStockScreener({
  searchQuery = "",
}: IndianStockScreenerProps) {
  const [stocks, setStocks] = useState<EnhancedStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ScreenerFilters>({
    priceMin: 0,
    priceMax: 10000,
    marketCapMin: 0,
    marketCapMax: 500000,
    peMin: 0,
    peMax: 100,
    changeMin: -20,
    changeMax: 20,
    exchange: "ALL",
    sector: "ALL",
    sortBy: "marketCap",
    sortOrder: "desc",
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Popular Indian stocks for screening
  const popularStocks = [
    "RELIANCE",
    "TCS",
    "INFY",
    "HDFCBANK",
    "ICICIBANK",
    "SBIN",
    "LT",
    "ITC",
    "KOTAKBANK",
    "BAJFINANCE",
    "BHARTIARTL",
    "ASIANPAINT",
    "MARUTI",
    "HCLTECH",
    "HINDUNILVR",
    "WIPRO",
    "ADANIPORTS",
    "ULTRACEMCO",
    "TATAMOTORS",
    "POWERGRID",
  ];

  const loadStockData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const stockPromises = popularStocks.map(async (symbol) => {
        try {
          const stockData = await indianStockService.getIndianStock(symbol);
          if (stockData && stockData.exchange) {
            // Validate the stock data structure before converting
            if (stockData.exchange === "NSE") {
              const nseData = stockData as NSEStockData;
              if (!nseData.info && !nseData.priceInfo) {
                console.warn(
                  `Invalid NSE data structure for ${symbol}:`,
                  stockData
                );
                return null;
              }
            } else if (stockData.exchange === "BSE") {
              const bseData = stockData as BSEStockData;
              if (!bseData.symbol && !bseData.companyName) {
                console.warn(
                  `Invalid BSE data structure for ${symbol}:`,
                  stockData
                );
                return null;
              }
            }
            return convertToEnhancedStock(stockData);
          }
          return null;
        } catch (err) {
          console.error(`Error loading ${symbol}:`, err);
          return null;
        }
      });

      const results = await Promise.all(stockPromises);
      const validStocks = results.filter(
        (stock): stock is EnhancedStock => stock !== null
      );

      setStocks(validStocks);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load stock data"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const convertToEnhancedStock = (
    stockData: IndianStockData
  ): EnhancedStock => {
    if (stockData.exchange === "NSE") {
      const nseData = stockData as NSEStockData;
      return {
        symbol: nseData.info?.symbol || "N/A",
        name: nseData.info?.companyName || "Unknown Company",
        price: nseData.priceInfo?.lastPrice || 0,
        change: nseData.priceInfo?.change || 0,
        changePercent: nseData.priceInfo?.pChange || 0,
        volume: 0, // NSE doesn't provide volume in the current data structure
        sector:
          nseData.info?.industry || nseData.metadata?.industry || "Unknown",
        exchange: nseData.exchange,
        high52w: nseData.priceInfo?.weekHighLow?.max,
        low52w: nseData.priceInfo?.weekHighLow?.min,
        lastUpdate: nseData.lastUpdate || new Date().toISOString(),
      };
    } else {
      const bseData = stockData as BSEStockData;
      return {
        symbol: bseData.symbol || "N/A",
        name: bseData.companyName || "Unknown Company",
        price: bseData.currentPrice || 0,
        change: bseData.change || 0,
        changePercent: bseData.percentChange || 0,
        volume: bseData.volume || 0,
        exchange: bseData.exchange,
        lastUpdate: bseData.lastUpdate || new Date().toISOString(),
      };
    }
  };

  useEffect(() => {
    loadStockData();
  }, [loadStockData]);

  const filteredAndSortedStocks = useMemo(() => {
    const filtered = stocks.filter((stock) => {
      // Search filter
      if (
        searchQuery &&
        !stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Price filter
      if (stock.price < filters.priceMin || stock.price > filters.priceMax) {
        return false;
      }

      // Change filter
      if (
        stock.changePercent < filters.changeMin ||
        stock.changePercent > filters.changeMax
      ) {
        return false;
      }

      // Exchange filter
      if (filters.exchange !== "ALL" && stock.exchange !== filters.exchange) {
        return false;
      }

      // Sector filter
      if (filters.sector !== "ALL" && stock.sector !== filters.sector) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: number, bValue: number;

      switch (filters.sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "change":
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case "volume":
          aValue = a.volume || 0;
          bValue = b.volume || 0;
          break;
        default:
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
      }

      return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [stocks, filters, searchQuery]);

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  const getSectorOptions = () => {
    const sectors = new Set(
      stocks.map((stock) => stock.sector).filter(Boolean)
    );
    return Array.from(sectors);
  };

  const exportToCSV = () => {
    const headers = [
      "Symbol",
      "Name",
      "Price",
      "Change%",
      "Volume",
      "Exchange",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredAndSortedStocks.map((stock) =>
        [
          stock.symbol,
          `"${stock.name}"`,
          stock.price,
          stock.changePercent,
          stock.volume || 0,
          stock.exchange,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "indian-stocks-screener.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center">
                <BarChart3 className="h-6 w-6 mr-2 text-blue-600" />
                Indian Stock Screener
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Screen and filter BSE/NSE stocks with real-time data
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={loadStockData}
                disabled={loading}
                variant="outline"
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Exchange and Sector Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Exchange</Label>
              <Select
                value={filters.exchange}
                onValueChange={(value: "ALL" | "NSE" | "BSE") =>
                  setFilters((prev) => ({ ...prev, exchange: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Exchanges</SelectItem>
                  <SelectItem value="NSE">NSE</SelectItem>
                  <SelectItem value="BSE">BSE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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
                  <SelectItem value="ALL">All Sectors</SelectItem>
                  {getSectorOptions().map((sector) => (
                    <SelectItem key={sector} value={sector || ""}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sort By</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, sortBy: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change">Change %</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Range Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Price Range (₹)</Label>
              <div className="px-3 py-4">
                <Slider
                  value={[filters.priceMin, filters.priceMax]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      priceMin: min,
                      priceMax: max,
                    }))
                  }
                  max={10000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>₹{filters.priceMin}</span>
                  <span>₹{filters.priceMax}</span>
                </div>
              </div>
            </div>

            <div>
              <Label>Change Range (%)</Label>
              <div className="px-3 py-4">
                <Slider
                  value={[filters.changeMin, filters.changeMax]}
                  onValueChange={([min, max]) =>
                    setFilters((prev) => ({
                      ...prev,
                      changeMin: min,
                      changeMax: max,
                    }))
                  }
                  max={20}
                  min={-20}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{filters.changeMin}%</span>
                  <span>{filters.changeMax}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Screening Results ({filteredAndSortedStocks.length} stocks)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
                }))
              }
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              {filters.sortOrder === "asc" ? "Ascending" : "Descending"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3">Loading Indian stocks...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Error loading stocks</div>
              <div className="text-sm text-gray-500">{error}</div>
              <Button
                onClick={loadStockData}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Exchange</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>52W Range</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedStocks.map((stock) => (
                    <TableRow
                      key={`${stock.symbol}_${stock.exchange}`}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(stock.symbol)}
                          className="p-1"
                        >
                          <Star
                            className={cn(
                              "h-4 w-4",
                              favorites.has(stock.symbol)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            )}
                          />
                        </Button>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">{stock.symbol}</div>
                      </TableCell>

                      <TableCell>
                        <div className="max-w-xs truncate" title={stock.name}>
                          {stock.name}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          className={cn(
                            "text-xs",
                            stock.exchange === "NSE"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-orange-100 text-orange-800"
                          )}
                        >
                          {stock.exchange}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium">
                          {formatIndianCurrency(stock.price)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            stock.changePercent >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          )}
                        >
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          <span>
                            {stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {stock.volume ? formatVolume(stock.volume) : "N/A"}
                      </TableCell>

                      <TableCell>
                        {stock.high52w && stock.low52w ? (
                          <div className="text-xs">
                            <div className="text-green-600">
                              H: {formatIndianCurrency(stock.high52w)}
                            </div>
                            <div className="text-red-600">
                              L: {formatIndianCurrency(stock.low52w)}
                            </div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="text-sm">{stock.sector || "N/A"}</div>
                      </TableCell>

                      <TableCell>
                        <Button variant="ghost" size="sm" className="p-1">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredAndSortedStocks.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No stocks match your current filter criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
