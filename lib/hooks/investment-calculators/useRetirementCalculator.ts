import { useState } from "react";

interface RetirementResult {
  totalSavings: number;
  monthlyIncome: number;
  totalContributions: number;
  investmentGrowth: number;
  goalMet: boolean;
}

export const useRetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState("");
  const [retirementAge, setRetirementAge] = useState("");
  const [currentSavings, setCurrentSavings] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [targetIncome, setTargetIncome] = useState("");
  const [inflationRate, setInflationRate] = useState("3");
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculateRetirement = () => {
    const currentAgeNum = parseFloat(currentAge) || 0;
    const retirementAgeNum = parseFloat(retirementAge) || 0;
    const currentSavingsNum = parseFloat(currentSavings) || 0;
    const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
    const annualReturnNum = (parseFloat(annualReturn) || 0) / 100;
    const targetIncomeNum = parseFloat(targetIncome) || 0;
    const inflationRateNum = (parseFloat(inflationRate) || 0) / 100;

    if (
      currentAgeNum <= 0 ||
      retirementAgeNum <= currentAgeNum ||
      annualReturnNum <= 0
    ) {
      alert("Please enter valid values for all required fields.");
      return;
    }

    const yearsToRetirement = retirementAgeNum - currentAgeNum;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = annualReturnNum / 12;

    // Future value of current savings
    const futureValueCurrentSavings =
      currentSavingsNum * Math.pow(1 + annualReturnNum, yearsToRetirement);

    // Future value of monthly contributions (annuity)
    let futureValueContributions = 0;
    if (monthlyContributionNum > 0 && monthlyReturn > 0) {
      futureValueContributions =
        monthlyContributionNum *
        ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    }

    const totalSavings = futureValueCurrentSavings + futureValueContributions;
    const totalContributions =
      currentSavingsNum + monthlyContributionNum * monthsToRetirement;
    const investmentGrowth = totalSavings - totalContributions;

    // Calculate safe withdrawal rate (4% rule adjusted for inflation)
    const safeWithdrawalRate = 0.04;
    const monthlyIncome = (totalSavings * safeWithdrawalRate) / 12;

    // Adjust target income for inflation
    const inflationAdjustedTarget =
      targetIncomeNum * Math.pow(1 + inflationRateNum, yearsToRetirement);
    const goalMet = monthlyIncome * 12 >= inflationAdjustedTarget;

    setResult({
      totalSavings: Math.round(totalSavings),
      monthlyIncome: Math.round(monthlyIncome),
      totalContributions: Math.round(totalContributions),
      investmentGrowth: Math.round(investmentGrowth),
      goalMet,
    });
  };

  const resetCalculator = () => {
    setCurrentAge("");
    setRetirementAge("");
    setCurrentSavings("");
    setMonthlyContribution("");
    setAnnualReturn("7");
    setTargetIncome("");
    setInflationRate("3");
    setResult(null);
  };

  return {
    currentAge,
    setCurrentAge,
    retirementAge,
    setRetirementAge,
    currentSavings,
    setCurrentSavings,
    monthlyContribution,
    setMonthlyContribution,
    annualReturn,
    setAnnualReturn,
    targetIncome,
    setTargetIncome,
    inflationRate,
    setInflationRate,
    result,
    calculateRetirement,
    resetCalculator,
  };
};
