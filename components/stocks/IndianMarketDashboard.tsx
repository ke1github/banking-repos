"use client";

import React, { useState } from "react";
import { RefreshCw, Search, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IndianStockSearch from "@/components/stocks/IndianStockSearch";
import IndianStockQuote from "@/components/stocks/IndianStockQuote";
import IndianMarketOverview from "@/components/stocks/IndianMarketOverview";
import { useIndianStockData } from "@/lib/hooks/useIndianStocks";
import { IndianStockSearch as IndianStockSearchType } from "@/lib/types/indianStocks";

export default function IndianMarketDashboard() {
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE");
  const [selectedExchange, setSelectedExchange] = useState<"NSE" | "BSE">(
    "NSE"
  );
  const {
    data: stockData,
    loading,
    error,
  } = useIndianStockData(selectedStock, selectedExchange);

  const handleStockSelect = (stock: IndianStockSearchType) => {
    setSelectedStock(stock.symbol);
    setSelectedExchange(stock.exchange);
  };

  const featuredStocks = [
    { symbol: "RELIANCE", exchange: "NSE" as const },
    { symbol: "TCS", exchange: "NSE" as const },
    { symbol: "INFY", exchange: "NSE" as const },
    { symbol: "HDFCBANK", exchange: "NSE" as const },
  ];

  return (
    <div className="bg-gray-50 p-4 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-3" />
              Indian Stock Market
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time BSE and NSE stock data with comprehensive market
              insights
            </p>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>

        {/* Search Section */}
        <div className="max-w-md">
          <IndianStockSearch
            onStockSelect={handleStockSelect}
            placeholder="Search NSE/BSE stocks..."
          />
        </div>
      </div>

      {/* Market Overview */}
      <IndianMarketOverview />

      {/* Stock Quote Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selected Stock Quote */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Stock Quote: {selectedStock} ({selectedExchange})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3">Loading stock data...</span>
                </div>
              )}

              {error && (
                <div className="text-center py-8">
                  <div className="text-red-600 mb-2">
                    Failed to load stock data
                  </div>
                  <div className="text-sm text-gray-500">{error}</div>
                </div>
              )}

              {stockData && !loading && <IndianStockQuote stock={stockData} />}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stock Access */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Featured Stocks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {featuredStocks.map((stock) => (
                  <Button
                    key={`${stock.symbol}_${stock.exchange}`}
                    variant={
                      selectedStock === stock.symbol &&
                      selectedExchange === stock.exchange
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedStock(stock.symbol);
                      setSelectedExchange(stock.exchange);
                    }}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{stock.symbol}</span>
                      <span className="text-xs opacity-75">
                        {stock.exchange}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Exchange Selection */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Preferred Exchange
                </h4>
                <div className="flex space-x-2">
                  <Button
                    variant={selectedExchange === "NSE" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExchange("NSE")}
                    className="flex-1"
                  >
                    NSE
                  </Button>
                  <Button
                    variant={selectedExchange === "BSE" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedExchange("BSE")}
                    className="flex-1"
                  >
                    BSE
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Status Info */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm">Market Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="font-medium text-gray-700">
                    Trading Hours (IST):
                  </div>
                  <div className="text-gray-600">9:15 AM - 3:30 PM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">
                    Pre-Open Session:
                  </div>
                  <div className="text-gray-600">9:00 AM - 9:15 AM</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Currency:</div>
                  <div className="text-gray-600">Indian Rupee (₹)</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Exchanges:</div>
                  <div className="text-gray-600">NSE, BSE</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>About Indian Stock Market</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                National Stock Exchange (NSE)
              </h4>
              <p>
                The National Stock Exchange of India is the leading stock
                exchange in India, providing trading in equities, derivatives,
                and debt instruments. NSE is known for its transparent and
                efficient electronic trading system.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Bombay Stock Exchange (BSE)
              </h4>
              <p>
                The Bombay Stock Exchange is one of the oldest stock exchanges
                in Asia, established in 1875. BSE provides an efficient and
                transparent market for trading in equities, debt instruments,
                and derivatives.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-800">
              <strong>Note:</strong> This application provides real-time data
              from both NSE and BSE. Stock prices are updated every 30 seconds
              during market hours. All prices are in Indian Rupees (₹).
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
