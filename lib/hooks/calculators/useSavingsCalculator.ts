import { useState } from "react";
import {
  SavingsResult,
  CompoundFrequency,
  CalculationType,
} from "@/types/calculators";

export const useSavingsCalculator = () => {
  const [monthlyDeposit, setMonthlyDeposit] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [inflationRate, setInflationRate] = useState("");
  const [compoundFrequency, setCompoundFrequency] =
    useState<CompoundFrequency>("monthly");
  const [calculationType, setCalculationType] =
    useState<CalculationType>("future-value");
  const [result, setResult] = useState<SavingsResult | null>(null);

  const calculateSavings = () => {
    const P = parseFloat(monthlyDeposit) || 0;
    const r = parseFloat(interestRate) / 100;
    const t = parseFloat(timePeriod);
    const target = parseFloat(targetAmount) || 0;
    const inflation = parseFloat(inflationRate) / 100 || 0;

    if (calculationType === "future-value" && P && r && t) {
      const monthlyRate = r / 12;
      const months = t * 12;

      // Future Value of Ordinary Annuity
      const futureValue =
        P * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const totalDeposits = P * months;
      const totalInterest = futureValue - totalDeposits;

      // Real value considering inflation
      const realValue =
        inflation > 0 ? futureValue / Math.pow(1 + inflation, t) : futureValue;

      setResult({
        futureValue,
        totalDeposits,
        totalInterest,
        realValue,
      });
    } else if (calculationType === "goal-planning" && target && r && t) {
      const monthlyRate = r / 12;
      const months = t * 12;

      // Required monthly deposit for goal
      const monthlyRequiredForGoal =
        target / ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      const totalDeposits = monthlyRequiredForGoal * months;
      const totalInterest = target - totalDeposits;

      setResult({
        futureValue: target,
        totalDeposits,
        totalInterest,
        monthlyRequiredForGoal,
      });
    } else if (calculationType === "time-to-goal" && P && target && r) {
      const monthlyRate = r / 12;

      // Time required to reach goal
      const yearsToReachGoal =
        Math.log(1 + (target * monthlyRate) / P) /
        (12 * Math.log(1 + monthlyRate));
      const months = yearsToReachGoal * 12;
      const totalDeposits = P * months;
      const totalInterest = target - totalDeposits;

      setResult({
        futureValue: target,
        totalDeposits,
        totalInterest,
        yearsToReachGoal,
      });
    }
  };

  const resetForm = () => {
    setMonthlyDeposit("");
    setInterestRate("");
    setTimePeriod("");
    setTargetAmount("");
    setInflationRate("");
    setCompoundFrequency("monthly");
    setCalculationType("future-value");
    setResult(null);
  };

  return {
    monthlyDeposit,
    interestRate,
    timePeriod,
    targetAmount,
    inflationRate,
    compoundFrequency,
    calculationType,
    result,
    setMonthlyDeposit,
    setInterestRate,
    setTimePeriod,
    setTargetAmount,
    setInflationRate,
    setCompoundFrequency,
    setCalculationType,
    calculateSavings,
    resetForm,
  };
};
