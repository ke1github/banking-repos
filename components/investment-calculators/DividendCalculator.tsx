"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, DollarSign, Percent } from "lucide-react";
import { useDividendCalculator } from "@/lib/hooks/investment-calculators/useDividendCalculator";

export const DividendCalculator = () => {
  const {
    initialInvestment,
    setInitialInvestment,
    currentDividendYield,
    setCurrentDividendYield,
    annualGrowthRate,
    setAnnualGrowthRate,
    yearsToProject,
    setYearsToProject,
    monthlyContribution,
    setMonthlyContribution,
    reinvestDividends,
    setReinvestDividends,
    result,
    calculateDividend,
    resetCalculator,
  } = useDividendCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Dividend Growth Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Analyze dividend-paying stocks and projected income growth
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
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Initial Investment
                </Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                  placeholder="Enter initial investment"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currentDividendYield"
                  className="flex items-center gap-2"
                >
                  <Percent className="h-4 w-4 text-green-600" />
                  Current Dividend Yield (%)
                </Label>
                <Input
                  id="currentDividendYield"
                  type="number"
                  value={currentDividendYield}
                  onChange={(e) => setCurrentDividendYield(e.target.value)}
                  placeholder="4.5"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="annualGrowthRate"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Annual Dividend Growth Rate (%)
                </Label>
                <Input
                  id="annualGrowthRate"
                  type="number"
                  value={annualGrowthRate}
                  onChange={(e) => setAnnualGrowthRate(e.target.value)}
                  placeholder="7"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearsToProject">Years to Project</Label>
                <Input
                  id="yearsToProject"
                  type="number"
                  value={yearsToProject}
                  onChange={(e) => setYearsToProject(e.target.value)}
                  placeholder="20"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">
                  Monthly Additional Investment
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="Enter monthly contribution"
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reinvestDividends"
                  checked={reinvestDividends}
                  onChange={(e) => setReinvestDividends(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <Label htmlFor="reinvestDividends" className="text-sm">
                  Reinvest Dividends Automatically
                </Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateDividend}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-600 hover:from-orange-600 hover:to-yellow-700"
                >
                  Calculate Growth
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
                  Dividend Growth Projection
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Final Portfolio Value
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${result.finalPortfolioValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annual Dividend Income (Year {yearsToProject})
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${result.finalAnnualDividends.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Dividend Income
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        ${result.monthlyDividendIncome.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Dividends Received
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        ${result.totalDividendsReceived.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Contributions
                      </span>
                      <span className="text-lg font-bold text-gray-700">
                        ${result.totalContributions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Yield on Cost */}
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Yield on Cost (Year {yearsToProject})
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        {result.yieldOnCost.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Your original investment now yields this much annually
                      </div>
                    </div>
                  </div>

                  {/* Investment Growth Breakdown */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Growth Breakdown
                    </h4>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Capital Growth:</span>
                          <span className="font-medium">
                            ${result.capitalGrowth.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Dividend Growth:
                          </span>
                          <span className="font-medium">
                            ${result.dividendGrowth.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-orange-600" />
              Dividend Investing Strategies
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Dividend Growth
                </div>
                <div>
                  Focus on companies with a history of consistently increasing
                  dividend payments.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Reinvestment Power
                </div>
                <div>
                  Reinvesting dividends compounds your returns and accelerates
                  wealth building.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Quality Over Yield
                </div>
                <div>
                  Sustainable dividend growth is more valuable than high current
                  yield alone.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
