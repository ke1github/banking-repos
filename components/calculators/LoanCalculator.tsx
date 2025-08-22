import React from "react";
import { Home } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculatorLayout } from "./CalculatorLayout";
import { ResultsDisplay } from "./ResultsDisplay";
import { useLoanCalculator } from "@/lib/hooks/calculators/useLoanCalculator";

export const LoanCalculator: React.FC = () => {
  const {
    loanAmount,
    loanRate,
    loanTerm,
    prepayment,
    prepaymentMonth,
    showAmortization,
    result,
    setLoanAmount,
    setLoanRate,
    setLoanTerm,
    setPrepayment,
    setPrepaymentMonth,
    setShowAmortization,
    calculateLoan,
    resetForm,
  } = useLoanCalculator();

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
        <Input
          id="loan-amount"
          type="number"
          placeholder="10,00,000"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="loan-rate">Interest Rate (% per annum)</Label>
        <Input
          id="loan-rate"
          type="number"
          placeholder="8.5"
          value={loanRate}
          onChange={(e) => setLoanRate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="loan-term">Loan Term (Years)</Label>
        <Input
          id="loan-term"
          type="number"
          placeholder="15"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
        />
      </div>

      {/* Advanced Options */}
      <div className="border-t pt-4 space-y-4">
        <h4 className="font-medium">Advanced Options</h4>
        <div className="flex items-center space-x-2">
          <Button
            variant={showAmortization ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAmortization(!showAmortization)}
          >
            {showAmortization ? "Hide" : "Show"} Amortization Schedule
          </Button>
        </div>

        <div>
          <Label htmlFor="prepayment">Prepayment Amount (₹)</Label>
          <Input
            id="prepayment"
            type="number"
            placeholder="50,000"
            value={prepayment}
            onChange={(e) => setPrepayment(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="prepayment-month">Prepayment Month</Label>
          <Input
            id="prepayment-month"
            type="number"
            placeholder="12"
            value={prepaymentMonth}
            onChange={(e) => setPrepaymentMonth(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={calculateLoan} className="flex-1">
          Calculate EMI
        </Button>
        <Button onClick={resetForm} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );

  const resultsSection = result && (
    <ResultsDisplay
      title="EMI Results"
      results={[
        {
          label: "Monthly EMI",
          value: `₹${result.monthlyPayment.toLocaleString()}`,
          bgColor: "bg-blue-50",
        },
        {
          label: "Total Interest",
          value: `₹${result.totalInterest.toLocaleString()}`,
          bgColor: "bg-gray-50",
        },
        {
          label: "Total Amount",
          value: `₹${result.totalAmount.toLocaleString()}`,
          bgColor: "bg-green-50",
        },
        ...(result.prepaymentSavings
          ? [
              {
                label: "Prepayment Savings",
                value: `₹${result.prepaymentSavings.toLocaleString()}`,
                bgColor: "bg-purple-50",
              },
            ]
          : []),
      ]}
      infoMessage="EMI calculated based on reducing balance method"
    />
  );

  return (
    <CalculatorLayout
      title="Loan EMI Calculator"
      icon={Home}
      description="Calculate monthly loan payments for home, car, or personal loans"
    >
      {inputSection}
      {resultsSection}
    </CalculatorLayout>
  );
};
