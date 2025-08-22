"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calculator, Percent } from "lucide-react";
import { useROICalculator } from "@/lib/hooks/investment-calculators/useROICalculator";

export const ROICalculator = () => {
  const {
    initialInvestment,
    setInitialInvestment,
    finalValue,
    setFinalValue,
    timePeriod,
    setTimePeriod,
    additionalCosts,
    setAdditionalCosts,
    result,
    calculateROI,
    resetCalculator,
  } = useROICalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                ROI Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Calculate Return on Investment and analyze profitability
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="initialInvestment"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Initial Investment
                </Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="Enter initial investment"
                  className="border-gray-300 focus:border-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalValue" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Final Value / Current Value
                </Label>
                <Input
                  id="finalValue"
                  type="number"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  placeholder="Enter final value"
                  className="border-gray-300 focus:border-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timePeriod" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  Time Period (Years)
                </Label>
                <Input
                  id="timePeriod"
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  placeholder="Enter time period"
                  className="border-gray-300 focus:border-yellow-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalCosts">
                  Additional Costs (Optional)
                </Label>
                <Input
                  id="additionalCosts"
                  type="number"
                  value={additionalCosts}
                  onChange={(e) => setAdditionalCosts(e.target.value)}
                  placeholder="Enter additional costs"
                  className="border-gray-300 focus:border-yellow-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateROI}
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                >
                  Calculate ROI
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
                  ROI Analysis
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total ROI</span>
                      <span
                        className={`text-lg font-bold ${
                          result.totalROI >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.totalROI >= 0 ? "+" : ""}
                        {result.totalROI.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annualized ROI
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.annualizedROI >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.annualizedROI >= 0 ? "+" : ""}
                        {result.annualizedROI.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Gain/Loss
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.totalGain >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.totalGain >= 0 ? "+" : ""}$
                        {result.totalGain.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Investment
                      </span>
                      <span className="text-lg font-bold text-gray-700">
                        ${result.totalInvestment.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.totalROI >= 15
                        ? "bg-green-50 border-green-200"
                        : result.totalROI >= 0
                        ? "bg-blue-50 border-blue-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Investment Performance
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          result.totalROI >= 15
                            ? "text-green-600"
                            : result.totalROI >= 0
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.totalROI >= 15
                          ? "🚀 Excellent"
                          : result.totalROI >= 0
                          ? "📈 Positive"
                          : "📉 Loss"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Percent className="h-5 w-5 text-yellow-600" />
              Understanding ROI
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  ROI Formula
                </div>
                <div>
                  ROI = (Current Value - Initial Investment) / Initial
                  Investment × 100
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Annualized Return
                </div>
                <div>
                  Shows the equivalent annual return rate over the investment
                  period.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Benchmark Comparison
                </div>
                <div>
                  Compare your ROI with market indices like S&P 500 (≈10%
                  annually).
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
