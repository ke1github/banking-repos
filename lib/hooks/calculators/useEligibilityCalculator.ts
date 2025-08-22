import { useState } from "react";
import { EligibilityResult, LoanType } from "@/types/calculators";

export const useEligibilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [existingEMI, setExistingEMI] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTenure, setLoanTenure] = useState("");
  const [loanType, setLoanType] = useState<LoanType>("home");
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const calculateEligibility = () => {
    const income = parseFloat(monthlyIncome);
    const existingEmi = parseFloat(existingEMI) || 0;
    const rate = parseFloat(interestRate) / 100 / 12;
    const tenure = parseFloat(loanTenure) * 12;

    if (income && rate && tenure) {
      // FOIR (Fixed Obligation to Income Ratio) limits based on loan type
      const foirLimits = {
        home: 0.5, // 50% for home loans
        car: 0.4, // 40% for car loans
        personal: 0.3, // 30% for personal loans
      };

      const maxFOIR = foirLimits[loanType];
      const maxEmi = income * maxFOIR - existingEmi;

      // Calculate loan amount using EMI formula: EMI = P * r * (1+r)^n / ((1+r)^n - 1)
      // Rearranged: P = EMI * ((1+r)^n - 1) / (r * (1+r)^n)
      const maxLoanAmount =
        maxEmi *
        ((Math.pow(1 + rate, tenure) - 1) /
          (rate * Math.pow(1 + rate, tenure)));

      // Conservative recommendation (80% of max)
      const recommendedLoanAmount = maxLoanAmount * 0.8;

      setResult({
        maxLoanAmount,
        maxEmi,
        recommendedLoanAmount,
      });
    }
  };

  const resetForm = () => {
    setMonthlyIncome("");
    setMonthlyExpenses("");
    setExistingEMI("");
    setInterestRate("");
    setLoanTenure("");
    setLoanType("home");
    setResult(null);
  };

  return {
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
  };
};
