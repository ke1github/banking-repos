"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";
import { useCompoundInterestCalculator } from "@/lib/hooks/investment-calculators/useCompoundInterestCalculator";

export const CompoundInterestCalculator = () => {
  const {
    principal,
    setPrincipal,
    rate,
    setRate,
    time,
    setTime,
    frequency,
    setFrequency,
    additionalContribution,
    setAdditionalContribution,
    result,
    calculateCompoundInterest,
    resetCalculator,
  } = useCompoundInterestCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Compound Interest Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                See how your investments grow with the power of compounding
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="principal" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  Initial Investment
                </Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="Enter initial amount"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate" className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-green-600" />
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Enter annual rate"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  Time Period (Years)
                </Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Enter number of years"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Compounding Frequency</Label>
                <select
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional">
                  Monthly Contribution (Optional)
                </Label>
                <Input
                  id="additional"
                  type="number"
                  value={additionalContribution}
                  onChange={(e) => setAdditionalContribution(e.target.value)}
                  placeholder="Enter monthly contribution"
                  className="border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateCompoundInterest}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
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
                  Investment Growth Projection
                </h3>

                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Final Amount
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${result.finalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Interest Earned
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        ${result.totalInterest.toLocaleString()}
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
                        Effective Annual Return
                      </span>
                      <span className="text-lg font-bold text-purple-600">
                        {result.effectiveRate}%
                      </span>
                    </div>
                  </div>

                  {/* Growth Visualization */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Your ${parseFloat(principal || "0").toLocaleString()}{" "}
                        investment will grow to
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${result.finalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        in {time} years with compound growth
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Understanding Compound Interest
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  The Power of Time
                </div>
                <div>
                  The longer you invest, the more your money grows exponentially
                  rather than linearly.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Compounding Frequency
                </div>
                <div>
                  More frequent compounding (daily vs. annually) can
                  significantly increase returns.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Regular Contributions
                </div>
                <div>
                  Adding money regularly amplifies the compounding effect over
                  time.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
