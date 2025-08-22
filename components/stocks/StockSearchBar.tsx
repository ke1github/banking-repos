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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStockSearch, useStockQuote } from "@/lib/hooks/useStockData";
import type { StockQuote, StockSearchResult } from "@/lib/api/types";

interface StockSearchBarProps {
  onStockSelect: (stock: string) => void;
}

const trendingStocks = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"];
const recentSearches = ["AAPL", "GOOGL", "MSFT"];

export default function StockSearchBar({ onStockSelect }: StockSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(
    null
  );
  const searchRef = useRef<HTMLDivElement>(null);

  // Use the real-time search hook
  const {
    results: searchResults,
    loading,
    error,
    searchStocks,
  } = useStockSearch();

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
    if (searchQuery.trim().length > 1) {
      setIsOpen(true);
      searchStocks(searchQuery);
    } else {
      setIsOpen(false);
    }
  }, [searchQuery, searchStocks]);

  const handleStockSelect = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setSearchQuery(`${stock.symbol} - ${stock.name}`);
    setIsOpen(false);
    onStockSelect(stock.symbol);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSelectedStock(null);
    setIsOpen(false);
    onStockSelect("");
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <span
        className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <TrendingDown className="h-4 w-4" />
        )}
        {change >= 0 ? "+" : ""}
        {change.toFixed(2)} ({changePercent.toFixed(2)}%)
      </span>
    );
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  return (
    <div className="relative" ref={searchRef}>
      <Card className="border-2 border-blue-200 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search stocks by symbol, name, or sector..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-12 h-12 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-600">
                  Trending:
                </span>
              </div>
              {trendingStocks.map((symbol) => (
                <Badge
                  key={symbol}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => setSearchQuery(symbol)}
                >
                  {symbol}
                </Badge>
              ))}
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-600">
                    Recent:
                  </span>
                </div>
                {recentSearches.map((symbol) => (
                  <Badge
                    key={symbol}
                    variant="secondary"
                    className="cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setSearchQuery(symbol)}
                  >
                    {symbol}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 border-2 border-blue-200 shadow-xl bg-white max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {loading && (
              <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Searching stocks...</span>
              </div>
            )}

            {error && (
              <div className="p-6 text-center text-red-600">
                <p>Error loading search results</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
            )}

            {searchResults && searchResults.length > 0 && (
              <div className="divide-y divide-gray-200">
                {searchResults.slice(0, 8).map((stock: StockSearchResult) => (
                  <div
                    key={stock.symbol}
                    className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                    onClick={() => handleStockSelect(stock)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {stock.symbol}
                            </h4>
                            <p className="text-sm text-gray-600 truncate max-w-xs">
                              {stock.name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {stock.exchange}
                          </Badge>
                          {stock.sector && (
                            <Badge variant="secondary" className="text-xs">
                              {stock.sector}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {stock.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {stock.currency}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Click to select
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {searchQuery.length > 1 &&
              !loading &&
              searchResults?.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  <p>No stocks found for "{searchQuery}"</p>
                  <p className="text-sm mt-1">
                    Try searching with different keywords
                  </p>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
