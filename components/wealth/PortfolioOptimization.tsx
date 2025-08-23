"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/custom-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Info,
  ShieldCheck,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import { aiWealthService } from "@/lib/api/aiWealthService";
import { PortfolioOptimizationSuggestion } from "@/lib/types/ai-wealth-types";

export default function PortfolioOptimization() {
  const [optimization, setOptimization] =
    useState<PortfolioOptimizationSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptimizationData();
  }, []);

  const fetchOptimizationData = async () => {
    setLoading(true);
    try {
      const data = await aiWealthService.getPortfolioOptimizationSuggestions(
        "mock-user-id"
      );
      setOptimization(data);
    } catch (error) {
      console.error("Error fetching optimization data:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6E6E",
    "#A0522D",
    "#6495ED",
    "#FFA500",
  ];

  const prepareAllocationData = (allocations: Record<string, number>) => {
    return Object.entries(allocations).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const prepareComparisonData = () => {
    if (!optimization) return [];

    return [
      {
        name: "Expected Return",
        Current: optimization.expectedReturnCurrent,
        Suggested: optimization.expectedReturnSuggested,
      },
      {
        name: "Risk Score",
        Current: optimization.riskScoreCurrent,
        Suggested: optimization.riskScoreSuggested,
      },
    ];
  };

  return (
    <div className="container px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">AI Portfolio Optimization</h1>
          <p className="text-muted-foreground">
            Optimize your portfolio for better risk-adjusted returns
          </p>
        </div>
        <Button
          onClick={fetchOptimizationData}
          className="mt-2 md:mt-0"
          variant="outline"
          disabled={loading}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh Suggestions
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : optimization ? (
        <>
          {/* Key Metrics Comparison */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareComparisonData()}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar
                      dataKey="Current"
                      fill="#8884d8"
                      name="Current Portfolio"
                    />
                    <Bar
                      dataKey="Suggested"
                      fill="#82ca9d"
                      name="Suggested Portfolio"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">Expected Return</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Current
                      </div>
                      <div className="text-lg font-bold">
                        {optimization.expectedReturnCurrent}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Suggested
                      </div>
                      <div className="text-lg font-bold">
                        {optimization.expectedReturnSuggested}%
                        <span
                          className={`text-sm ml-1 ${
                            optimization.expectedReturnSuggested >=
                            optimization.expectedReturnCurrent
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          (
                          {optimization.expectedReturnSuggested >=
                          optimization.expectedReturnCurrent
                            ? "+"
                            : ""}
                          {(
                            optimization.expectedReturnSuggested -
                            optimization.expectedReturnCurrent
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <ShieldCheck className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="font-medium">Risk Score</span>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Current
                      </div>
                      <div className="text-lg font-bold">
                        {optimization.riskScoreCurrent}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Suggested
                      </div>
                      <div className="text-lg font-bold">
                        {optimization.riskScoreSuggested}
                        <span
                          className={`text-sm ml-1 ${
                            optimization.riskScoreSuggested <=
                            optimization.riskScoreCurrent
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          (
                          {optimization.riskScoreSuggested <=
                          optimization.riskScoreCurrent
                            ? "-"
                            : "+"}
                          {Math.abs(
                            optimization.riskScoreSuggested -
                              optimization.riskScoreCurrent
                          )}
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Allocation Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareAllocationData(
                          optimization.currentAllocation
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {prepareAllocationData(
                          optimization.currentAllocation
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Class</TableHead>
                        <TableHead className="text-right">Allocation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(optimization.currentAllocation).map(
                        ([name, value]) => (
                          <TableRow key={name}>
                            <TableCell>{name}</TableCell>
                            <TableCell className="text-right">
                              {value}%
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareAllocationData(
                          optimization.suggestedAllocation
                        )}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {prepareAllocationData(
                          optimization.suggestedAllocation
                        ).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Asset Class</TableHead>
                        <TableHead className="text-right">Allocation</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(optimization.suggestedAllocation).map(
                        ([name, value]) => {
                          const currentValue =
                            optimization.currentAllocation[name] || 0;
                          const change = value - currentValue;

                          return (
                            <TableRow key={name}>
                              <TableCell>{name}</TableCell>
                              <TableCell className="text-right">
                                {value}%
                              </TableCell>
                              <TableCell className="text-right">
                                <span
                                  className={
                                    change > 0
                                      ? "text-green-600"
                                      : change < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                  }
                                >
                                  {change > 0 ? "+" : ""}
                                  {change}%
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rationale and Suggested Trades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Rationale</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex">
                    <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-900">{optimization.rationale}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Key Benefits</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-0.5">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Improved Diversification
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Better spread of risk across asset classes and
                          geographies
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-0.5">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Reduced Volatility</h4>
                        <p className="text-sm text-muted-foreground">
                          Lower portfolio fluctuations while maintaining return
                          potential
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-full mr-3 mt-0.5">
                        <ArrowRightLeft className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">
                          Better Risk-Adjusted Returns
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Improved Sharpe ratio for more efficient risk/return
                          profile
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Suggested Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {optimization.suggestedTrades.map((trade, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Badge
                            variant={
                              trade.action === "buy"
                                ? "default"
                                : trade.action === "sell"
                                ? "destructive"
                                : "outline"
                            }
                            className={`capitalize mr-2 ${
                              trade.action === "buy"
                                ? "bg-green-100 text-green-800"
                                : trade.action === "sell"
                                ? ""
                                : ""
                            }`}
                          >
                            {trade.action}
                          </Badge>
                          <span className="font-medium">{trade.symbol}</span>
                        </div>
                        {trade.quantity && (
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            {trade.action === "buy" ? "+" : "-"}
                            {trade.quantity} shares
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                        <span>
                          Current allocation: {trade.currentAllocation}%
                        </span>
                        <span>
                          Target allocation: {trade.targetAllocation}%
                        </span>
                      </div>

                      <p className="text-sm">{trade.rationale}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <Button className="w-full">
                    Implement All Suggested Trades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer */}
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Important Disclaimer
                </h4>
                <p className="text-sm text-yellow-700">
                  The portfolio optimization suggestions provided are based on
                  AI analysis of historical data, current market conditions, and
                  your financial profile. These suggestions are for
                  informational purposes only and do not constitute investment
                  advice. Past performance is not indicative of future results.
                  Please consult with a financial advisor before making any
                  investment decisions.
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground p-8">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
          <h3 className="text-lg font-medium mb-1">
            No Optimization Data Available
          </h3>
          <p>
            We couldn't retrieve portfolio optimization suggestions at this
            time. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
}
