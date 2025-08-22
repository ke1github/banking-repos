"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Star,
  StarOff,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StockQuote } from "@/lib/api/types";
import { useRealTimeStock } from "@/lib/hooks/useRealTimeStock";
import { RealTimeStatus, LiveDataPulse, DataFreshness } from "./RealTimeStatus";

interface EnhancedStockCardProps {
  symbol: string;
  exchange?: string;
  showRealTimeStatus?: boolean;
  enableRealTime?: boolean;
  onWatchlistToggle?: (symbol: string, isWatched: boolean) => void;
  isWatched?: boolean;
  className?: string;
}

export function EnhancedStockCard({
  symbol,
  exchange = "NSE",
  showRealTimeStatus = true,
  enableRealTime = true,
  onWatchlistToggle,
  isWatched = false,
  className,
}: EnhancedStockCardProps) {
  const {
    data: stockData,
    loading,
    error,
    status,
    refetch,
    isSubscribed,
  } = useRealTimeStock({
    symbol: `${symbol}.${exchange}`,
    enabled: enableRealTime,
    updateInterval: 5000,
  });

  const quote = stockData as StockQuote | null;

  const handleWatchlistToggle = () => {
    onWatchlistToggle?.(symbol, !isWatched);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`;
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000)
      return `₹${(marketCap / 1000000000000).toFixed(2)}T`;
    if (marketCap >= 10000000000)
      return `₹${(marketCap / 10000000000).toFixed(2)}K Cr`;
    if (marketCap >= 10000000)
      return `₹${(marketCap / 10000000).toFixed(2)} Cr`;
    return `₹${marketCap.toLocaleString("en-IN")}`;
  };

  const isPositive = quote ? quote.change >= 0 : false;
  const changeColor = isPositive ? "text-green-600" : "text-red-600";
  const bgColor = isPositive
    ? "bg-green-50 border-green-200"
    : "bg-red-50 border-red-200";

  if (loading && !quote) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="animate-pulse space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-28"></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error && !quote) {
    return (
      <Card className={cn("p-4 border-red-200 bg-red-50", className)}>
        <div className="text-center space-y-2">
          <div className="text-red-600 font-medium">{symbol}</div>
          <div className="text-sm text-red-500">{error}</div>
          <Button variant="outline" size="sm" onClick={refetch}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!quote) return null;

  return (
    <LiveDataPulse isActive={isSubscribed && enableRealTime}>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md",
          bgColor,
          className
        )}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">{symbol}</h3>
                <Badge variant="outline" className="text-xs">
                  {exchange}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 truncate max-w-48">
                {quote.name}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {onWatchlistToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleWatchlistToggle}
                  className="h-6 w-6 p-0"
                >
                  {isWatched ? (
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-3 w-3 text-gray-400" />
                  )}
                </Button>
              )}

              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Price and Change */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(quote.price)}
              </div>
              {showRealTimeStatus && (
                <RealTimeStatus
                  status={status}
                  onRefresh={refetch}
                  className="scale-75 origin-right"
                />
              )}
            </div>

            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                changeColor
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              <span>{formatChange(quote.change, quote.changePercent)}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <div className="text-gray-500">Volume</div>
              <div className="font-medium">{formatVolume(quote.volume)}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Market Cap</div>
              <div className="font-medium">
                {formatMarketCap(quote.marketCap)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">Day Range</div>
              <div className="font-medium">
                {quote.dayRange[0].toFixed(2)} - {quote.dayRange[1].toFixed(2)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500">P/E Ratio</div>
              <div className="font-medium">
                {quote.pe ? quote.pe.toFixed(2) : "N/A"}
              </div>
            </div>
          </div>

          {/* Data Freshness */}
          {enableRealTime && (
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <DataFreshness lastUpdate={new Date(quote.lastUpdated)} />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Activity className="h-3 w-3" />
                <span>Live</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </LiveDataPulse>
  );
}

// Watchlist component
interface StockWatchlistProps {
  symbols: string[];
  exchange?: string;
  onRemove?: (symbol: string) => void;
  className?: string;
}

export function StockWatchlist({
  symbols,
  exchange = "NSE",
  onRemove,
  className,
}: StockWatchlistProps) {
  const handleWatchlistToggle = (symbol: string, isWatched: boolean) => {
    if (!isWatched) {
      onRemove?.(symbol);
    }
  };

  if (symbols.length === 0) {
    return (
      <Card className={cn("p-6 text-center", className)}>
        <div className="space-y-2">
          <Star className="h-8 w-8 text-gray-400 mx-auto" />
          <h3 className="font-medium text-gray-900">No stocks in watchlist</h3>
          <p className="text-sm text-gray-500">
            Add stocks to your watchlist to track them here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {symbols.map((symbol) => (
        <EnhancedStockCard
          key={symbol}
          symbol={symbol}
          exchange={exchange}
          enableRealTime={true}
          showRealTimeStatus={true}
          onWatchlistToggle={handleWatchlistToggle}
          isWatched={true}
        />
      ))}
    </div>
  );
}
