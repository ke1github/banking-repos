import React from "react";
import { PiggyBank } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalculatorLayout } from "./CalculatorLayout";
import { FormField } from "./FormField";
import { useSavingsCalculator } from "@/lib/hooks/calculators/useSavingsCalculator";
import { formatCurrency } from "@/lib/utils/calculators";

export const SavingsCalculator: React.FC = () => {
  const {
    monthlyDeposit,
    interestRate,
    timePeriod,
    targetAmount,
    inflationRate,
    compoundFrequency,
    calculationType,
    result,
    setMonthlyDeposit,
    setInterestRate,
    setTimePeriod,
    setTargetAmount,
    setInflationRate,
    setCompoundFrequency,
    setCalculationType,
    calculateSavings,
    resetForm,
  } = useSavingsCalculator();

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="calculation-type">Calculation Type</Label>
        <Select
          value={calculationType}
          onValueChange={(value: any) => setCalculationType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select calculation type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="future-value">Future Value</SelectItem>
            <SelectItem value="goal-planning">Goal Planning</SelectItem>
            <SelectItem value="time-to-goal">Time to Goal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {calculationType !== "time-to-goal" && (
        <FormField
          id="monthly-deposit"
          label="Monthly Deposit (₹)"
          type="number"
          placeholder="5,000"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(e.target.value)}
        />
      )}

      {calculationType === "time-to-goal" && (
        <FormField
          id="monthly-deposit"
          label="Monthly Deposit (₹)"
          type="number"
          placeholder="5,000"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(e.target.value)}
        />
      )}

      <FormField
        id="interest-rate"
        label="Expected Return (% per annum)"
        type="number"
        placeholder="7.5"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />

      {calculationType !== "time-to-goal" && (
        <FormField
          id="time-period"
          label="Investment Period (Years)"
          type="number"
          placeholder="10"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        />
      )}

      {(calculationType === "goal-planning" ||
        calculationType === "time-to-goal") && (
        <FormField
          id="target-amount"
          label="Target Amount (₹)"
          type="number"
          placeholder="10,00,000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
        />
      )}

      <FormField
        id="inflation-rate"
        label="Inflation Rate (% per annum) - Optional"
        type="number"
        placeholder="6"
        value={inflationRate}
        onChange={(e) => setInflationRate(e.target.value)}
      />

      <div>
        <Label htmlFor="compound-frequency">Compounding Frequency</Label>
        <Select
          value={compoundFrequency}
          onValueChange={(value: any) => setCompoundFrequency(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button onClick={calculateSavings} className="flex-1">
          Calculate
        </Button>
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
      </div>
    </div>
  );

  const resultSection = result && (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Savings Calculation Results</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Future Value</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(result.futureValue)}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Deposits</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(result.totalDeposits)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Interest Earned</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(result.totalInterest)}
            </div>
          </div>
          {result.realValue && (
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Real Value (Inflation Adjusted)
              </div>
              <div className="text-xl font-bold text-orange-600">
                {formatCurrency(result.realValue)}
              </div>
            </div>
          )}
        </div>

        {result.monthlyRequiredForGoal && (
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              Monthly Deposit Required
            </div>
            <div className="text-xl font-bold text-yellow-600">
              {formatCurrency(result.monthlyRequiredForGoal)}
            </div>
          </div>
        )}

        {result.yearsToReachGoal && (
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Years to Reach Goal</div>
            <div className="text-xl font-bold text-indigo-600">
              {result.yearsToReachGoal.toFixed(1)} years
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <CalculatorLayout title="Savings Calculator" icon={PiggyBank}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
