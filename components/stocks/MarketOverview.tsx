"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRealTimeIndices } from "@/lib/hooks/useRealTimeStock";
import { RealTimeStatus, LiveDataPulse } from "./RealTimeStatus";

export default function MarketOverview() {
  // Use enhanced real-time market data
  const {
    indices: marketIndices,
    loading,
    error,
    status,
    refetch,
    isSubscribed,
  } = useRealTimeIndices({
    enabled: true,
    updateInterval: 10000, // 10 seconds for indices
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-600">Loading market data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading market data</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
          <Button variant="outline" onClick={refetch} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number, changePercent: number) => {
    const isPositive = change >= 0;
    return (
      <div
        className={cn(
          "flex items-center gap-1",
          isPositive ? "text-green-600" : "text-red-600"
        )}
      >
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
        <span className="font-medium">
          {change >= 0 ? "+" : ""}
          {change.toFixed(2)} ({changePercent.toFixed(2)}%)
        </span>
      </div>
    );
  };

  const formatVolume = (volume: string | number) => {
    if (typeof volume === "string") return volume;
    if (volume >= 1000000000) {
      return `${(volume / 1000000000).toFixed(1)}B`;
    } else if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  // Calculate market summary from indices data
  const calculateMarketSummary = () => {
    if (!marketIndices || marketIndices.length === 0) {
      return {
        advancing: 0,
        declining: 0,
        unchanged: 0,
        totalVolume: 0,
      };
    }

    const advancing = marketIndices.filter((index) => index.change > 0).length;
    const declining = marketIndices.filter((index) => index.change < 0).length;
    const unchanged = marketIndices.filter(
      (index) => index.change === 0
    ).length;
    const totalVolume = 0; // Volume calculation would depend on the data structure

    return { advancing, declining, unchanged, totalVolume };
  };

  const marketSummary = calculateMarketSummary();

  return (
    <LiveDataPulse isActive={isSubscribed}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Market Overview
            </h2>
            <p className="text-gray-600 mt-1">
              Real-time market indices and performance
            </p>
          </div>
          <RealTimeStatus
            status={status}
            onRefresh={refetch}
            showDetails={true}
          />
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">
                    Advancing
                  </p>
                  <p className="text-2xl font-bold text-green-800">
                    {marketSummary.advancing}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Declining</p>
                  <p className="text-2xl font-bold text-red-800">
                    {marketSummary.declining}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Unchanged</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {marketSummary.unchanged}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Total Indices
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {marketIndices?.length || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Major Indices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Major Market Indices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {marketIndices && marketIndices.length > 0 ? (
                marketIndices.map((index) => (
                  <div
                    key={index.symbol}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {index.name}
                      </h4>
                      <p className="text-sm text-gray-600">{index.symbol}</p>
                      <p className="text-lg font-bold mt-1">
                        {formatPrice(index.value)}
                      </p>
                    </div>
                    <div className="text-right">
                      {formatChange(index.change, index.changePercent)}
                      {index.volume && (
                        <p className="text-sm text-gray-500 mt-1">
                          Vol: {formatVolume(index.volume)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(index.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500">
                  <p>No market data available</p>
                  <Button variant="outline" onClick={refetch} className="mt-2">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Data
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Market Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="h-5 w-5" />
                Top Gainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketIndices
                  ?.filter((index) => index.change > 0)
                  .sort((a, b) => b.changePercent - a.changePercent)
                  .slice(0, 5)
                  .map((index) => (
                    <div
                      key={index.symbol}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{index.symbol}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {index.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(index.value)}
                        </p>
                        <p className="text-sm text-green-600 font-medium">
                          +{index.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                {!marketIndices?.some((index) => index.change > 0) && (
                  <p className="text-gray-500 text-center py-4">
                    No gainers available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Losers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <TrendingDown className="h-5 w-5" />
                Top Losers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketIndices
                  ?.filter((index) => index.change < 0)
                  .sort((a, b) => a.changePercent - b.changePercent)
                  .slice(0, 5)
                  .map((index) => (
                    <div
                      key={index.symbol}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">{index.symbol}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {index.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(index.value)}
                        </p>
                        <p className="text-sm text-red-600 font-medium">
                          {index.changePercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                  ))}
                {!marketIndices?.some((index) => index.change < 0) && (
                  <p className="text-gray-500 text-center py-4">
                    No losers available
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Market Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Indices</p>
                <p className="text-2xl font-bold">
                  {marketIndices?.length || 0}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Advancing</p>
                <p className="text-2xl font-bold text-green-600">
                  {marketSummary.advancing}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Declining</p>
                <p className="text-2xl font-bold text-red-600">
                  {marketSummary.declining}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Unchanged</p>
                <p className="text-2xl font-bold text-gray-600">
                  {marketSummary.unchanged}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </LiveDataPulse>
  );
}
