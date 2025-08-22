"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PieChart, Target, User, TrendingUp } from "lucide-react";
import { useAssetAllocationCalculator } from "@/lib/hooks/investment-calculators/useAssetAllocationCalculator";

export const AssetAllocationCalculator = () => {
  const {
    age,
    setAge,
    riskTolerance,
    setRiskTolerance,
    investmentGoal,
    setInvestmentGoal,
    timeHorizon,
    setTimeHorizon,
    currentWealth,
    setCurrentWealth,
    result,
    calculateAllocation,
    resetCalculator,
  } = useAssetAllocationCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
              <PieChart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Asset Allocation Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Optimize your portfolio mix based on your profile and goals
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <select
                  id="riskTolerance"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select risk tolerance</option>
                  <option value="conservative">
                    Conservative - Minimize risk
                  </option>
                  <option value="moderate">Moderate - Balanced approach</option>
                  <option value="aggressive">
                    Aggressive - Maximize growth
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentGoal">Investment Goal</Label>
                <select
                  id="investmentGoal"
                  value={investmentGoal}
                  onChange={(e) => setInvestmentGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select investment goal</option>
                  <option value="retirement">Retirement</option>
                  <option value="wealth">Wealth Building</option>
                  <option value="income">Income Generation</option>
                  <option value="preservation">Capital Preservation</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="timeHorizon"
                  className="flex items-center gap-2"
                >
                  <Target className="h-4 w-4 text-green-600" />
                  Time Horizon (Years)
                </Label>
                <Input
                  id="timeHorizon"
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  placeholder="Investment time frame"
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentWealth">
                  Current Portfolio Value (Optional)
                </Label>
                <Input
                  id="currentWealth"
                  type="number"
                  value={currentWealth}
                  onChange={(e) => setCurrentWealth(e.target.value)}
                  placeholder="Enter current portfolio value"
                  className="border-gray-300 focus:border-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateAllocation}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                >
                  Calculate Allocation
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
                  Recommended Asset Allocation
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Stocks/Equities
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {result.stocks}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${result.stocks}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Bonds
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {result.bonds}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${result.bonds}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Cash/Money Market
                      </span>
                      <span className="text-lg font-bold text-yellow-600">
                        {result.cash}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${result.cash}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Alternative Investments
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {result.alternatives}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${result.alternatives}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Risk Level Indicator */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Risk Profile
                      </div>
                      <div className="text-xl font-bold text-purple-600">
                        {result.riskLevel}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Expected Annual Return: {result.expectedReturn}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Asset Allocation Principles
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Age-Based Rule
                </div>
                <div>
                  Traditional rule: Bond % = Age. Younger investors can take
                  more equity risk.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Diversification
                </div>
                <div>
                  Spreading investments across asset classes reduces overall
                  portfolio risk.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Rebalancing
                </div>
                <div>
                  Periodically adjust allocations to maintain target
                  percentages.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
