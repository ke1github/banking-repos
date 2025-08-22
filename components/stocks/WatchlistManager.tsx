"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Star,
  Plus,
  TrendingUp,
  TrendingDown,
  Bell,
  Trash2,
  Edit,
  Eye,
  DollarSign,
  Target,
  Calendar,
  Filter,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistStock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  targetPrice?: number;
  alertPrice?: number;
  addedDate: string;
  sector: string;
}

const watchlistData: WatchlistStock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2750.45,
    change: 45.2,
    changePercent: 1.67,
    targetPrice: 3100,
    alertPrice: 2800,
    addedDate: "2024-01-15",
    sector: "Energy",
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4125.3,
    change: -25.75,
    changePercent: -0.62,
    targetPrice: 4300,
    addedDate: "2024-01-20",
    sector: "IT",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    price: 1625.75,
    change: 8.45,
    changePercent: 0.52,
    targetPrice: 1750,
    alertPrice: 1600,
    addedDate: "2024-02-01",
    sector: "Banking",
  },
  {
    symbol: "INFY",
    name: "Infosys Limited",
    price: 1845.6,
    change: 12.85,
    changePercent: 0.7,
    targetPrice: 2000,
    addedDate: "2024-02-10",
    sector: "IT",
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd",
    price: 2675.85,
    change: 18.9,
    changePercent: 0.71,
    targetPrice: 2850,
    alertPrice: 2700,
    addedDate: "2024-02-15",
    sector: "FMCG",
  },
];

const portfolioSummary = {
  totalStocks: 5,
  totalValue: 652750,
  totalGain: 15240,
  totalGainPercent: 2.39,
  bestPerformer: "HINDUNILVR",
  worstPerformer: "TCS",
};

export default function WatchlistManager() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(watchlistData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"symbol" | "change" | "addedDate">(
    "symbol"
  );
  const [filterSector, setFilterSector] = useState<string>("All");

  const sectors = [
    "All",
    ...Array.from(new Set(watchlistData.map((stock) => stock.sector))),
  ];

  const filteredWatchlist = watchlist
    .filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((stock) => filterSector === "All" || stock.sector === filterSector)
    .sort((a, b) => {
      switch (sortBy) {
        case "change":
          return b.changePercent - a.changePercent;
        case "addedDate":
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => prev.filter((stock) => stock.symbol !== symbol));
  };

  const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            Watchlist Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioSummary.totalStocks}
              </div>
              <div className="text-sm text-gray-600">Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatCurrency(portfolioSummary.totalValue)}
              </div>
              <div className="text-sm text-gray-600">Total Value</div>
            </div>
            <div className="text-center">
              <div
                className={cn(
                  "text-2xl font-bold",
                  portfolioSummary.totalGain >= 0
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {portfolioSummary.totalGain >= 0 ? "+" : ""}
                {formatCurrency(portfolioSummary.totalGain)}
              </div>
              <div className="text-sm text-gray-600">Total Gain</div>
            </div>
            <div className="text-center">
              <div
                className={cn(
                  "text-2xl font-bold",
                  portfolioSummary.totalGainPercent >= 0
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {portfolioSummary.totalGainPercent >= 0 ? "+" : ""}
                {portfolioSummary.totalGainPercent.toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Return</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {portfolioSummary.bestPerformer}
              </div>
              <div className="text-sm text-gray-600">Best Performer</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {portfolioSummary.worstPerformer}
              </div>
              <div className="text-sm text-gray-600">Needs Attention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterSector}
            onChange={(e) => setFilterSector(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="symbol">Sort by Symbol</option>
            <option value="change">Sort by Change</option>
            <option value="addedDate">Sort by Date Added</option>
          </select>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Stock
        </Button>
      </div>

      {/* Watchlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWatchlist.map((stock) => (
          <Card
            key={stock.symbol}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-blue-600">
                    {stock.symbol}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {stock.sector}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bell className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    onClick={() => removeFromWatchlist(stock.symbol)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">{stock.name}</p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Price and Change */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold">
                    {formatCurrency(stock.price)}
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      stock.change >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)} ({stock.change >= 0 ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
                <Badge
                  className={cn(
                    "border",
                    stock.change >= 0
                      ? "text-green-600 bg-green-50 border-green-200"
                      : "text-red-600 bg-red-50 border-red-200"
                  )}
                >
                  {stock.change >= 0 ? "UP" : "DOWN"}
                </Badge>
              </div>

              {/* Target and Alert Prices */}
              <div className="space-y-2">
                {stock.targetPrice && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-gray-600">Target</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(stock.targetPrice)}
                    </span>
                  </div>
                )}
                {stock.alertPrice && (
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1">
                      <Bell className="h-3 w-3 text-orange-500" />
                      <span className="text-gray-600">Alert</span>
                    </div>
                    <span className="font-medium">
                      {formatCurrency(stock.alertPrice)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-600">Added</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(stock.addedDate)}
                  </span>
                </div>
              </div>

              {/* Progress to Target */}
              {stock.targetPrice && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Progress to Target</span>
                    <span>
                      {((stock.price / stock.targetPrice) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          (stock.price / stock.targetPrice) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Trade
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWatchlist.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No stocks in watchlist
            </h3>
            <p className="text-gray-500 mb-4">
              Add stocks to track their performance and set alerts
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Stock
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Bell className="h-5 w-5" />
              <span className="text-sm">Set Alerts</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Target className="h-5 w-5" />
              <span className="text-sm">Update Targets</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Filter className="h-5 w-5" />
              <span className="text-sm">Advanced Filter</span>
            </Button>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <DollarSign className="h-5 w-5" />
              <span className="text-sm">Portfolio Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
