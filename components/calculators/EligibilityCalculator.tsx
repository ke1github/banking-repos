import React from "react";
import { Building } from "lucide-react";
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
import { useEligibilityCalculator } from "@/lib/hooks/calculators/useEligibilityCalculator";
import { formatCurrency } from "@/lib/utils/calculators";

export const EligibilityCalculator: React.FC = () => {
  const {
    monthlyIncome,
    monthlyExpenses,
    existingEMI,
    interestRate,
    loanTenure,
    loanType,
    result,
    setMonthlyIncome,
    setMonthlyExpenses,
    setExistingEMI,
    setInterestRate,
    setLoanTenure,
    setLoanType,
    calculateEligibility,
    resetForm,
  } = useEligibilityCalculator();

  const inputSection = (
    <div className="space-y-4">
      <FormField
        id="monthly-income"
        label="Monthly Income (₹)"
        type="number"
        placeholder="1,00,000"
        value={monthlyIncome}
        onChange={(e) => setMonthlyIncome(e.target.value)}
      />

      <FormField
        id="monthly-expenses"
        label="Monthly Expenses (₹) - Optional"
        type="number"
        placeholder="30,000"
        value={monthlyExpenses}
        onChange={(e) => setMonthlyExpenses(e.target.value)}
      />

      <FormField
        id="existing-emi"
        label="Existing EMI (₹) - Optional"
        type="number"
        placeholder="15,000"
        value={existingEMI}
        onChange={(e) => setExistingEMI(e.target.value)}
      />

      <div>
        <Label htmlFor="loan-type">Loan Type</Label>
        <Select
          value={loanType}
          onValueChange={(value: any) => setLoanType(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select loan type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home Loan</SelectItem>
            <SelectItem value="car">Car Loan</SelectItem>
            <SelectItem value="personal">Personal Loan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <FormField
        id="interest-rate"
        label="Expected Interest Rate (% per annum)"
        type="number"
        placeholder="8.5"
        value={interestRate}
        onChange={(e) => setInterestRate(e.target.value)}
      />

      <FormField
        id="loan-tenure"
        label="Loan Tenure (Years)"
        type="number"
        placeholder="20"
        value={loanTenure}
        onChange={(e) => setLoanTenure(e.target.value)}
      />

      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>FOIR Limits:</strong>
          <ul className="mt-2 space-y-1">
            <li>• Home Loan: Up to 50% of income</li>
            <li>• Car Loan: Up to 40% of income</li>
            <li>• Personal Loan: Up to 30% of income</li>
          </ul>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={calculateEligibility} className="flex-1">
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
      <h3 className="font-semibold text-lg">Loan Eligibility Results</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Maximum Loan Amount</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(result.maxLoanAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Based on FOIR limits
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Maximum EMI</div>
            <div className="text-xl font-bold text-blue-600">
              {formatCurrency(result.maxEmi)}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Recommended Amount</div>
            <div className="text-xl font-bold text-purple-600">
              {formatCurrency(result.recommendedLoanAmount)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Conservative estimate
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-800">
            <strong>Note:</strong> This is an indicative calculation. Actual
            loan approval depends on various factors including credit score,
            employment stability, bank policies, and documentation.
          </div>
        </div>

        <div className="bg-indigo-50 p-3 rounded-lg">
          <div className="text-sm text-indigo-800">
            <strong>Tip:</strong> Maintain a good credit score (750+) and ensure
            stable income for better loan terms. Consider making a higher down
            payment to reduce loan amount.
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CalculatorLayout title="Loan Eligibility Calculator" icon={Building}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
