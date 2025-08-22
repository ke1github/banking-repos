import { useState } from "react";
import { FDResult, CompoundFrequency } from "@/types/calculators";

export const useFDCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [compoundFrequency, setCompoundFrequency] =
    useState<CompoundFrequency>("quarterly");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState<FDResult | null>(null);

  const calculateFD = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(tenure);
    const tax = parseFloat(taxRate) / 100 || 0;

    if (P && r && t) {
      let n = 4; // quarterly compounding by default
      if (compoundFrequency === "monthly") n = 12;
      else if (compoundFrequency === "yearly") n = 1;
      else if (compoundFrequency === "quarterly") n = 4;

      // Compound Interest Formula: A = P(1 + r/n)^(nt)
      const maturityAmount = P * Math.pow(1 + r / n, n * t);
      const interestEarned = maturityAmount - P;

      // Tax calculations
      const taxableInterest = interestEarned > 40000 ? interestEarned : 0; // 40k limit for FD
      const taxAmount = taxableInterest * tax;
      const postTaxReturns = maturityAmount - taxAmount;
      const effectiveRate = ((postTaxReturns - P) / P) * (1 / t) * 100;

      setResult({
        maturityAmount,
        interestEarned,
        taxableInterest,
        taxAmount,
        postTaxReturns,
        effectiveRate,
      });
    }
  };

  const resetForm = () => {
    setPrincipal("");
    setInterestRate("");
    setTenure("");
    setCompoundFrequency("quarterly");
    setTaxRate("");
    setResult(null);
  };

  return {
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
  };
};
