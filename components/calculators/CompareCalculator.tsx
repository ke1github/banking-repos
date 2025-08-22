import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils/calculators";

interface LoanComparison {
  bank: string;
  interestRate: number;
  processingFee: number;
  emi: number;
  totalInterest: number;
  totalAmount: number;
}

export const CompareCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [comparisonType, setComparisonType] = useState("loans");

  // Loan comparison data
  const [bank1Name, setBank1Name] = useState("");
  const [bank1Rate, setBank1Rate] = useState("");
  const [bank1Fee, setBank1Fee] = useState("");

  const [bank2Name, setBank2Name] = useState("");
  const [bank2Rate, setBank2Rate] = useState("");
  const [bank2Fee, setBank2Fee] = useState("");

  const [bank3Name, setBank3Name] = useState("");
  const [bank3Rate, setBank3Rate] = useState("");
  const [bank3Fee, setBank3Fee] = useState("");

  const [comparisons, setComparisons] = useState<LoanComparison[]>([]);

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    const months = tenure * 12;
    return (
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const compareLoans = () => {
    const principal = parseFloat(loanAmount);
    const tenure = parseFloat(loanTenure);

    if (!principal || !tenure) return;

    const banks = [
      {
        name: bank1Name,
        rate: parseFloat(bank1Rate),
        fee: parseFloat(bank1Fee) || 0,
      },
      {
        name: bank2Name,
        rate: parseFloat(bank2Rate),
        fee: parseFloat(bank2Fee) || 0,
      },
      {
        name: bank3Name,
        rate: parseFloat(bank3Rate),
        fee: parseFloat(bank3Fee) || 0,
      },
    ].filter((bank) => bank.name && bank.rate);

    const results = banks.map((bank) => {
      const emi = calculateEMI(principal, bank.rate, tenure);
      const totalAmount = emi * tenure * 12 + bank.fee;
      const totalInterest = totalAmount - principal - bank.fee;

      return {
        bank: bank.name,
        interestRate: bank.rate,
        processingFee: bank.fee,
        emi,
        totalInterest,
        totalAmount,
      };
    });

    setComparisons(results.sort((a, b) => a.totalAmount - b.totalAmount));
  };

  const resetForm = () => {
    setLoanAmount("");
    setLoanTenure("");
    setBank1Name("");
    setBank1Rate("");
    setBank1Fee("");
    setBank2Name("");
    setBank2Rate("");
    setBank2Fee("");
    setBank3Name("");
    setBank3Rate("");
    setBank3Fee("");
    setComparisons([]);
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="comparison-type">Comparison Type</Label>
        <Select value={comparisonType} onValueChange={setComparisonType}>
          <SelectTrigger>
            <SelectValue placeholder="Select comparison type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="loans">Loan Comparison</SelectItem>
            <SelectItem value="investments">Investment Comparison</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {comparisonType === "loans" && (
        <>
          <FormField
            id="loan-amount"
            label="Loan Amount (₹)"
            type="number"
            placeholder="10,00,000"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />

          <FormField
            id="loan-tenure"
            label="Loan Tenure (Years)"
            type="number"
            placeholder="20"
            value={loanTenure}
            onChange={(e) => setLoanTenure(e.target.value)}
          />

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Bank 1</h4>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                id="bank1-name"
                label="Bank Name"
                placeholder="SBI"
                value={bank1Name}
                onChange={(e) => setBank1Name(e.target.value)}
              />
              <FormField
                id="bank1-rate"
                label="Interest Rate (%)"
                type="number"
                placeholder="8.5"
                value={bank1Rate}
                onChange={(e) => setBank1Rate(e.target.value)}
              />
              <FormField
                id="bank1-fee"
                label="Processing Fee (₹)"
                type="number"
                placeholder="25000"
                value={bank1Fee}
                onChange={(e) => setBank1Fee(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Bank 2</h4>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                id="bank2-name"
                label="Bank Name"
                placeholder="HDFC"
                value={bank2Name}
                onChange={(e) => setBank2Name(e.target.value)}
              />
              <FormField
                id="bank2-rate"
                label="Interest Rate (%)"
                type="number"
                placeholder="8.75"
                value={bank2Rate}
                onChange={(e) => setBank2Rate(e.target.value)}
              />
              <FormField
                id="bank2-fee"
                label="Processing Fee (₹)"
                type="number"
                placeholder="30000"
                value={bank2Fee}
                onChange={(e) => setBank2Fee(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Bank 3</h4>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                id="bank3-name"
                label="Bank Name"
                placeholder="ICICI"
                value={bank3Name}
                onChange={(e) => setBank3Name(e.target.value)}
              />
              <FormField
                id="bank3-rate"
                label="Interest Rate (%)"
                type="number"
                placeholder="9.0"
                value={bank3Rate}
                onChange={(e) => setBank3Rate(e.target.value)}
              />
              <FormField
                id="bank3-fee"
                label="Processing Fee (₹)"
                type="number"
                placeholder="20000"
                value={bank3Fee}
                onChange={(e) => setBank3Fee(e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {comparisonType === "investments" && (
        <div className="text-center p-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-4" />
          <p>Investment comparison feature coming soon...</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={compareLoans}
          className="flex-1"
          disabled={comparisonType !== "loans"}
        >
          Compare
        </Button>
        <Button variant="outline" onClick={resetForm}>
          Reset
        </Button>
      </div>
    </div>
  );

  const resultSection = comparisons.length > 0 && (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Loan Comparison Results</h3>
      <div className="space-y-3">
        {comparisons.map((comparison, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              index === 0
                ? "border-green-400 bg-green-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-lg">{comparison.bank}</h4>
                {index === 0 && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Best Option
                  </span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Interest Rate</div>
                <div className="font-semibold">{comparison.interestRate}%</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Monthly EMI</div>
                <div className="font-semibold">
                  {formatCurrency(comparison.emi)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Total Interest</div>
                <div className="font-semibold">
                  {formatCurrency(comparison.totalInterest)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Total Cost</div>
                <div className="font-semibold">
                  {formatCurrency(comparison.totalAmount)}
                </div>
              </div>
            </div>

            {comparison.processingFee > 0 && (
              <div className="mt-2 text-xs text-gray-600">
                Processing Fee: {formatCurrency(comparison.processingFee)}
              </div>
            )}
          </div>
        ))}
      </div>

      {comparisons.length > 1 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Savings with best option:</strong>{" "}
            {formatCurrency(
              comparisons[comparisons.length - 1].totalAmount -
                comparisons[0].totalAmount
            )}{" "}
            compared to most expensive option
          </div>
        </div>
      )}
    </div>
  );

  return (
    <CalculatorLayout title="Compare Calculator" icon={BarChart3}>
      {inputSection}
      {resultSection}
    </CalculatorLayout>
  );
};
