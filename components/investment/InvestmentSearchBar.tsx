"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchSuggestion {
  id: string;
  symbol: string;
  name: string;
  category: string;
  price?: number;
  change?: number;
  changePercent?: number;
  isFavorite?: boolean;
  exchange?: string;
  sector?: string;
}

interface InvestmentSearchBarProps {
  onSearch: (query: string) => void;
  onSelect?: (suggestion: SearchSuggestion) => void;
  placeholder?: string;
  category: string;
  className?: string;
  showFilters?: boolean;
}

// Mock data for different categories - In real implementation, this would come from APIs
const mockSuggestions: Record<string, SearchSuggestion[]> = {
  stocks: [
    {
      id: "RELIANCE",
      symbol: "RELIANCE",
      name: "Reliance Industries Ltd",
      category: "stocks",
      price: 2750.45,
      change: 45.2,
      changePercent: 1.67,
      exchange: "NSE",
      sector: "Energy",
    },
    {
      id: "TCS",
      symbol: "TCS",
      name: "Tata Consultancy Services",
      category: "stocks",
      price: 4125.3,
      change: -25.75,
      changePercent: -0.62,
      exchange: "NSE",
      sector: "IT",
    },
    {
      id: "INFY",
      symbol: "INFY",
      name: "Infosys Limited",
      category: "stocks",
      price: 1845.6,
      change: 12.85,
      changePercent: 0.7,
      exchange: "NSE",
      sector: "IT",
    },
    {
      id: "HDFCBANK",
      symbol: "HDFCBANK",
      name: "HDFC Bank Limited",
      category: "stocks",
      price: 1625.75,
      change: 8.45,
      changePercent: 0.52,
      exchange: "NSE",
      sector: "Banking",
    },
    {
      id: "ICICIBANK",
      symbol: "ICICIBANK",
      name: "ICICI Bank Limited",
      category: "stocks",
      price: 1180.9,
      change: -5.3,
      changePercent: -0.45,
      exchange: "NSE",
      sector: "Banking",
    },
  ],
  "mutual-funds": [
    {
      id: "AXIS_BLUECHIP",
      symbol: "AXIS_BLUECHIP",
      name: "Axis Bluechip Fund",
      category: "mutual-funds",
      price: 45.67,
      change: 0.23,
      changePercent: 0.51,
      sector: "Large Cap",
    },
    {
      id: "SBI_LARGE_CAP",
      symbol: "SBI_LARGE_CAP",
      name: "SBI Large Cap Fund",
      category: "mutual-funds",
      price: 62.34,
      change: 0.45,
      changePercent: 0.73,
      sector: "Large Cap",
    },
    {
      id: "HDFC_TOP_100",
      symbol: "HDFC_TOP_100",
      name: "HDFC Top 100 Fund",
      category: "mutual-funds",
      price: 78.92,
      change: -0.12,
      changePercent: -0.15,
      sector: "Large Cap",
    },
  ],
  crypto: [
    {
      id: "BTC",
      symbol: "BTC",
      name: "Bitcoin",
      category: "crypto",
      price: 4350000,
      change: 125000,
      changePercent: 2.95,
      exchange: "Global",
    },
    {
      id: "ETH",
      symbol: "ETH",
      name: "Ethereum",
      category: "crypto",
      price: 285000,
      change: -8500,
      changePercent: -2.89,
      exchange: "Global",
    },
    {
      id: "ADA",
      symbol: "ADA",
      name: "Cardano",
      category: "crypto",
      price: 45.5,
      change: 1.25,
      changePercent: 2.82,
      exchange: "Global",
    },
  ],
  bonds: [
    {
      id: "GOI_10Y",
      symbol: "GOI_10Y",
      name: "Government of India 10Y Bond",
      category: "bonds",
      price: 98.75,
      change: 0.15,
      changePercent: 0.15,
      sector: "Government",
    },
    {
      id: "HDFC_5Y",
      symbol: "HDFC_5Y",
      name: "HDFC Bank 5Y Bond",
      category: "bonds",
      price: 101.25,
      change: -0.25,
      changePercent: -0.25,
      sector: "Corporate",
    },
  ],
  etfs: [
    {
      id: "NIFTYBEES",
      symbol: "NIFTYBEES",
      name: "Nippon India ETF Nifty BeES",
      category: "etfs",
      price: 245.8,
      change: 2.95,
      changePercent: 1.22,
      exchange: "NSE",
      sector: "Large Cap",
    },
    {
      id: "GOLDBEES",
      symbol: "GOLDBEES",
      name: "Goldman Sachs Gold BeeS",
      category: "etfs",
      price: 45.67,
      change: 0.23,
      changePercent: 0.51,
      exchange: "NSE",
      sector: "Gold",
    },
  ],
  ipos: [
    {
      id: "UPCOMING_IPO_1",
      symbol: "NEWTECH",
      name: "NewTech Solutions IPO",
      category: "ipos",
      price: 350,
      change: 0,
      changePercent: 0,
      sector: "Technology",
    },
  ],
  commodities: [
    {
      id: "GOLD",
      symbol: "GOLD",
      name: "Gold",
      category: "commodities",
      price: 62450,
      change: 230,
      changePercent: 0.37,
      exchange: "MCX",
    },
    {
      id: "SILVER",
      symbol: "SILVER",
      name: "Silver",
      category: "commodities",
      price: 72850,
      change: -450,
      changePercent: -0.61,
      exchange: "MCX",
    },
  ],
};

export default function InvestmentSearchBar({
  onSearch,
  onSelect,
  placeholder = "Search investments...",
  category,
  className,
  showFilters = false,
}: InvestmentSearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle search input
  useEffect(() => {
    if (query.length > 0) {
      const filtered =
        mockSuggestions[category]?.filter(
          (item) =>
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.symbol.toLowerCase().includes(query.toLowerCase())
        ) || [];
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, category]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.symbol);
    onSearch(suggestion.symbol);
    onSelect?.(suggestion);
    setShowSuggestions(false);

    // Add to recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== suggestion.id);
      return [suggestion, ...filtered].slice(0, 5);
    });
  };

  const clearSearch = () => {
    setQuery("");
    onSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const formatPrice = (price: number, category: string) => {
    if (category === "crypto") {
      return `₹${price.toLocaleString()}`;
    }
    return `₹${price.toFixed(2)}`;
  };

  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    const color = isPositive ? "text-green-600" : "text-red-600";
    const icon = isPositive ? TrendingUp : TrendingDown;
    const Icon = icon;

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs">
          {isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    );
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-20 h-12 text-base"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {showFilters && (
            <Button variant="outline" size="sm" className="h-8">
              <Filter className="h-4 w-4" />
            </Button>
          )}

          <Button onClick={() => handleSearch(query)} size="sm" className="h-8">
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.length > 0 ? (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground border-b">
                  Search Results
                </div>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="flex items-center justify-between px-4 py-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{suggestion.symbol}</span>
                        {suggestion.exchange && (
                          <Badge variant="outline" className="text-xs">
                            {suggestion.exchange}
                          </Badge>
                        )}
                        {suggestion.sector && (
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.sector}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.name}
                      </p>
                    </div>

                    {suggestion.price && (
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(suggestion.price, suggestion.category)}
                        </p>
                        {suggestion.change !== undefined &&
                          suggestion.changePercent !== undefined && (
                            <div className="mt-1">
                              {formatChange(
                                suggestion.change,
                                suggestion.changePercent
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : query.length > 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            ) : null}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length === 0 && (
              <div className="py-2 border-t">
                <div className="px-4 py-2 text-xs font-semibold text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
                {recentSearches.map((recent) => (
                  <div
                    key={recent.id}
                    onClick={() => handleSuggestionClick(recent)}
                    className="flex items-center justify-between px-4 py-2 hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {recent.symbol}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {recent.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
