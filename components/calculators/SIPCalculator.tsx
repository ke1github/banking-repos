import React from "react";
import { LineChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalculatorLayout } from "./CalculatorLayout";
import { ResultsDisplay } from "./ResultsDisplay";
import { useSIPCalculator } from "@/lib/hooks/calculators/useSIPCalculator";

export const SIPCalculator: React.FC = () => {
  const {
    sipAmount,
    sipRate,
    sipYears,
    sipStepUp,
    result,
    setSipAmount,
    setSipRate,
    setSipYears,
    setSipStepUp,
    calculateSIP,
    resetForm,
  } = useSIPCalculator();

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sip-amount">Monthly SIP Amount (₹)</Label>
        <Input
          id="sip-amount"
          type="number"
          placeholder="5,000"
          value={sipAmount}
          onChange={(e) => setSipAmount(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="sip-rate">Expected Annual Return (%)</Label>
        <Input
          id="sip-rate"
          type="number"
          placeholder="12"
          value={sipRate}
          onChange={(e) => setSipRate(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="sip-years">Investment Period (Years)</Label>
        <Input
          id="sip-years"
          type="number"
          placeholder="15"
          value={sipYears}
          onChange={(e) => setSipYears(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="sip-stepup">Annual Step-up (%)</Label>
        <Input
          id="sip-stepup"
          type="number"
          placeholder="10"
          value={sipStepUp}
          onChange={(e) => setSipStepUp(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional: Increase SIP amount annually
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={calculateSIP} className="flex-1">
          Calculate SIP Returns
        </Button>
        <Button onClick={resetForm} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  );

  const resultsSection = result && (
    <ResultsDisplay
      title="SIP Results"
      results={[
        {
          label: "Maturity Amount",
          value: `₹${result.maturityAmount.toLocaleString()}`,
          bgColor: "bg-green-50",
        },
        {
          label: "Total Investment",
          value: `₹${result.totalInvestment.toLocaleString()}`,
          bgColor: "bg-blue-50",
        },
        {
          label: "Wealth Gained",
          value: `₹${result.wealthGained.toLocaleString()}`,
          bgColor: "bg-yellow-50",
        },
        ...(result.stepUpBenefit
          ? [
              {
                label: "Step-up Benefit",
                value: `₹${result.stepUpBenefit.toLocaleString()}`,
                bgColor: "bg-purple-50",
              },
            ]
          : []),
      ]}
      infoMessage="SIP returns are subject to market risk and past performance doesn't guarantee future results"
    />
  );

  return (
    <CalculatorLayout
      title="SIP Calculator"
      icon={LineChart}
      description="Calculate systematic investment plan returns with optional step-up feature"
    >
      {inputSection}
      {resultsSection}
    </CalculatorLayout>
  );
};
