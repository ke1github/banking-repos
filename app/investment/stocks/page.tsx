"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  BookmarkPlus,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  RefreshCw,
  Target,
  Shield,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stock Market Hub
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time analysis, insights, and decision-making tools for smart
              investing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
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
