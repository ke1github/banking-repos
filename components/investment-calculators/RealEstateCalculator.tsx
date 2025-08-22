"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building, DollarSign, TrendingUp, Home } from "lucide-react";
import { useRealEstateCalculator } from "@/lib/hooks/investment-calculators/useRealEstateCalculator";

export const RealEstateCalculator = () => {
  const {
    purchasePrice,
    setPurchasePrice,
    downPayment,
    setDownPayment,
    monthlyRent,
    setMonthlyRent,
    monthlyExpenses,
    setMonthlyExpenses,
    propertyTaxes,
    setPropertyTaxes,
    insurance,
    setInsurance,
    maintenance,
    setMaintenance,
    vacancyRate,
    setVacancyRate,
    appreciationRate,
    setAppreciationRate,
    holdingPeriod,
    setHoldingPeriod,
    result,
    calculateRealEstate,
    resetCalculator,
  } = useRealEstateCalculator();

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-xl bg-gradient-to-br from-teal-50 to-cyan-50">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                Real Estate ROI Calculator
              </h2>
              <p className="text-sm text-gray-600 font-normal mt-1">
                Calculate returns on real estate investments and rental
                properties
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
                  htmlFor="purchasePrice"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4 text-blue-600" />
                  Purchase Price
                </Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="Enter property purchase price"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="downPayment"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4 text-green-600" />
                  Down Payment
                </Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="Enter down payment amount"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyRent">Monthly Rental Income</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="Enter monthly rent"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">
                  Monthly Expenses
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">
                    Other Monthly Expenses
                  </Label>
                  <Input
                    id="monthlyExpenses"
                    type="number"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                    placeholder="HOA, utilities, etc."
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyTaxes">Annual Property Taxes</Label>
                  <Input
                    id="propertyTaxes"
                    type="number"
                    value={propertyTaxes}
                    onChange={(e) => setPropertyTaxes(e.target.value)}
                    placeholder="Enter annual property taxes"
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insurance">Annual Insurance</Label>
                  <Input
                    id="insurance"
                    type="number"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    placeholder="Enter annual insurance cost"
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maintenance">Annual Maintenance (%)</Label>
                  <Input
                    id="maintenance"
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(e.target.value)}
                    placeholder="2"
                    className="border-gray-300 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacancyRate">Vacancy Rate (%)</Label>
                <Input
                  id="vacancyRate"
                  type="number"
                  value={vacancyRate}
                  onChange={(e) => setVacancyRate(e.target.value)}
                  placeholder="5"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="appreciationRate"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  Annual Appreciation Rate (%)
                </Label>
                <Input
                  id="appreciationRate"
                  type="number"
                  value={appreciationRate}
                  onChange={(e) => setAppreciationRate(e.target.value)}
                  placeholder="3"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holdingPeriod">Holding Period (Years)</Label>
                <Input
                  id="holdingPeriod"
                  type="number"
                  value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(e.target.value)}
                  placeholder="10"
                  className="border-gray-300 focus:border-teal-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={calculateRealEstate}
                  className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
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
                  Real Estate Investment Analysis
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
                        {result.totalROI.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Cash-on-Cash Return
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {result.cashOnCashReturn.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Cap Rate</span>
                      <span className="text-lg font-bold text-purple-600">
                        {result.capRate.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Monthly Cash Flow
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.monthlyCashFlow >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.monthlyCashFlow >= 0 ? "+" : ""}$
                        {result.monthlyCashFlow.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Annual Cash Flow
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          result.annualCashFlow >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.annualCashFlow >= 0 ? "+" : ""}$
                        {result.annualCashFlow.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Property Value (Year {holdingPeriod})
                      </span>
                      <span className="text-lg font-bold text-teal-600">
                        ${result.futureValue.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Appreciation
                      </span>
                      <span className="text-lg font-bold text-orange-600">
                        ${result.totalAppreciation.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Investment Grade */}
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      result.totalROI >= 15
                        ? "bg-green-50 border-green-200"
                        : result.totalROI >= 8
                        ? "bg-blue-50 border-blue-200"
                        : result.totalROI >= 0
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        Investment Grade
                      </div>
                      <div
                        className={`text-xl font-bold ${
                          result.totalROI >= 15
                            ? "text-green-600"
                            : result.totalROI >= 8
                            ? "text-blue-600"
                            : result.totalROI >= 0
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.totalROI >= 15
                          ? "🌟 Excellent"
                          : result.totalROI >= 8
                          ? "👍 Good"
                          : result.totalROI >= 0
                          ? "⚠️ Fair"
                          : "❌ Poor"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="h-5 w-5 text-teal-600" />
              Real Estate Investment Metrics
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <div className="font-medium text-gray-900 mb-1">
                  Cash-on-Cash Return
                </div>
                <div>
                  Annual cash flow divided by total cash invested. Good
                  properties typically yield 8-12%.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">Cap Rate</div>
                <div>
                  Net operating income divided by property value. Higher cap
                  rates indicate better returns.
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-900 mb-1">1% Rule</div>
                <div>
                  Monthly rent should be at least 1% of purchase price for
                  positive cash flow.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
