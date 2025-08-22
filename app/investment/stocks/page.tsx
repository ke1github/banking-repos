"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  PieChart,
  Target,
  Star,
  RefreshCw,
  Filter,
} from "lucide-react";
import StockSearchBar from "@/components/stocks/StockSearchBar";
import StockAnalysis from "@/components/stocks/StockAnalysis";
import SectorPerformance from "@/components/stocks/SectorPerformance";
import MarketOverview from "@/components/stocks/MarketOverview";
import DecisionMarkers from "@/components/stocks/DecisionMarkers";
import WatchlistManager from "@/components/stocks/WatchlistManager";

export default function StocksPage() {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stock Market Analysis
            </h1>
            <p className="text-gray-600 mt-2">
              Real-time stock analysis, sector performance, and investment
              decisions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <StockSearchBar onStockSelect={setSelectedStock} />
      </div>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="sectors" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Sectors
          </TabsTrigger>
          <TabsTrigger value="decisions" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Decisions
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Watchlist
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <MarketOverview />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <StockAnalysis selectedStock={selectedStock} />
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          <SectorPerformance />
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <DecisionMarkers selectedStock={selectedStock} />
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-6">
          <WatchlistManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
