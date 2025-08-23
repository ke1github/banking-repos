"use client";

import React from "react";
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIndianMarketOverview } from "@/lib/hooks/useIndianStocks";
import {
  formatIndianCurrency,
  formatIndianNumber,
} from "@/lib/types/indianStocks";
import { useSafeTimeFormat } from "@/lib/hooks/useSafeTimeFormat";

export default function IndianMarketOverview() {
  const { data: marketData, loading, error } = useIndianMarketOverview();
  const currentTime = useSafeTimeFormat(new Date(), "en-IN");

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Loading Indian market data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Failed to load market data: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!marketData) {
    return null;
  }

  const getMarketStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-red-100 text-red-800";
      case "PRE_OPEN":
        return "bg-yellow-100 text-yellow-800";
      case "AFTER_HOURS":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const majorIndices = marketData.indices.filter((index) =>
    ["NIFTY 50", "SENSEX", "NIFTY BANK", "NIFTY IT"].includes(index.index)
  );

  return (
    <div className="space-y-6">
      {/* Market Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Indian Market Overview
            </CardTitle>
            <div className="flex items-center space-x-3">
              <Badge className={getMarketStatusColor(marketData.marketStatus)}>
                {marketData.marketStatus.replace("_", " ")}
              </Badge>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {currentTime || "Loading..."}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Major Indices */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {majorIndices.map((index, i) => {
          const value = index.last || index.currentValue || 0;
          const change = index.variation || index.change || 0;
          const changePercent = index.percentChange || 0;
          const isPositive = change >= 0;

          return (
            <Card key={i} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {index.index}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-xs ${
                        index.exchange === "NSE"
                          ? "border-blue-500 text-blue-700"
                          : "border-orange-500 text-orange-700"
                      }`}
                    >
                      {index.exchange}
                    </Badge>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatIndianNumber(value)}
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-sm ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span>
                      {isPositive ? "+" : ""}
                      {formatIndianNumber(change)}
                    </span>
                    <span>
                      ({isPositive ? "+" : ""}
                      {changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Open:</span>
                    <span>{formatIndianNumber(index.open)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>High:</span>
                    <span className="text-green-600">
                      {formatIndianNumber(index.high)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Low:</span>
                    <span className="text-red-600">
                      {formatIndianNumber(index.low)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Market Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Gainers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketData.topGainers.length > 0 ? (
              <div className="space-y-3">
                {marketData.topGainers.slice(0, 5).map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-green-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {stock.name}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {stock.exchange}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No gainer data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Losers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketData.topLosers.length > 0 ? (
              <div className="space-y-3">
                {marketData.topLosers.slice(0, 5).map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-red-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {stock.name}
                      </div>
                    </div>
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      {stock.exchange}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No loser data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Most Active */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Activity className="h-5 w-5 text-blue-500 mr-2" />
              Most Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketData.mostActive.length > 0 ? (
              <div className="space-y-3">
                {marketData.mostActive.slice(0, 5).map((stock, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-blue-50 rounded"
                  >
                    <div>
                      <div className="font-medium text-sm">{stock.symbol}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {stock.name}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      {stock.exchange}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-4">
                No activity data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Indices */}
      {marketData.indices.length > 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Other Indices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketData.indices.slice(4).map((index, i) => {
                const value = index.last || index.currentValue || 0;
                const change = index.variation || index.change || 0;
                const changePercent = index.percentChange || 0;
                const isPositive = change >= 0;

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">{index.index}</div>
                      <div className="text-lg font-bold">
                        {formatIndianNumber(value)}
                      </div>
                      <div
                        className={`text-sm ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {index.exchange}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
