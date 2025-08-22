import { useState } from "react";
import { PPFResult } from "@/types/calculators";

export const usePPFCalculator = () => {
  const [annualDeposit, setAnnualDeposit] = useState("");
  const [currentAge, setCurrentAge] = useState("");
  const [taxSlab, setTaxSlab] = useState("");
  const [result, setResult] = useState<PPFResult | null>(null);

  const calculatePPF = () => {
    const deposit = parseFloat(annualDeposit);
    const age = parseFloat(currentAge);
    const tax = parseFloat(taxSlab) / 100 || 0;

    if (deposit && age) {
      const ppfRate = 0.071; // Current PPF rate ~7.1%
      const tenure = 15; // PPF tenure is 15 years

      // Calculate maturity using compound interest
      let maturityAmount = 0;
      for (let year = 1; year <= tenure; year++) {
        maturityAmount = (maturityAmount + deposit) * (1 + ppfRate);
      }

      const totalInvestment = deposit * tenure;
      const totalInterest = maturityAmount - totalInvestment;
      const taxSavings = deposit * tax * tenure; // 80C deduction

      setResult({
        maturityAmount,
        totalInvestment,
        totalInterest,
        taxSavings,
      });
    }
  };

  const resetForm = () => {
    setAnnualDeposit("");
    setCurrentAge("");
    setTaxSlab("");
    setResult(null);
  };

  return {
    annualDeposit,
    currentAge,
    taxSlab,
    result,
    setAnnualDeposit,
    setCurrentAge,
    setTaxSlab,
    calculatePPF,
    resetForm,
  };
};
