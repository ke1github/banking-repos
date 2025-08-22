"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Star,
  Plus,
  Search,
  Settings,
  BarChart3,
  TrendingUp,
  Wifi,
  RefreshCw,
} from "lucide-react";
import {
  EnhancedStockCard,
  StockWatchlist,
} from "@/components/stocks/EnhancedStockCard";
import { RealTimeStatus } from "@/components/stocks/RealTimeStatus";
import { useRealTimeIndices } from "@/lib/hooks/useRealTimeStock";
import { realTimeDataManager } from "@/lib/realtime/dataManager";

export default function RealTimeStockDemo() {
  const [watchlist, setWatchlist] = useState<string[]>([
    "RELIANCE",
    "TCS",
    "INFY",
    "HDFCBANK",
  ]);
  const [newSymbol, setNewSymbol] = useState("");
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [updateInterval, setUpdateInterval] = useState(5000);

  const { status } = useRealTimeIndices({ enabled: realTimeEnabled });

  const handleAddToWatchlist = () => {
    if (newSymbol && !watchlist.includes(newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, newSymbol.toUpperCase()]);
      setNewSymbol("");
    }
  };

  const handleRemoveFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol));
  };

  const handleRealTimeToggle = (enabled: boolean) => {
    setRealTimeEnabled(enabled);
    realTimeDataManager.configure({
      enableAutoRefresh: enabled,
      updateInterval,
    });
  };

  const handleIntervalChange = (interval: number) => {
    setUpdateInterval(interval);
    realTimeDataManager.configure({
      updateInterval: interval,
    });
  };

  const popularStocks = [
    "RELIANCE",
    "TCS",
    "INFY",
    "HDFCBANK",
    "ICICIBANK",
    "HINDUNILVR",
    "ITC",
    "BHARTIARTL",
    "LT",
    "ASIANPAINT",
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Real-Time Stock Tracker
          </h1>
          <p className="text-gray-600 mt-1">
            Advanced real-time data fetching with dynamic UI
          </p>
        </div>

        <div className="flex items-center gap-4">
          <RealTimeStatus
            status={status}
            showDetails={true}
            className="hidden sm:flex"
          />
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Real-Time Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between">
              <label htmlFor="realtime-toggle" className="text-sm font-medium">
                Real-Time Updates
              </label>
              <Switch
                id="realtime-toggle"
                checked={realTimeEnabled}
                onCheckedChange={handleRealTimeToggle}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Update Interval</label>
              <select
                value={updateInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md text-sm"
                disabled={!realTimeEnabled}
              >
                <option value={1000}>1 second</option>
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Add stock symbol"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddToWatchlist()}
                className="text-sm"
              />
              <Button size="sm" onClick={handleAddToWatchlist}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="watchlist" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Watchlist ({watchlist.length})
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Popular
          </TabsTrigger>
          <TabsTrigger value="indices" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Indices
          </TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Live Demo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your Watchlist</h2>
            <Badge variant="secondary">{watchlist.length} stocks</Badge>
          </div>

          <StockWatchlist
            symbols={watchlist}
            exchange="NS"
            onRemove={handleRemoveFromWatchlist}
          />
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Popular Stocks</h2>
            <Badge variant="secondary">{popularStocks.length} stocks</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularStocks.map((symbol) => (
              <EnhancedStockCard
                key={symbol}
                symbol={symbol}
                exchange="NS"
                enableRealTime={realTimeEnabled}
                showRealTimeStatus={true}
                onWatchlistToggle={(sym, isWatched) => {
                  if (isWatched) {
                    setWatchlist([...watchlist, sym]);
                  } else {
                    handleRemoveFromWatchlist(sym);
                  }
                }}
                isWatched={watchlist.includes(symbol)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="indices" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Market Indices</h2>
            <RealTimeStatus status={status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["NSEI", "SENSEX", "NIFTYBANK", "CNXIT"].map((index) => (
              <EnhancedStockCard
                key={index}
                symbol={index}
                exchange="NS"
                enableRealTime={realTimeEnabled}
                showRealTimeStatus={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Auto-refresh</span>
                    <Badge variant="outline" className="bg-green-100">
                      {realTimeEnabled ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Update interval</span>
                    <Badge variant="outline" className="bg-blue-100">
                      {updateInterval / 1000}s
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">
                      Connection status
                    </span>
                    <Badge variant="outline" className="bg-purple-100">
                      {status.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Latency</span>
                    <Badge variant="outline" className="bg-yellow-100">
                      {status.latency}ms
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Stock Example</CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedStockCard
                  symbol="RELIANCE"
                  exchange="NS"
                  enableRealTime={realTimeEnabled}
                  showRealTimeStatus={true}
                  onWatchlistToggle={(sym, isWatched) => {
                    if (isWatched) {
                      setWatchlist([...watchlist, sym]);
                    } else {
                      handleRemoveFromWatchlist(sym);
                    }
                  }}
                  isWatched={watchlist.includes("RELIANCE")}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
