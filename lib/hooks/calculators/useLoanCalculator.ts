import { useState } from "react";
import { LoanResult, AmortizationEntry } from "@/types/calculators";

export const useLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [prepayment, setPrepayment] = useState("");
  const [prepaymentMonth, setPrepaymentMonth] = useState("");
  const [showAmortization, setShowAmortization] = useState(false);
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const P = parseFloat(loanAmount);
    const r = parseFloat(loanRate) / 100 / 12;
    const n = parseFloat(loanTerm) * 12;
    const prepaymentAmount = parseFloat(prepayment) || 0;
    const prepayMonth = parseInt(prepaymentMonth) || 0;

    if (P && r && n) {
      const monthlyPayment =
        (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = monthlyPayment * n;
      const totalInterest = totalAmount - P;

      // Generate amortization schedule if requested
      const amortizationSchedule: AmortizationEntry[] = [];
      let prepaymentSavings = 0;

      if (showAmortization || prepaymentAmount > 0) {
        let balance = P;
        for (let month = 1; month <= n; month++) {
          const interestPayment = balance * r;
          let principalPayment = monthlyPayment - interestPayment;

          // Apply prepayment
          if (month === prepayMonth && prepaymentAmount > 0) {
            principalPayment += prepaymentAmount;
          }

          balance = Math.max(0, balance - principalPayment);

          amortizationSchedule.push({
            month,
            payment:
              month === prepayMonth
                ? monthlyPayment + prepaymentAmount
                : monthlyPayment,
            principal: principalPayment,
            interest: interestPayment,
            balance: balance,
          });

          if (balance === 0) break;
        }

        // Calculate prepayment savings
        if (prepaymentAmount > 0) {
          const originalTotalInterest = totalInterest;
          const newTotalInterest = amortizationSchedule.reduce(
            (sum, entry) => sum + entry.interest,
            0
          );
          prepaymentSavings = originalTotalInterest - newTotalInterest;
        }
      }

      setResult({
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalAmount: Math.round(totalAmount),
        amortizationSchedule: showAmortization
          ? amortizationSchedule.slice(0, 12)
          : undefined,
        prepaymentSavings:
          prepaymentAmount > 0 ? Math.round(prepaymentSavings) : undefined,
      });
    }
  };

  const resetForm = () => {
    setLoanAmount("");
    setLoanRate("");
    setLoanTerm("");
    setPrepayment("");
    setPrepaymentMonth("");
    setShowAmortization(false);
    setResult(null);
  };

  return {
    // State
    loanAmount,
    loanRate,
    loanTerm,
    prepayment,
    prepaymentMonth,
    showAmortization,
    result,

    // Setters
    setLoanAmount,
    setLoanRate,
    setLoanTerm,
    setPrepayment,
    setPrepaymentMonth,
    setShowAmortization,

    // Actions
    calculateLoan,
    resetForm,
  };
};
