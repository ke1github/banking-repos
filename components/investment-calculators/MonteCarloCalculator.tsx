"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, AlertTriangle, Target } from "lucide-react";
import { useMonteCarloCalculator } from "@/lib/hooks/investment-calculators/useMonteCarloCalculator";

export const MonteCarloCalculator = () => {
  const {
    initialAmount,
    setInitialAmount,
    monthlyContribution,
    setMonthlyContribution,
    timeHorizon,
    setTimeHorizon,
    expectedReturn,
    setExpectedReturn,
    volatility,
    setVolatility,
    simulations,
    setSimulations,
    result,
    calculateMonteCarlo,
    resetCalculator,
  } = useMonteCarloCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-red-50 to-pink-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Monte Carlo Simulation
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Analyze portfolio performance under thousands of market
                scenarios
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
                  htmlFor="initialAmount"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Initial Investment
                </Label>
                <Input
                  id="initialAmount"
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  placeholder="Enter initial amount"
                  className="border-gray-300 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">
                  Monthly Contribution
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="Enter monthly contribution"
                  className="border-gray-300 focus:border-red-500"
                />
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
                  className="border-gray-300 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedReturn">
                  Expected Annual Return (%)
                </Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  placeholder="7"
                  className="border-gray-300 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="volatility" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  Annual Volatility (%)
                </Label>
                <Input
                  id="volatility"
                  type="number"
                  value={volatility}
                  onChange={(e) => setVolatility(e.target.value)}
                  placeholder="15"
                  className="border-gray-300 focus:border-red-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="simulations">Number of Simulations</Label>
                <select
                  id="simulations"
                  value={simulations}
                  onChange={(e) => setSimulations(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-red-500 focus:ring-1 focus:ring-red-500"
                >
                  <option value="1000">1,000 simulations</option>
                  <option value="5000">5,000 simulations</option>
                  <option value="10000">10,000 simulations</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateMonteCarlo}
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  Run Simulation
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
                  Simulation Results
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Median Outcome
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${result.medianValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Best Case (95th percentile)
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${result.bestCase.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Worst Case (5th percentile)
                      </span>
                      <span className="text-lg font-bold text-red-600">
                        ${result.worstCase.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Success Rate (Positive Return)
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {result.successRate}%
                      </span>
                    </div>
                  </div>

                  {/* Confidence Intervals */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">
                      Confidence Intervals
                    </h4>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            90% of outcomes:
                          </span>
                          <span className="font-medium">
                            ${result.confidence90.min.toLocaleString()} - $
                            {result.confidence90.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg">
                      <div className="text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            50% of outcomes:
                          </span>
                          <span className="font-medium">
                            ${result.confidence50.min.toLocaleString()} - $
                            {result.confidence50.max.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.successRate >= 80
                        ? "bg-green-50 border-green-200"
                        : result.successRate >= 60
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Portfolio Risk Assessment
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          result.successRate >= 80
                            ? "text-green-600"
                            : result.successRate >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.successRate >= 80
                          ? "🟢 Low Risk"
                          : result.successRate >= 60
                          ? "🟡 Moderate Risk"
                          : "🔴 High Risk"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              Understanding Monte Carlo Simulation
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Probabilistic Analysis
                </div>
                <div>
                  Uses random sampling to model thousands of possible market
                  scenarios and outcomes.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Risk Visualization
                </div>
                <div>
                  Shows the range of possible outcomes and their likelihood of
                  occurring.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Decision Support
                </div>
                <div>
                  Helps make informed decisions about portfolio allocation and
                  risk tolerance.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
