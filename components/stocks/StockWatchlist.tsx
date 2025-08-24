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
import {
  TrendingUp,
  TrendingDown,
  Bell,
  BellOff,
  Search,
  Plus,
  AlertTriangle,
  RefreshCw,
  X,
  Edit,
} from "lucide-react";
import { formatIndianCurrency } from "@/lib/types/indianStocks";

interface WatchlistStock {
  symbol: string;
  companyName: string;
  exchange: "NSE" | "BSE";
  currentPrice: number;
  dayChange: number;
  dayChangePercent: number;
  targetPrice: number | null;
  targetMet: boolean;
  notes: string;
}

export default function StockWatchlist() {
  const [searchQuery, setSearchQuery] = useState("");
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>([
    {
      symbol: "TATAMOTORS",
      companyName: "Tata Motors Ltd",
      exchange: "NSE",
      currentPrice: 650.25,
      dayChange: 15.8,
      dayChangePercent: 2.49,
      targetPrice: 700.0,
      targetMet: false,
      notes: "Wait for Q4 results before buying",
    },
    {
      symbol: "ICICIBANK",
      companyName: "ICICI Bank Ltd",
      exchange: "NSE",
      currentPrice: 975.5,
      dayChange: -5.2,
      dayChangePercent: -0.53,
      targetPrice: 1050.0,
      targetMet: false,
      notes: "Consider entry below 950",
    },
    {
      symbol: "WIPRO",
      companyName: "Wipro Ltd",
      exchange: "NSE",
      currentPrice: 470.75,
      dayChange: 2.1,
      dayChangePercent: 0.45,
      targetPrice: 500.0,
      targetMet: false,
      notes: "IT sector may recover soon",
    },
    {
      symbol: "SUNPHARMA",
      companyName: "Sun Pharmaceutical Industries Ltd",
      exchange: "NSE",
      currentPrice: 1120.3,
      dayChange: 32.45,
      dayChangePercent: 2.98,
      targetPrice: 1200.0,
      targetMet: false,
      notes: "Strong product pipeline",
    },
    {
      symbol: "ZOMATO",
      companyName: "Zomato Ltd",
      exchange: "BSE",
      currentPrice: 171.95,
      dayChange: 4.5,
      dayChangePercent: 2.69,
      targetPrice: 180.0,
      targetMet: false,
      notes: "Monitor quarterly growth",
    },
    {
      symbol: "ADANIPORTS",
      companyName: "Adani Ports and Special Economic Zone Ltd",
      exchange: "NSE",
      currentPrice: 1085.65,
      dayChange: -12.45,
      dayChangePercent: -1.13,
      targetPrice: 1200.0,
      targetMet: false,
      notes: "Good long term infrastructure play",
    },
    {
      symbol: "POWERGRID",
      companyName: "Power Grid Corporation of India Ltd",
      exchange: "NSE",
      currentPrice: 266.3,
      dayChange: 1.25,
      dayChangePercent: 0.47,
      targetPrice: 280.0,
      targetMet: false,
      notes: "Stable dividend stock",
    },
    {
      symbol: "JSWSTEEL",
      companyName: "JSW Steel Ltd",
      exchange: "NSE",
      currentPrice: 815.2,
      dayChange: -18.35,
      dayChangePercent: -2.2,
      targetPrice: 900.0,
      targetMet: false,
      notes: "Wait for metal cycle upturn",
    },
  ]);

  // Filter stocks based on search query
  const filteredWatchlist = watchlist.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle alert toggle
  const toggleAlert = (index: number) => {
    const updatedWatchlist = [...watchlist];
    const stock = updatedWatchlist[index];

    // If target price exists, remove it; otherwise set a default target
    if (stock.targetPrice) {
      stock.targetPrice = null;
      stock.targetMet = false;
    } else {
      // Set default target 5% above current price for demo
      stock.targetPrice = parseFloat((stock.currentPrice * 1.05).toFixed(2));
      stock.targetMet = false;
    }

    setWatchlist(updatedWatchlist);
  };

  // Simulate removing a stock from watchlist
  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <div className="space-y-6">
      {/* Watchlist Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Stock Watchlist</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Stock</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks in watchlist..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Watchlist Stocks */}
      {filteredWatchlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWatchlist.map((stock, index) => (
            <Card
              key={stock.symbol}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-2 flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    {stock.symbol}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {stock.exchange}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {stock.companyName}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => toggleAlert(index)}
                  >
                    {stock.targetPrice ? (
                      <Bell className="h-4 w-4 text-amber-500" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => removeFromWatchlist(stock.symbol)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-2xl font-bold">
                    {formatIndianCurrency(stock.currentPrice)}
                  </div>
                  <div
                    className={`flex items-center text-sm ${
                      stock.dayChange >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stock.dayChange >= 0 ? (
                      <TrendingUp className="h-4 w-4 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 mr-1" />
                    )}
                    <span>
                      {stock.dayChange >= 0 ? "+" : ""}
                      {stock.dayChangePercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                {/* Target Price Alert */}
                {stock.targetPrice && (
                  <div className="mt-2 p-2 bg-amber-50 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mr-1" />
                      <span className="text-sm">
                        Target: {formatIndianCurrency(stock.targetPrice)}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-6 p-0 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {/* Notes */}
                {stock.notes && (
                  <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                    <p className="italic">{stock.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="text-center space-y-2">
              {searchQuery ? (
                <>
                  <Search className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="font-medium">No stocks match your search</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or clear the search
                  </p>
                </>
              ) : (
                <>
                  <Bell className="h-8 w-8 text-muted-foreground mx-auto" />
                  <h3 className="font-medium">Your watchlist is empty</h3>
                  <p className="text-sm text-muted-foreground">
                    Add stocks to your watchlist to monitor them
                  </p>
                </>
              )}
              <Button
                className="mt-2"
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                {searchQuery ? "Clear Search" : "Add Stocks"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
