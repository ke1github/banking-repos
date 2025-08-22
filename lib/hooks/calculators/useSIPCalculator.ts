import { useState } from "react";
import { SIPResult } from "@/types/calculators";

export const useSIPCalculator = () => {
  const [sipAmount, setSipAmount] = useState("");
  const [sipRate, setSipRate] = useState("");
  const [sipYears, setSipYears] = useState("");
  const [sipStepUp, setSipStepUp] = useState("");
  const [result, setResult] = useState<SIPResult | null>(null);

  const calculateSIP = () => {
    const monthlyAmount = parseFloat(sipAmount);
    const expectedRate = parseFloat(sipRate) / 100 / 12;
    const investmentYears = parseFloat(sipYears);
    const stepUpPercent = parseFloat(sipStepUp) / 100 || 0;

    if (monthlyAmount && expectedRate && investmentYears) {
      const months = investmentYears * 12;

      // Basic SIP calculation
      const maturityAmount =
        monthlyAmount *
        ((Math.pow(1 + expectedRate, months) - 1) / expectedRate) *
        (1 + expectedRate);
      const totalInvestment = monthlyAmount * months;
      const wealthGained = maturityAmount - totalInvestment;

      let stepUpBenefit = 0;
      if (stepUpPercent > 0) {
        // Calculate with step-up SIP
        let stepUpMaturity = 0;
        let currentSip = monthlyAmount;

        for (let year = 1; year <= investmentYears; year++) {
          const yearlyAmount = currentSip * 12;
          const yearsRemaining = investmentYears - year + 1;
          stepUpMaturity +=
            yearlyAmount * Math.pow(1 + expectedRate * 12, yearsRemaining);
          currentSip = currentSip * (1 + stepUpPercent);
        }

        stepUpBenefit = stepUpMaturity - maturityAmount;
      }

      setResult({
        maturityAmount: Math.round(maturityAmount),
        totalInvestment: Math.round(totalInvestment),
        wealthGained: Math.round(wealthGained),
        stepUpBenefit:
          stepUpPercent > 0 ? Math.round(stepUpBenefit) : undefined,
      });
    }
  };

  const resetForm = () => {
    setSipAmount("");
    setSipRate("");
    setSipYears("");
    setSipStepUp("");
    setResult(null);
  };

  return {
    // State
    sipAmount,
    sipRate,
    sipYears,
    sipStepUp,
    result,

    // Setters
    setSipAmount,
    setSipRate,
    setSipYears,
    setSipStepUp,

    // Actions
    calculateSIP,
    resetForm,
  };
};
