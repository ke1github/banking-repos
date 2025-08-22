"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  exchange: string;
}

interface StockSearchBarProps {
  onStockSelect: (stock: string) => void;
}

const mockStocks: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2750.45,
    change: 45.2,
    changePercent: 1.67,
    volume: 8542000,
    marketCap: 18564000000000,
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
    sector: "Banking",
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
    sector: "IT",
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
    sector: "Telecom",
    exchange: "NSE",
  },
];

const trendingStocks = ["RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK"];
const recentSearches = ["RELIANCE", "TCS", "HINDUNILVR"];

export default function StockSearchBar({ onStockSelect }: StockSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState<Stock[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockStocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
      setIsOpen(true);
    } else {
      setFilteredStocks([]);
      setIsOpen(false);
    }
  }, [searchQuery]);

  const handleStockSelect = (stock: Stock) => {
    setSearchQuery(`${stock.symbol} - ${stock.name}`);
    setIsOpen(false);
    onStockSelect(stock.symbol);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
  };

  const formatPrice = (price: number) => `₹${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <span
        className={cn(
          "flex items-center gap-1",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {isPositive ? "+" : ""}
        {change.toFixed(2)} ({isPositive ? "+" : ""}
        {changePercent.toFixed(2)}%)
      </span>
    );
  };

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search stocks by symbol, name, or sector (e.g., RELIANCE, TCS, Banking)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsOpen(true)}
                className="pl-10 pr-10 h-12 text-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 max-h-96 overflow-y-auto">
                {searchQuery.trim() ? (
                  filteredStocks.length > 0 ? (
                    <div className="p-2">
                      <div className="text-sm font-medium text-gray-700 mb-2 px-2">
                        Search Results ({filteredStocks.length})
                      </div>
                      {filteredStocks.map((stock) => (
                        <div
                          key={stock.symbol}
                          onClick={() => handleStockSelect(stock)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-blue-600">
                                {stock.symbol}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {stock.exchange}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {stock.sector}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {stock.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formatPrice(stock.price)}
                            </div>
                            <div className="text-sm">
                              {formatChange(stock.change, stock.changePercent)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>No stocks found for "{searchQuery}"</p>
                      <p className="text-sm mt-1">
                        Try searching by symbol, company name, or sector
                      </p>
                    </div>
                  )
                ) : (
                  <div className="p-4 space-y-4">
                    {/* Trending Stocks */}
                    <div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                        <Zap className="h-4 w-4 text-orange-500" />
                        Trending Stocks
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {trendingStocks.map((symbol) => {
                          const stock = mockStocks.find(
                            (s) => s.symbol === symbol
                          );
                          if (!stock) return null;
                          return (
                            <div
                              key={symbol}
                              onClick={() => handleStockSelect(stock)}
                              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-blue-600">
                                  {stock.symbol}
                                </span>
                                <span className="text-sm text-gray-600 truncate">
                                  {stock.name}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">
                                  {formatPrice(stock.price)}
                                </div>
                                <div className="text-xs">
                                  {formatChange(
                                    stock.change,
                                    stock.changePercent
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                          <Clock className="h-4 w-4 text-gray-500" />
                          Recent Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((symbol) => {
                            const stock = mockStocks.find(
                              (s) => s.symbol === symbol
                            );
                            if (!stock) return null;
                            return (
                              <Button
                                key={symbol}
                                variant="outline"
                                size="sm"
                                onClick={() => handleStockSelect(stock)}
                                className="text-xs"
                              >
                                {symbol}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+12.4%</div>
              <div className="text-sm text-gray-600">Nifty 50</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">+8.7%</div>
              <div className="text-sm text-gray-600">Sensex</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2,847</div>
              <div className="text-sm text-gray-600">Stocks Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₹45.2Cr</div>
              <div className="text-sm text-gray-600">Avg Volume</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
