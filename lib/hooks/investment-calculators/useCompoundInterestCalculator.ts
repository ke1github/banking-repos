import { useState } from "react";

interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
  effectiveRate: string;
}

export const useCompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [frequency, setFrequency] = useState("12");
  const [additionalContribution, setAdditionalContribution] = useState("");
  const [result, setResult] = useState<CompoundInterestResult | null>(null);

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal) || 0;
    const r = (parseFloat(rate) || 0) / 100;
    const t = parseFloat(time) || 0;
    const n = parseFloat(frequency) || 12;
    const PMT = parseFloat(additionalContribution) || 0;

    if (P <= 0 || r <= 0 || t <= 0) {
      alert("Please enter valid positive values for all required fields.");
      return;
    }

    // Compound interest formula: A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]
    const compoundFactor = Math.pow(1 + r / n, n * t);
    const principalGrowth = P * compoundFactor;

    let contributionGrowth = 0;
    if (PMT > 0) {
      // For monthly contributions with compound interest
      const monthlyRate = r / 12;
      const monthlyPeriods = t * 12;
      contributionGrowth =
        (PMT * (Math.pow(1 + monthlyRate, monthlyPeriods) - 1)) / monthlyRate;
    }

    const finalAmount = principalGrowth + contributionGrowth;
    const totalContributions = P + PMT * 12 * t;
    const totalInterest = finalAmount - totalContributions;

    // Calculate effective annual rate
    const effectiveRate = (
      ((finalAmount / totalContributions - 1) / t) *
      100
    ).toFixed(2);

    setResult({
      finalAmount: Math.round(finalAmount),
      totalInterest: Math.round(totalInterest),
      totalContributions: Math.round(totalContributions),
      effectiveRate,
    });
  };

  const resetCalculator = () => {
    setPrincipal("");
    setRate("");
    setTime("");
    setFrequency("12");
    setAdditionalContribution("");
    setResult(null);
  };

  return {
    principal,
    setPrincipal,
    rate,
    setRate,
    time,
    setTime,
    frequency,
    setFrequency,
    additionalContribution,
    setAdditionalContribution,
    result,
    calculateCompoundInterest,
    resetCalculator,
  };
};
