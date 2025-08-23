"use client";

import React, { useState } from "react";
import { Search, TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIndianStockSearch } from "@/lib/hooks/useIndianStocks";
import { IndianStockSearch } from "@/lib/types/indianStocks";

interface IndianStockSearchProps {
  onStockSelect?: (stock: IndianStockSearch) => void;
  placeholder?: string;
  showExchangeBadges?: boolean;
}

export default function IndianStockSearchComponent({
  onStockSelect,
  placeholder = "Search Indian stocks (NSE/BSE)...",
  showExchangeBadges = true,
}: IndianStockSearchProps) {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { results, loading } = useIndianStockSearch(query);

  const handleStockSelect = (stock: IndianStockSearch) => {
    setQuery(stock.symbol);
    setShowResults(false);
    onStockSelect?.(stock);
  };

  const getExchangeBadgeColor = (exchange: "NSE" | "BSE") => {
    return exchange === "NSE"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";
  };

  const popularStocks = [
    {
      symbol: "RELIANCE",
      name: "Reliance Industries",
      exchange: "NSE" as const,
      type: "equity" as const,
    },
    {
      symbol: "TCS",
      name: "Tata Consultancy Services",
      exchange: "NSE" as const,
      type: "equity" as const,
    },
    {
      symbol: "INFY",
      name: "Infosys Limited",
      exchange: "NSE" as const,
      type: "equity" as const,
    },
    {
      symbol: "HDFCBANK",
      name: "HDFC Bank",
      exchange: "NSE" as const,
      type: "equity" as const,
    },
    {
      symbol: "ICICIBANK",
      name: "ICICI Bank",
      exchange: "NSE" as const,
      type: "equity" as const,
    },
  ];

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showResults && (query.length > 0 || results.length === 0) && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-auto shadow-lg">
          <CardContent className="p-0">
            {loading && (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                <span className="ml-2">Searching Indian stocks...</span>
              </div>
            )}

            {!loading && results.length === 0 && query.length > 0 && (
              <div className="p-4 text-center text-gray-500">
                No stocks found for "{query}"
              </div>
            )}

            {!loading && results.length === 0 && query.length === 0 && (
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Popular Indian Stocks
                </h4>
                <div className="space-y-2">
                  {popularStocks.map((stock) => (
                    <Button
                      key={stock.symbol}
                      variant="ghost"
                      className="w-full justify-start p-2 h-auto"
                      onClick={() => handleStockSelect(stock)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-3">
                          <div className="text-left">
                            <div className="font-medium text-gray-900">
                              {stock.symbol}
                            </div>
                            <div className="text-sm text-gray-500">
                              {stock.name}
                            </div>
                          </div>
                        </div>
                        {showExchangeBadges && (
                          <Badge
                            className={`text-xs ${getExchangeBadgeColor(
                              stock.exchange
                            )}`}
                          >
                            {stock.exchange}
                          </Badge>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="max-h-80 overflow-auto">
                {results.map((stock, index) => (
                  <Button
                    key={`${stock.symbol}_${stock.exchange}_${index}`}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto border-b border-gray-100 last:border-b-0"
                    onClick={() => handleStockSelect(stock)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            {stock.symbol}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {stock.name}
                          </div>
                          {stock.industry && (
                            <div className="text-xs text-gray-400">
                              {stock.industry}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {showExchangeBadges && (
                          <Badge
                            className={`text-xs ${getExchangeBadgeColor(
                              stock.exchange
                            )}`}
                          >
                            {stock.exchange}
                          </Badge>
                        )}
                        {stock.securityCode && (
                          <Badge variant="outline" className="text-xs">
                            {stock.securityCode}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
