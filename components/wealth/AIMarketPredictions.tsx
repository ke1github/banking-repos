"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/custom-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Search,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react";
import { aiWealthService } from "@/lib/api/aiWealthService";
import { MarketPrediction } from "@/lib/types/ai-wealth-types";
import { formatIndianCurrency } from "@/lib/types/indianStocks";

export default function AIMarketPredictions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([
    "RELIANCE",
    "TCS",
    "HDFCBANK",
    "INFY",
  ]);
  const [predictions, setPredictions] = useState<
    Record<string, MarketPrediction>
  >({});
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState<
    "oneDay" | "oneWeek" | "oneMonth" | "threeMonths"
  >("oneWeek");

  useEffect(() => {
    fetchPredictions();
  }, [selectedSymbols]);

  const fetchPredictions = async () => {
    if (selectedSymbols.length === 0) return;

    setLoading(true);
    try {
      const predictionsData = await aiWealthService.getMarketPredictions(
        selectedSymbols
      );
      setPredictions(predictionsData);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymbol = () => {
    if (!searchTerm || selectedSymbols.includes(searchTerm.toUpperCase()))
      return;

    setSelectedSymbols([...selectedSymbols, searchTerm.toUpperCase()]);
    setSearchTerm("");
  };

  const handleRemoveSymbol = (symbol: string) => {
    setSelectedSymbols(selectedSymbols.filter((s) => s !== symbol));
  };

  const prepareChartData = () => {
    const timeframes = ["Current", "1 Day", "1 Week", "1 Month", "3 Months"];

    return timeframes.map((label, index) => {
      const dataPoint: Record<string, any> = { name: label };

      selectedSymbols.forEach((symbol) => {
        const prediction = predictions[symbol];
        if (prediction) {
          if (index === 0) {
            dataPoint[symbol] = prediction.currentPrice;
          } else if (index === 1) {
            dataPoint[symbol] = prediction.predictedPrice.oneDay;
          } else if (index === 2) {
            dataPoint[symbol] = prediction.predictedPrice.oneWeek;
          } else if (index === 3) {
            dataPoint[symbol] = prediction.predictedPrice.oneMonth;
          } else if (index === 4) {
            dataPoint[symbol] = prediction.predictedPrice.threeMonths;
          }
        }
      });

      return dataPoint;
    });
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.6) return "Medium";
    return "Low";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "destructive";
  };

  const calculatePredictedChange = (prediction: MarketPrediction) => {
    const predictedPrice = prediction.predictedPrice[timeframe];
    const change = predictedPrice - prediction.currentPrice;
    const percentChange = (change / prediction.currentPrice) * 100;

    return {
      change,
      percentChange,
      isPositive: change >= 0,
    };
  };

  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Market Predictions</h1>
          <p className="text-muted-foreground">
            AI-powered price predictions and trend analysis for your selected
            assets
          </p>
        </div>
        <Button
          onClick={fetchPredictions}
          className="mt-2 md:mt-0"
          variant="outline"
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Predictions
        </Button>
      </div>

      {/* Search and add symbols */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Enter stock symbol (e.g., RELIANCE, TCS)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button onClick={handleAddSymbol} disabled={!searchTerm}>
                <Search className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <Select
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as any)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oneDay">1 Day Prediction</SelectItem>
                <SelectItem value="oneWeek">1 Week Prediction</SelectItem>
                <SelectItem value="oneMonth">1 Month Prediction</SelectItem>
                <SelectItem value="threeMonths">3 Months Prediction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedSymbols.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedSymbols.map((symbol) => (
                <Badge key={symbol} variant="secondary" className="px-2 py-1">
                  {symbol}
                  <button
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => handleRemoveSymbol(symbol)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predictions Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Price Prediction Trends</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-80">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : selectedSymbols.length > 0 &&
            Object.keys(predictions).length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={prepareChartData()}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatIndianCurrency(value as number)}
                  />
                  <Legend />
                  <ReferenceLine
                    x="Current"
                    stroke="#888"
                    strokeDasharray="3 3"
                  />
                  {selectedSymbols.map((symbol, index) => (
                    <Line
                      key={symbol}
                      type="monotone"
                      dataKey={symbol}
                      stroke={
                        index === 0
                          ? "#1e40af"
                          : index === 1
                          ? "#0e7490"
                          : index === 2
                          ? "#047857"
                          : index === 3
                          ? "#7c2d12"
                          : index === 4
                          ? "#9333ea"
                          : `#${Math.floor(Math.random() * 16777215).toString(
                              16
                            )}`
                      }
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
              <div>
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p>
                  No prediction data available. Please add some stock symbols to
                  see predictions.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedSymbols.map((symbol) => {
          const prediction = predictions[symbol];
          if (!prediction) return null;

          const { change, percentChange, isPositive } =
            calculatePredictedChange(prediction);

          return (
            <Card key={symbol}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{symbol}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {prediction.assetName}
                    </p>
                  </div>
                  <Badge
                    variant={getConfidenceColor(prediction.confidence)}
                    className="ml-2"
                  >
                    {getConfidenceLabel(prediction.confidence)} confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Current Price
                    </div>
                    <div className="text-xl font-bold">
                      {formatIndianCurrency(prediction.currentPrice)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Predicted (
                      {timeframe.replace(/([A-Z])/g, " $1").toLowerCase()})
                    </div>
                    <div className="text-xl font-bold flex items-center">
                      {formatIndianCurrency(
                        prediction.predictedPrice[timeframe]
                      )}
                      <span
                        className={`text-sm ml-2 flex items-center ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {isPositive ? "+" : ""}
                        {change.toFixed(2)} ({isPositive ? "+" : ""}
                        {percentChange.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Key Factors Influencing Prediction
                  </h4>
                  <div className="space-y-2">
                    {prediction.factors.map((factor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg border border-gray-100"
                      >
                        <div className="flex items-center">
                          <div
                            className={`h-2 w-2 rounded-full mr-2 ${
                              factor.impact > 0.2
                                ? "bg-green-500"
                                : factor.impact < -0.2
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}
                          />
                          <span className="text-sm">{factor.name}</span>
                        </div>
                        <Badge
                          variant={
                            factor.impact > 0.2
                              ? "success"
                              : factor.impact < -0.2
                              ? "destructive"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {factor.impact > 0 ? "+" : ""}
                          {factor.impact.toFixed(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-right text-muted-foreground mt-4">
                  Last updated:{" "}
                  {new Date(prediction.lastUpdated).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800">
              Important Disclaimer
            </h4>
            <p className="text-sm text-yellow-700">
              These predictions are generated by AI models based on historical
              data and market trends. They should be used for informational
              purposes only and not as the sole basis for investment decisions.
              Past performance is not indicative of future results. Always
              consult with a financial advisor before making investment
              decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
