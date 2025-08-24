"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  BarChart3,
  CandlestickChart,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

// This is a placeholder component for technical analysis visualizations
const ChartPlaceholder = ({
  title,
  description,
  height = 400,
}: {
  title: string;
  description: string;
  height?: number;
}) => (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <Separator />
    <div
      className="flex items-center justify-center border border-dashed rounded-lg bg-muted/30"
      style={{ height: `${height}px` }}
    >
      <div className="text-center p-4">
        <CandlestickChart className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">
          {title} visualization would appear here
        </p>
      </div>
    </div>
  </div>
);

export default function TechnicalAnalysisPage() {
  const [activeTab, setActiveTab] = useState("price-action");

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Technical Analysis
        </h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Select Stock
          </Button>
          <Button variant="outline" size="sm">
            Timeframe
          </Button>
          <Button variant="default" size="sm">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Analyze
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>AAPL - Apple Inc.</CardTitle>
            <div className="text-2xl font-semibold">
              $178.32{" "}
              <span className="text-green-500 text-sm ml-1">+2.45 (1.38%)</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="price-action">
                <CandlestickChart className="h-4 w-4 mr-2" />
                Price Action
              </TabsTrigger>
              <TabsTrigger value="indicators">
                <LineChart className="h-4 w-4 mr-2" />
                Indicators
              </TabsTrigger>
              <TabsTrigger value="patterns">
                <TrendingUp className="h-4 w-4 mr-2" />
                Patterns
              </TabsTrigger>
              <TabsTrigger value="volume">
                <BarChart3 className="h-4 w-4 mr-2" />
                Volume Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="price-action" className="mt-0">
              <ChartPlaceholder
                title="Price Action Chart"
                description="Candlestick chart showing price movement over time with support and resistance levels."
                height={500}
              />
            </TabsContent>

            <TabsContent value="indicators" className="mt-0">
              <ChartPlaceholder
                title="Technical Indicators"
                description="Moving averages, RSI, MACD, and other indicators to identify market trends."
                height={500}
              />
            </TabsContent>

            <TabsContent value="patterns" className="mt-0">
              <ChartPlaceholder
                title="Chart Patterns"
                description="Identification of common chart patterns like head and shoulders, double tops, triangles, etc."
                height={500}
              />
            </TabsContent>

            <TabsContent value="volume" className="mt-0">
              <ChartPlaceholder
                title="Volume Analysis"
                description="Volume indicators and patterns to confirm price movements and trend strength."
                height={500}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technical Signals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Overall Signal</p>
                    <p className="text-sm text-muted-foreground">
                      Based on 15 indicators
                    </p>
                  </div>
                </div>
                <div className="text-green-600 font-semibold">Bullish</div>
              </div>

              <Separator />

              <div className="space-y-3">
                {[
                  {
                    name: "Moving Averages",
                    signal: "Buy",
                    strength: "Strong",
                  },
                  {
                    name: "Oscillators",
                    signal: "Neutral",
                    strength: "Moderate",
                  },
                  { name: "Pivot Points", signal: "Buy", strength: "Moderate" },
                  { name: "Chart Patterns", signal: "Buy", strength: "Weak" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <p className="text-sm">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${
                          item.signal === "Buy"
                            ? "text-green-600"
                            : item.signal === "Sell"
                            ? "text-red-600"
                            : "text-amber-600"
                        }`}
                      >
                        {item.signal}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({item.strength})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Resistance 3</p>
                <p className="font-medium">$188.25</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resistance 2</p>
                <p className="font-medium">$185.78</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resistance 1</p>
                <p className="font-medium">$182.50</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="font-medium">$178.32</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Support 1</p>
                <p className="font-medium">$175.10</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Support 2</p>
                <p className="font-medium">$171.45</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Support 3</p>
                <p className="font-medium">$167.80</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">52 Week Range</p>
                <p className="font-medium">$124.17 - $199.62</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
