"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Shield,
  Zap,
  DollarSign,
  BarChart3,
  Users,
  Calendar,
  Star,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionMarkersProps {
  selectedStock: string | null;
}

const decisionData = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    price: 2750.45,
    overallSignal: "BUY",
    confidence: 85,
    signals: {
      technical: {
        signal: "BUY",
        strength: 8,
        reason: "Bullish breakout above resistance",
      },
      fundamental: {
        signal: "BUY",
        strength: 9,
        reason: "Strong financials and growth prospects",
      },
      momentum: {
        signal: "BUY",
        strength: 7,
        reason: "Positive momentum indicators",
      },
      volume: { signal: "BUY", strength: 8, reason: "High volume support" },
      sentiment: {
        signal: "HOLD",
        strength: 6,
        reason: "Mixed market sentiment",
      },
    },
    riskFactors: [
      {
        type: "HIGH",
        factor: "Regulatory Changes",
        impact: "Potential policy changes in energy sector",
      },
      {
        type: "MEDIUM",
        factor: "Oil Price Volatility",
        impact: "Crude oil price fluctuations",
      },
      {
        type: "LOW",
        factor: "Currency Risk",
        impact: "USD-INR exchange rate movements",
      },
    ],
    opportunities: [
      {
        type: "HIGH",
        factor: "Digital Expansion",
        impact: "Strong growth in telecom and digital services",
      },
      {
        type: "MEDIUM",
        factor: "Green Energy",
        impact: "Renewable energy investments",
      },
      {
        type: "MEDIUM",
        factor: "Retail Growth",
        impact: "Expanding retail footprint",
      },
    ],
    priceTargets: {
      conservative: 2900,
      optimistic: 3200,
      pessimistic: 2500,
    },
    stopLoss: 2600,
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 4125.3,
    overallSignal: "HOLD",
    confidence: 65,
    signals: {
      technical: {
        signal: "HOLD",
        strength: 5,
        reason: "Sideways trend with support at 4000",
      },
      fundamental: {
        signal: "BUY",
        strength: 8,
        reason: "Consistent profitability and dividend",
      },
      momentum: {
        signal: "SELL",
        strength: 4,
        reason: "Weakening momentum indicators",
      },
      volume: {
        signal: "HOLD",
        strength: 5,
        reason: "Average volume activity",
      },
      sentiment: {
        signal: "HOLD",
        strength: 6,
        reason: "Neutral analyst sentiment",
      },
    },
    riskFactors: [
      {
        type: "HIGH",
        factor: "Currency Headwinds",
        impact: "Strong INR affecting revenue conversion",
      },
      {
        type: "MEDIUM",
        factor: "Client Concentration",
        impact: "Dependence on key clients",
      },
      {
        type: "LOW",
        factor: "Competition",
        impact: "Increased competition in IT services",
      },
    ],
    opportunities: [
      {
        type: "HIGH",
        factor: "Digital Transformation",
        impact: "Growing demand for digital services",
      },
      {
        type: "MEDIUM",
        factor: "Cloud Services",
        impact: "Expansion in cloud offerings",
      },
      {
        type: "MEDIUM",
        factor: "AI/ML Services",
        impact: "Emerging technologies adoption",
      },
    ],
    priceTargets: {
      conservative: 4200,
      optimistic: 4500,
      pessimistic: 3800,
    },
    stopLoss: 3900,
  },
};

const marketSignals = [
  {
    name: "Market Trend",
    signal: "BULLISH",
    strength: 7,
    description: "Overall market showing positive momentum",
  },
  {
    name: "VIX Level",
    signal: "NEUTRAL",
    strength: 5,
    description: "Volatility at moderate levels",
  },
  {
    name: "FII Activity",
    signal: "BULLISH",
    strength: 8,
    description: "Foreign investors buying actively",
  },
  {
    name: "DII Flow",
    signal: "BULLISH",
    strength: 7,
    description: "Domestic institutions accumulating",
  },
  {
    name: "Sector Rotation",
    signal: "NEUTRAL",
    strength: 6,
    description: "Balanced sector performance",
  },
];

export default function DecisionMarkers({
  selectedStock,
}: DecisionMarkersProps) {
  const [activeSection, setActiveSection] = useState<
    "signals" | "risk" | "targets"
  >("signals");

  const stock =
    selectedStock && decisionData[selectedStock as keyof typeof decisionData]
      ? decisionData[selectedStock as keyof typeof decisionData]
      : decisionData.RELIANCE;

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "buy":
      case "bullish":
        return "text-green-600 bg-green-50 border-green-200";
      case "sell":
      case "bearish":
        return "text-red-600 bg-red-50 border-red-200";
      case "hold":
      case "neutral":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "buy":
      case "bullish":
        return <ThumbsUp className="h-4 w-4" />;
      case "sell":
      case "bearish":
        return <ThumbsDown className="h-4 w-4" />;
      case "hold":
      case "neutral":
        return <Target className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getRiskIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "high":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getOpportunityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "high":
        return <Star className="h-4 w-4 text-green-500" />;
      case "medium":
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Target className="h-4 w-4 text-blue-500" />;
      default:
        return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Decision Summary */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-blue-600">
                  {stock.symbol}
                </h2>
                <Badge
                  className={cn(
                    "border text-lg px-3 py-1",
                    getSignalColor(stock.overallSignal)
                  )}
                >
                  {getSignalIcon(stock.overallSignal)}
                  <span className="ml-1">{stock.overallSignal}</span>
                </Badge>
              </div>
              <p className="text-gray-600">{stock.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Confidence Level:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        stock.confidence >= 80
                          ? "bg-green-500"
                          : stock.confidence >= 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${stock.confidence}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold">{stock.confidence}%</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-3xl font-bold">
                ₹{stock.price.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Current Price</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeSection === "signals" ? "default" : "outline"}
          onClick={() => setActiveSection("signals")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Signals
        </Button>
        <Button
          variant={activeSection === "risk" ? "default" : "outline"}
          onClick={() => setActiveSection("risk")}
          className="flex items-center gap-2"
        >
          <Shield className="h-4 w-4" />
          Risk Analysis
        </Button>
        <Button
          variant={activeSection === "targets" ? "default" : "outline"}
          onClick={() => setActiveSection("targets")}
          className="flex items-center gap-2"
        >
          <Target className="h-4 w-4" />
          Price Targets
        </Button>
      </div>

      {/* Signals Section */}
      {activeSection === "signals" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Individual Signals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Individual Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stock.signals).map(([key, signal]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium capitalize">{key}</span>
                      <Badge
                        className={cn(
                          "border text-xs",
                          getSignalColor(signal.signal)
                        )}
                      >
                        {signal.signal}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{signal.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Strength</div>
                    <div className="text-lg font-bold">
                      {signal.strength}/10
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Market Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketSignals.map((signal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{signal.name}</span>
                      <Badge
                        className={cn(
                          "border text-xs",
                          getSignalColor(signal.signal)
                        )}
                      >
                        {signal.signal}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {signal.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Impact</div>
                    <div className="text-lg font-bold">
                      {signal.strength}/10
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Analysis Section */}
      {activeSection === "risk" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stock.riskFactors.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getRiskIcon(risk.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{risk.factor}</span>
                      <Badge variant="outline" className="text-xs">
                        {risk.type} RISK
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{risk.impact}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-500" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stock.opportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  {getOpportunityIcon(opportunity.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{opportunity.factor}</span>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.type} POTENTIAL
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {opportunity.impact}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Price Targets Section */}
      {activeSection === "targets" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Price Targets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Optimistic Target</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ₹{stock.priceTargets.optimistic}
                    </div>
                    <div className="text-sm text-green-600">
                      +
                      {(
                        ((stock.priceTargets.optimistic - stock.price) /
                          stock.price) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Conservative Target</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      ₹{stock.priceTargets.conservative}
                    </div>
                    <div className="text-sm text-blue-600">
                      +
                      {(
                        ((stock.priceTargets.conservative - stock.price) /
                          stock.price) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Pessimistic Target</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-red-600">
                      ₹{stock.priceTargets.pessimistic}
                    </div>
                    <div className="text-sm text-red-600">
                      {(
                        ((stock.priceTargets.pessimistic - stock.price) /
                          stock.price) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Stop Loss</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-600">
                      ₹{stock.stopLoss}
                    </div>
                    <div className="text-sm text-yellow-600">
                      {(
                        ((stock.stopLoss - stock.price) / stock.price) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trading Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-500" />
                Recommended Strategy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">Action Plan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>
                      Entry: Around current levels (₹{stock.price.toFixed(2)})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>
                      Target 1: ₹{stock.priceTargets.conservative} (
                      {(
                        ((stock.priceTargets.conservative - stock.price) /
                          stock.price) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-green-500" />
                    <span>
                      Target 2: ₹{stock.priceTargets.optimistic} (
                      {(
                        ((stock.priceTargets.optimistic - stock.price) /
                          stock.price) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-red-500" />
                    <span>
                      Stop Loss: ₹{stock.stopLoss} (
                      {(
                        ((stock.stopLoss - stock.price) / stock.price) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk-Reward Ratio</span>
                  <span className="font-semibold">1:2.5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Horizon</span>
                  <span className="font-semibold">3-6 months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Position Size</span>
                  <span className="font-semibold">2-3% of portfolio</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700">
              <DollarSign className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Set Price Alert
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Chart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
