"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Plus,
  Minus,
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
import {
  DetailedStock,
  convertToDetailedStock,
} from "@/lib/types/enhancedStockTypes";
import StockDetailsPanel from "@/components/investment/StockDetailsPanel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScreenerFilters {
  priceMin: number;
  priceMax: number;
  marketCapMin: number;
  marketCapMax: number;
  peMin: number;
  peMax: number;
  pbMin: number;
  pbMax: number;
  roeMin: number;
  roeMax: number;
  dividendYieldMin: number;
  dividendYieldMax: number;
  debtToEquityMin: number;
  debtToEquityMax: number;
  changeMin: number;
  changeMax: number;
  exchange: "ALL" | "NSE" | "BSE";
  sector: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface EnhancedIndianStockScreenerProps {
  searchQuery?: string;
}

export default function EnhancedIndianStockScreener({
  searchQuery = "",
}: EnhancedIndianStockScreenerProps) {
  const [stocks, setStocks] = useState<DetailedStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedStock, setSelectedStock] = useState<DetailedStock | null>(
    null
  );
  const [showBasicRatios, setShowBasicRatios] = useState(true);
  const [showAdvancedRatios, setShowAdvancedRatios] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [filters, setFilters] = useState<ScreenerFilters>({
    priceMin: 0,
    priceMax: 10000,
    marketCapMin: 0,
    marketCapMax: 500000,
    peMin: 0,
    peMax: 100,
    pbMin: 0,
    pbMax: 10,
    roeMin: 0,
    roeMax: 50,
    dividendYieldMin: 0,
    dividendYieldMax: 10,
    debtToEquityMin: 0,
    debtToEquityMax: 3,
    changeMin: -20,
    changeMax: 20,
    exchange: "ALL",
    sector: "ALL",
    sortBy: "marketCap",
    sortOrder: "desc",
  });

  // Popular Indian stocks for screening - expanded list
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
    "TITAN",
    "AXISBANK",
    "SUNPHARMA",
    "TATASTEEL",
    "ONGC",
    "NTPC",
    "BAJAJFINSV",
    "INDUSINDBK",
    "GRASIM",
    "TECHM",
    "HINDALCO",
    "ADANIPOWER",
    "TATAPOWER",
    "JSWSTEEL",
  ];

  const loadStockData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("Loading Indian stock data...");

      const stockPromises = popularStocks.map(async (symbol) => {
        try {
          console.log(`Fetching data for ${symbol}...`);
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
                // Return mock data for invalid structure
                return createMockDetailedStock(symbol, "NSE");
              }
            } else if (stockData.exchange === "BSE") {
              const bseData = stockData as BSEStockData;
              if (!bseData.symbol && !bseData.companyName) {
                console.warn(
                  `Invalid BSE data structure for ${symbol}:`,
                  stockData
                );
                // Return mock data for invalid structure
                return createMockDetailedStock(symbol, "BSE");
              }
            }
            console.log(`Successfully processed data for ${symbol}`);
            return convertToDetailedStock(stockData, true);
          } else {
            console.warn(`No data received for ${symbol}, creating mock data`);
            return createMockDetailedStock(symbol, "NSE");
          }
        } catch (err) {
          console.error(`Error loading ${symbol}:`, err);
          // Return mock data on error
          return createMockDetailedStock(symbol, "NSE");
        }
      });

      const results = await Promise.all(stockPromises);
      const validStocks = results.filter(
        (stock): stock is DetailedStock => stock !== null
      );

      console.log(`Successfully loaded ${validStocks.length} stocks`);
      setStocks(validStocks);
    } catch (err) {
      console.error("Failed to load stock data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load stock data"
      );

      // Create fallback mock data
      const mockStocks = popularStocks
        .map((symbol) => createMockDetailedStock(symbol, "NSE"))
        .filter(Boolean) as DetailedStock[];
      setStocks(mockStocks);
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to create mock detailed stock data
  const createMockDetailedStock = (
    symbol: string,
    exchange: "NSE" | "BSE"
  ): DetailedStock => {
    const basePrice = Math.floor(Math.random() * 2000) + 100;
    const change = Math.random() * 40 - 20; // -20 to +20
    const changePercent = (change / basePrice) * 100;

    const companyNames: { [key: string]: string } = {
      RELIANCE: "Reliance Industries Ltd",
      TCS: "Tata Consultancy Services",
      INFY: "Infosys Limited",
      HDFCBANK: "HDFC Bank Limited",
      ICICIBANK: "ICICI Bank Limited",
      SBIN: "State Bank of India",
      LT: "Larsen & Toubro Limited",
      ITC: "ITC Limited",
      KOTAKBANK: "Kotak Mahindra Bank",
      BAJFINANCE: "Bajaj Finance Limited",
      BHARTIARTL: "Bharti Airtel Limited",
      ASIANPAINT: "Asian Paints Limited",
      MARUTI: "Maruti Suzuki India",
      HCLTECH: "HCL Technologies",
      HINDUNILVR: "Hindustan Unilever",
      WIPRO: "Wipro Limited",
      ADANIPORTS: "Adani Ports & SEZ",
      ULTRACEMCO: "UltraTech Cement",
      TATAMOTORS: "Tata Motors Limited",
      POWERGRID: "Power Grid Corporation",
      TATAPOWER: "Tata Power Co. Ltd.",
    };

    const sectors: { [key: string]: string } = {
      RELIANCE: "Energy",
      TCS: "Information Technology",
      INFY: "Information Technology",
      HDFCBANK: "Banking",
      ICICIBANK: "Banking",
      SBIN: "Banking",
      LT: "Construction",
      ITC: "FMCG",
      KOTAKBANK: "Banking",
      BAJFINANCE: "Financial Services",
      BHARTIARTL: "Telecommunications",
      ASIANPAINT: "Chemicals",
      MARUTI: "Automobile",
      HCLTECH: "Information Technology",
      HINDUNILVR: "FMCG",
      WIPRO: "Information Technology",
      ADANIPORTS: "Infrastructure",
      ULTRACEMCO: "Cement",
      TATAMOTORS: "Automobile",
      POWERGRID: "Power",
      TATAPOWER: "Power",
    };

    // Generate appropriate financial ratios based on sector
    const sector = sectors[symbol] || "Diversified";
    let pe = 0,
      pb = 0,
      roe = 0,
      roce = 0,
      debtToEquity = 0,
      dividendYield = 0;

    switch (sector) {
      case "Information Technology":
        pe = Math.random() * 10 + 20; // 20-30
        pb = Math.random() * 3 + 4; // 4-7
        roe = Math.random() * 10 + 15; // 15-25
        roce = roe * (Math.random() * 0.2 + 0.9); // Slightly lower than ROE
        debtToEquity = Math.random() * 0.3; // Low debt
        dividendYield = Math.random() * 1.5 + 1; // 1-2.5%
        break;
      case "Banking":
      case "Financial Services":
        pe = Math.random() * 8 + 12; // 12-20
        pb = Math.random() * 1 + 1; // 1-2
        roe = Math.random() * 6 + 10; // 10-16
        roce = roe * (Math.random() * 0.2 + 0.8);
        debtToEquity = Math.random() * 4 + 6; // High debt is normal
        dividendYield = Math.random() * 1.5 + 0.5; // 0.5-2%
        break;
      case "Energy":
      case "Power":
        pe = Math.random() * 7 + 8; // 8-15
        pb = Math.random() * 1 + 1; // 1-2
        roe = Math.random() * 7 + 8; // 8-15
        roce = roe * (Math.random() * 0.2 + 0.8);
        debtToEquity = Math.random() * 0.7 + 0.8; // 0.8-1.5
        dividendYield = Math.random() * 3 + 3; // 3-6%
        break;
      default:
        pe = Math.random() * 15 + 15; // 15-30
        pb = Math.random() * 3 + 1; // 1-4
        roe = Math.random() * 10 + 10; // 10-20
        roce = roe * (Math.random() * 0.2 + 0.8);
        debtToEquity = Math.random() * 1 + 0.5; // 0.5-1.5
        dividendYield = Math.random() * 2 + 1; // 1-3%
    }

    return {
      symbol,
      name: companyNames[symbol] || `${symbol} Limited`,
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 100000,
      marketCap: basePrice * (Math.floor(Math.random() * 10000000) + 1000000),
      sector: sectors[symbol] || "Diversified",
      exchange,
      high52w: basePrice * (1.2 + Math.random() * 0.5),
      low52w: basePrice * (0.6 + Math.random() * 0.3),
      lastUpdate: new Date().toISOString(),
      financials: {
        pe: Math.round(pe * 10) / 10,
        pb: Math.round(pb * 10) / 10,
        roe: Math.round(roe * 10) / 10,
        roce: Math.round(roce * 10) / 10,
        debtToEquity: Math.round(debtToEquity * 100) / 100,
        dividendYield: Math.round(dividendYield * 10) / 10,
        // Mock data for other financials would be added by the convertToDetailedStock function
      },
    };
  };

  useEffect(() => {
    loadStockData();
  }, []); // Only run once on component mount

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

      // Basic filters
      if (stock.price < filters.priceMin || stock.price > filters.priceMax) {
        return false;
      }

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

      // Financial ratio filters
      if (showBasicRatios || showAdvancedRatios) {
        // PE filter
        if (
          stock.financials.pe &&
          (stock.financials.pe < filters.peMin ||
            stock.financials.pe > filters.peMax)
        ) {
          return false;
        }

        if (showAdvancedRatios) {
          // PB filter
          if (
            stock.financials.pb &&
            (stock.financials.pb < filters.pbMin ||
              stock.financials.pb > filters.pbMax)
          ) {
            return false;
          }

          // ROE filter
          if (
            stock.financials.roe &&
            (stock.financials.roe < filters.roeMin ||
              stock.financials.roe > filters.roeMax)
          ) {
            return false;
          }

          // Dividend Yield filter
          if (
            stock.financials.dividendYield &&
            (stock.financials.dividendYield < filters.dividendYieldMin ||
              stock.financials.dividendYield > filters.dividendYieldMax)
          ) {
            return false;
          }

          // Debt to Equity filter
          if (
            stock.financials.debtToEquity &&
            (stock.financials.debtToEquity < filters.debtToEquityMin ||
              stock.financials.debtToEquity > filters.debtToEquityMax)
          ) {
            return false;
          }
        }
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
        case "pe":
          aValue = a.financials.pe || 0;
          bValue = b.financials.pe || 0;
          break;
        case "pb":
          aValue = a.financials.pb || 0;
          bValue = b.financials.pb || 0;
          break;
        case "roe":
          aValue = a.financials.roe || 0;
          bValue = b.financials.roe || 0;
          break;
        case "dividendYield":
          aValue = a.financials.dividendYield || 0;
          bValue = b.financials.dividendYield || 0;
          break;
        default:
          aValue = a.marketCap || 0;
          bValue = b.marketCap || 0;
      }

      return filters.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [stocks, filters, searchQuery, showBasicRatios, showAdvancedRatios]);

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
      "Exchange",
      "Price",
      "Change%",
      "Volume",
      "Market Cap",
      "P/E",
      "P/B",
      "ROE",
      "Div. Yield",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredAndSortedStocks.map((stock) =>
        [
          stock.symbol,
          `"${stock.name}"`,
          stock.exchange,
          stock.price,
          stock.changePercent,
          stock.volume || 0,
          stock.marketCap || 0,
          stock.financials.pe || "N/A",
          stock.financials.pb || "N/A",
          stock.financials.roe || "N/A",
          stock.financials.dividendYield || "N/A",
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

  const viewStockDetails = (stock: DetailedStock) => {
    setSelectedStock(stock);
  };

  const closeStockDetails = () => {
    setSelectedStock(null);
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Stock Screener
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={loadStockData}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={cn("h-4 w-4 mr-2", loading && "animate-spin")}
                />
                Refresh
              </Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible defaultValue="filters">
            <AccordionItem value="filters">
              <AccordionTrigger className="text-base font-semibold">
                Stock Filters
              </AccordionTrigger>
              <AccordionContent>
                {/* Exchange and Sector Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                        <SelectItem value="marketCap">Market Cap</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="change">Change %</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="pe">P/E Ratio</SelectItem>
                        <SelectItem value="pb">P/B Ratio</SelectItem>
                        <SelectItem value="roe">ROE %</SelectItem>
                        <SelectItem value="dividendYield">
                          Dividend Yield
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Range Filters */}
                <div className="space-y-6">
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

                  {/* Ratio Filters Toggle */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Button
                          variant={showBasicRatios ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowBasicRatios(!showBasicRatios)}
                          className="mr-2"
                        >
                          {showBasicRatios ? (
                            <Minus className="h-4 w-4 mr-1" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          Basic Ratios
                        </Button>

                        <Button
                          variant={showAdvancedRatios ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setShowAdvancedRatios(!showAdvancedRatios)
                          }
                        >
                          {showAdvancedRatios ? (
                            <Minus className="h-4 w-4 mr-1" />
                          ) : (
                            <Plus className="h-4 w-4 mr-1" />
                          )}
                          Advanced Ratios
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            sortOrder:
                              prev.sortOrder === "asc" ? "desc" : "asc",
                          }))
                        }
                      >
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        {filters.sortOrder === "asc"
                          ? "Ascending"
                          : "Descending"}
                      </Button>
                    </div>

                    {/* Basic Ratio Filters */}
                    {showBasicRatios && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                          <Label>P/E Ratio Range</Label>
                          <div className="px-3 py-4">
                            <Slider
                              value={[filters.peMin, filters.peMax]}
                              onValueChange={([min, max]) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  peMin: min,
                                  peMax: max,
                                }))
                              }
                              max={100}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{filters.peMin}</span>
                              <span>{filters.peMax}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Advanced Ratio Filters */}
                    {showAdvancedRatios && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        <div>
                          <Label>P/B Ratio Range</Label>
                          <div className="px-3 py-4">
                            <Slider
                              value={[filters.pbMin, filters.pbMax]}
                              onValueChange={([min, max]) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  pbMin: min,
                                  pbMax: max,
                                }))
                              }
                              max={10}
                              min={0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{filters.pbMin}</span>
                              <span>{filters.pbMax}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>ROE Range (%)</Label>
                          <div className="px-3 py-4">
                            <Slider
                              value={[filters.roeMin, filters.roeMax]}
                              onValueChange={([min, max]) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  roeMin: min,
                                  roeMax: max,
                                }))
                              }
                              max={50}
                              min={0}
                              step={1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{filters.roeMin}%</span>
                              <span>{filters.roeMax}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Dividend Yield Range (%)</Label>
                          <div className="px-3 py-4">
                            <Slider
                              value={[
                                filters.dividendYieldMin,
                                filters.dividendYieldMax,
                              ]}
                              onValueChange={([min, max]) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  dividendYieldMin: min,
                                  dividendYieldMax: max,
                                }))
                              }
                              max={10}
                              min={0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{filters.dividendYieldMin}%</span>
                              <span>{filters.dividendYieldMax}%</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label>Debt/Equity Ratio Range</Label>
                          <div className="px-3 py-4">
                            <Slider
                              value={[
                                filters.debtToEquityMin,
                                filters.debtToEquityMax,
                              ]}
                              onValueChange={([min, max]) =>
                                setFilters((prev) => ({
                                  ...prev,
                                  debtToEquityMin: min,
                                  debtToEquityMax: max,
                                }))
                              }
                              max={3}
                              min={0}
                              step={0.1}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                              <span>{filters.debtToEquityMin}</span>
                              <span>{filters.debtToEquityMax}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Stock Details Panel */}
      {selectedStock && (
        <div className="mb-6 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10"
            onClick={closeStockDetails}
          >
            <X className="h-4 w-4" />
          </Button>
          <StockDetailsPanel stock={selectedStock} />
        </div>
      )}

      {/* Results */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Screening Results ({filteredAndSortedStocks.length} stocks)
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
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
                    <TableHead className="text-center">Exchange</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Change</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">P/E</TableHead>
                    {showAdvancedRatios && (
                      <>
                        <TableHead className="text-right">P/B</TableHead>
                        <TableHead className="text-right">ROE</TableHead>
                        <TableHead className="text-right">Div Yield</TableHead>
                        <TableHead className="text-right">
                          Debt/Equity
                        </TableHead>
                      </>
                    )}
                    <TableHead className="text-center w-12">View</TableHead>
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

                      <TableCell className="text-center">
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

                      <TableCell className="text-right">
                        <div className="font-medium">
                          {formatIndianCurrency(stock.price)}
                        </div>
                      </TableCell>

                      <TableCell className="text-right">
                        <div
                          className={cn(
                            "flex items-center gap-1 justify-end",
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

                      <TableCell className="text-right">
                        {stock.marketCap
                          ? formatIndianCurrency(stock.marketCap)
                          : "N/A"}
                      </TableCell>

                      <TableCell className="text-right">
                        {stock.financials.pe
                          ? stock.financials.pe.toFixed(2)
                          : "N/A"}
                      </TableCell>

                      {showAdvancedRatios && (
                        <>
                          <TableCell className="text-right">
                            {stock.financials.pb
                              ? stock.financials.pb.toFixed(2)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {stock.financials.roe
                              ? stock.financials.roe.toFixed(2) + "%"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {stock.financials.dividendYield
                              ? stock.financials.dividendYield.toFixed(2) + "%"
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {stock.financials.debtToEquity
                              ? stock.financials.debtToEquity.toFixed(2)
                              : "N/A"}
                          </TableCell>
                        </>
                      )}

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-1"
                          onClick={() => viewStockDetails(stock)}
                        >
                          <Info className="h-4 w-4" />
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
