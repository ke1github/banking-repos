"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, RotateCcw, TrendingUp, PieChart } from "lucide-react";
import { useRebalancingCalculator } from "@/lib/hooks/investment-calculators/useRebalancingCalculator";

export const RebalancingCalculator = () => {
  const {
    currentStocks,
    setCurrentStocks,
    currentBonds,
    setCurrentBonds,
    currentCash,
    setCurrentCash,
    targetStocks,
    setTargetStocks,
    targetBonds,
    setTargetBonds,
    targetCash,
    setTargetCash,
    totalPortfolio,
    setTotalPortfolio,
    result,
    calculateRebalancing,
    resetCalculator,
  } = useRebalancingCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio Rebalancing Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Calculate how to rebalance your portfolio to target allocation
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="totalPortfolio"
                  className="flex items-center gap-2"
                >
                  <PieChart className="h-4 w-4 text-blue-600" />
                  Total Portfolio Value
                </Label>
                <Input
                  id="totalPortfolio"
                  type="number"
                  value={totalPortfolio}
                  onChange={(e) => setTotalPortfolio(e.target.value)}
                  placeholder="Enter total portfolio value"
                  className="border-gray-300 focus:border-indigo-500"
                />
              </div>

              {/* Current Allocation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Current Allocation (%)
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentStocks">Stocks/Equities</Label>
                    <Input
                      id="currentStocks"
                      type="number"
                      value={currentStocks}
                      onChange={(e) => setCurrentStocks(e.target.value)}
                      placeholder="Current stock percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentBonds">Bonds</Label>
                    <Input
                      id="currentBonds"
                      type="number"
                      value={currentBonds}
                      onChange={(e) => setCurrentBonds(e.target.value)}
                      placeholder="Current bond percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentCash">Cash/Money Market</Label>
                    <Input
                      id="currentCash"
                      type="number"
                      value={currentCash}
                      onChange={(e) => setCurrentCash(e.target.value)}
                      placeholder="Current cash percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Target Allocation */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RotateCcw className="h-4 w-4 text-purple-600" />
                  Target Allocation (%)
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="targetStocks">Stocks/Equities</Label>
                    <Input
                      id="targetStocks"
                      type="number"
                      value={targetStocks}
                      onChange={(e) => setTargetStocks(e.target.value)}
                      placeholder="Target stock percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetBonds">Bonds</Label>
                    <Input
                      id="targetBonds"
                      type="number"
                      value={targetBonds}
                      onChange={(e) => setTargetBonds(e.target.value)}
                      placeholder="Target bond percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetCash">Cash/Money Market</Label>
                    <Input
                      id="targetCash"
                      type="number"
                      value={targetCash}
                      onChange={(e) => setTargetCash(e.target.value)}
                      placeholder="Target cash percentage"
                      className="border-gray-300 focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateRebalancing}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                >
                  Calculate Rebalancing
                </Button>
                <Button
                  onClick={resetCalculator}
                  variant="outline"
                  className="px-6"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rebalancing Actions
                </h3>

                <div className="space-y-3">
                  {/* Stock Rebalancing */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Stocks/Equities
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.stocksAction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.stocksAction.amount >= 0 ? "+" : ""}$
                        {Math.abs(result.stocksAction.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.stocksAction.action}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${parseFloat(targetStocks)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Bond Rebalancing */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Bonds
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.bondsAction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.bondsAction.amount >= 0 ? "+" : ""}$
                        {Math.abs(result.bondsAction.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.bondsAction.action}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${parseFloat(targetBonds)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Cash Rebalancing */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Cash/Money Market
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.cashAction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.cashAction.amount >= 0 ? "+" : ""}$
                        {Math.abs(result.cashAction.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.cashAction.action}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${parseFloat(targetCash)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Rebalancing Status
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          result.rebalanceNeeded
                            ? "text-indigo-600"
                            : "text-green-600"
                        }`}
                      >
                        {result.rebalanceNeeded
                          ? "🔄 Rebalancing Recommended"
                          : "✅ Portfolio Balanced"}
                      </div>
                      {result.rebalanceNeeded && (
                        <div className="text-sm text-gray-600 mt-1">
                          Total trades needed: $
                          {Math.abs(result.totalTrades).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-indigo-600" />
              Rebalancing Best Practices
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Regular Schedule
                </div>
                <div>
                  Rebalance quarterly or semi-annually to maintain target
                  allocation without over-trading.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Threshold-Based
                </div>
                <div>
                  Rebalance when any asset class deviates more than 5-10% from
                  target allocation.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Tax Considerations
                </div>
                <div>
                  Consider using tax-advantaged accounts for rebalancing to
                  minimize tax impact.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
