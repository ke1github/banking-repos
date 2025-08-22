import { useState } from "react";

interface ROIResult {
  totalROI: number;
  annualizedROI: number;
  totalGain: number;
  totalInvestment: number;
}

export const useROICalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [finalValue, setFinalValue] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [additionalCosts, setAdditionalCosts] = useState("");
  const [result, setResult] = useState<ROIResult | null>(null);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const final = parseFloat(finalValue) || 0;
    const time = parseFloat(timePeriod) || 0;
    const costs = parseFloat(additionalCosts) || 0;

    if (initial <= 0 || final <= 0) {
      alert(
        "Please enter valid positive values for initial investment and final value."
      );
      return;
    }

    const totalInvestment = initial + costs;
    const totalGain = final - totalInvestment;
    const totalROI = (totalGain / totalInvestment) * 100;

    let annualizedROI = 0;
    if (time > 0) {
      // Compound Annual Growth Rate (CAGR)
      annualizedROI = (Math.pow(final / totalInvestment, 1 / time) - 1) * 100;
    }

    setResult({
      totalROI,
      annualizedROI,
      totalGain,
      totalInvestment,
    });
  };

  const resetCalculator = () => {
    setInitialInvestment("");
    setFinalValue("");
    setTimePeriod("");
    setAdditionalCosts("");
    setResult(null);
  };

  return {
    initialInvestment,
    setInitialInvestment,
    finalValue,
    setFinalValue,
    timePeriod,
    setTimePeriod,
    additionalCosts,
    setAdditionalCosts,
    result,
    calculateROI,
    resetCalculator,
  };
};
