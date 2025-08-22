import React from "react";
import { TrendingUp } from "lucide-react";
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
import { useFDCalculator } from "@/lib/hooks/calculators/useFDCalculator";
import { formatCurrency } from "@/lib/utils/calculators";

export const FDCalculator: React.FC = () => {
  const {
    principal,
    interestRate,
    tenure,
    compoundFrequency,
    taxRate,
    result,
    setPrincipal,
    setInterestRate,
    setTenure,
    setCompoundFrequency,
    setTaxRate,
    calculateFD,
    resetForm,
  } = useFDCalculator();

  const inputSection = (
    <div className="space-y-4">
      <FormField
        id="principal"
        label="Principal Amount (₹)"
        type="number"
        placeholder="1,00,000"
        value={principal}
        onChange={(e) => setPrincipal(e.target.value)}
      />

      <FormField
        id="interest-rate"
        label="Interest Rate (% per annum)"
        type="number"
        placeholder="6.5"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />

      <FormField
        id="tenure"
        label="Tenure (Years)"
        type="number"
        placeholder="5"
        value={tenure}
        onChange={(e) => setTenure(e.target.value)}
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

      <FormField
        id="tax-rate"
        label="Tax Rate (%) - Optional"
        type="number"
        placeholder="30"
        value={taxRate}
        onChange={(e) => setTaxRate(e.target.value)}
      />

      <div className="flex gap-2">
        <Button onClick={calculateFD} className="flex-1">
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
      <h3 className="font-semibold text-lg">Fixed Deposit Results</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Maturity Amount</div>
            <div className="text-xl font-bold text-green-600">
              {formatCurrency(result.maturityAmount)}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Interest Earned</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(result.interestEarned)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Tax Amount</div>
            <div className="text-xl font-bold text-orange-600">
              {formatCurrency(result.taxAmount)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Post-Tax Returns</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(result.postTaxReturns)}
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Effective Annual Return</div>
          <div className="text-xl font-bold text-indigo-600">
            {result.effectiveRate.toFixed(2)}%
          </div>
        </div>

        {result.taxableInterest > 0 && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm text-yellow-800">
              <strong>Tax Information:</strong> Interest above ₹40,000 is
              taxable. Taxable interest:{" "}
              {formatCurrency(result.taxableInterest)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <CalculatorLayout title="Fixed Deposit Calculator" icon={TrendingUp}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
