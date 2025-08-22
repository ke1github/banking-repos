import React from "react";
import { Shield } from "lucide-react";
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
import { usePPFCalculator } from "@/lib/hooks/calculators/usePPFCalculator";
import { formatCurrency } from "@/lib/utils/calculators";

export const PPFCalculator: React.FC = () => {
  const {
    annualDeposit,
    currentAge,
    taxSlab,
    result,
    setAnnualDeposit,
    setCurrentAge,
    setTaxSlab,
    calculatePPF,
    resetForm,
  } = usePPFCalculator();

  const inputSection = (
    <div className="space-y-4">
      <FormField
        id="annual-deposit"
        label="Annual Deposit (₹)"
        type="number"
        placeholder="1,50,000"
        value={annualDeposit}
        onChange={(e) => setAnnualDeposit(e.target.value)}
      />

      <FormField
        id="current-age"
        label="Current Age"
        type="number"
        placeholder="30"
        value={currentAge}
        onChange={(e) => setCurrentAge(e.target.value)}
      />

      <div>
        <Label htmlFor="tax-slab">Tax Slab</Label>
        <Select value={taxSlab} onValueChange={(value) => setTaxSlab(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select your tax slab" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">0% (No Tax)</SelectItem>
            <SelectItem value="5">5%</SelectItem>
            <SelectItem value="20">20%</SelectItem>
            <SelectItem value="30">30%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>PPF Benefits:</strong>
          <ul className="mt-2 space-y-1">
            <li>• 15-year lock-in period</li>
            <li>• Tax deduction under Section 80C</li>
            <li>• Tax-free interest and maturity</li>
            <li>• Current interest rate: ~7.1% per annum</li>
            <li>• Maximum deposit: ₹1.5 lakh per year</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={calculatePPF} className="flex-1">
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
      <h3 className="font-semibold text-lg">PPF Calculation Results</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Maturity Amount</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(result.maturityAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">After 15 years</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Investment</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(result.totalInvestment)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Over 15 years</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Interest Earned</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(result.totalInterest)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Tax-free interest</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Tax Savings</div>
            <div className="text-xl font-bold text-orange-600">
              {formatCurrency(result.taxSavings)}
            </div>
            <div className="text-xs text-gray-500 mt-1">Under Section 80C</div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Effective Return</div>
          <div className="text-xl font-bold text-indigo-600">
            {(
              (result.maturityAmount / result.totalInvestment - 1) *
              (1 / 15) *
              100
            ).toFixed(2)}
            %
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Annual effective return
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> PPF has a 15-year lock-in period. Partial
            withdrawals allowed from 7th year onwards. You can extend the
            account in blocks of 5 years after maturity.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout title="PPF Calculator" icon={Shield}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
