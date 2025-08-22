"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Target, User, DollarSign, Calendar, PiggyBank } from "lucide-react";
import { useRetirementCalculator } from "@/lib/hooks/investment-calculators/useRetirementCalculator";

export const RetirementCalculator = () => {
  const {
    currentAge,
    setCurrentAge,
    retirementAge,
    setRetirementAge,
    currentSavings,
    setCurrentSavings,
    monthlyContribution,
    setMonthlyContribution,
    annualReturn,
    setAnnualReturn,
    targetIncome,
    setTargetIncome,
    inflationRate,
    setInflationRate,
    result,
    calculateRetirement,
    resetCalculator,
  } = useRetirementCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Retirement Planning Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Plan your retirement savings and estimate your financial future
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentAge"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4 text-blue-600" />
                    Current Age
                  </Label>
                  <Input
                    id="currentAge"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    placeholder="25"
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="retirementAge"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4 text-green-600" />
                    Retirement Age
                  </Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                    placeholder="65"
                    className="border-gray-300 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="currentSavings"
                  className="flex items-center gap-2"
                >
                  <PiggyBank className="h-4 w-4 text-purple-600" />
                  Current Savings
                </Label>
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  placeholder="Enter current savings"
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="monthlyContribution"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Monthly Contribution
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="Enter monthly savings"
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
                <Input
                  id="annualReturn"
                  type="number"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  placeholder="7"
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetIncome">
                  Target Annual Retirement Income
                </Label>
                <Input
                  id="targetIncome"
                  type="number"
                  value={targetIncome}
                  onChange={(e) => setTargetIncome(e.target.value)}
                  placeholder="Enter desired income"
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  placeholder="3"
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateRetirement}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  Calculate Retirement
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
                  Retirement Analysis
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Projected Savings at Retirement
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${result.totalSavings.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Income from Savings
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${result.monthlyIncome.toLocaleString()}
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

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Investment Growth
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        ${result.investmentGrowth.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Goal Status */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.goalMet
                        ? "bg-green-50 border-green-200"
                        : "bg-orange-50 border-orange-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Retirement Goal Status
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          result.goalMet ? "text-green-600" : "text-orange-600"
                        }`}
                      >
                        {result.goalMet
                          ? "✅ Goal Achievable"
                          : "⚠️ Additional Savings Needed"}
                      </div>
                      {!result.goalMet && (
                        <div className="text-sm text-gray-600 mt-2">
                          Consider increasing monthly contributions or extending
                          retirement age
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Retirement Planning Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Start Early
                </div>
                <div>
                  The earlier you start, the more time compound interest has to
                  work in your favor.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Regular Contributions
                </div>
                <div>
                  Consistent monthly savings create a strong foundation for
                  retirement security.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Diversified Portfolio
                </div>
                <div>
                  A mix of stocks, bonds, and other assets can help optimize
                  returns while managing risk.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
