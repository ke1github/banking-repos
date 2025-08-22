import { useState } from "react";

interface AssetAllocationResult {
  stocks: number;
  bonds: number;
  cash: number;
  alternatives: number;
  riskLevel: string;
  expectedReturn: string;
}

export const useAssetAllocationCalculator = () => {
  const [age, setAge] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [currentWealth, setCurrentWealth] = useState("");
  const [result, setResult] = useState<AssetAllocationResult | null>(null);

  const calculateAllocation = () => {
    const ageNum = parseFloat(age) || 0;
    const timeHorizonNum = parseFloat(timeHorizon) || 0;

    if (ageNum <= 0 || !riskTolerance || !investmentGoal) {
      alert("Please fill in all required fields.");
      return;
    }

    let stockPercentage = 100 - ageNum; // Basic age rule
    let bondPercentage = ageNum;
    let cashPercentage = 5;
    let alternativesPercentage = 0;

    // Adjust based on risk tolerance
    switch (riskTolerance) {
      case "conservative":
        stockPercentage = Math.max(stockPercentage - 20, 20);
        bondPercentage = Math.min(bondPercentage + 15, 60);
        cashPercentage = 15;
        break;
      case "moderate":
        // Use base calculation
        cashPercentage = 10;
        alternativesPercentage = 5;
        break;
      case "aggressive":
        stockPercentage = Math.min(stockPercentage + 15, 90);
        bondPercentage = Math.max(bondPercentage - 10, 5);
        cashPercentage = 5;
        alternativesPercentage = 10;
        break;
    }

    // Adjust based on investment goal
    switch (investmentGoal) {
      case "retirement":
        if (timeHorizonNum > 20) {
          stockPercentage += 10;
          bondPercentage -= 5;
        }
        break;
      case "wealth":
        stockPercentage += 15;
        bondPercentage -= 10;
        alternativesPercentage += 5;
        break;
      case "income":
        bondPercentage += 20;
        stockPercentage -= 15;
        break;
      case "preservation":
        cashPercentage += 10;
        bondPercentage += 10;
        stockPercentage -= 20;
        break;
    }

    // Adjust based on time horizon
    if (timeHorizonNum > 20) {
      stockPercentage += 5;
      bondPercentage -= 5;
    } else if (timeHorizonNum < 5) {
      stockPercentage -= 10;
      bondPercentage += 5;
      cashPercentage += 5;
    }

    // Ensure percentages add up to 100
    const total =
      stockPercentage +
      bondPercentage +
      cashPercentage +
      alternativesPercentage;
    if (total !== 100) {
      const adjustment = (100 - total) / 4;
      stockPercentage += adjustment;
      bondPercentage += adjustment;
      cashPercentage += adjustment;
      alternativesPercentage += adjustment;
    }

    // Round to nearest integer and ensure they add to 100
    const stocks = Math.max(0, Math.min(100, Math.round(stockPercentage)));
    const bonds = Math.max(0, Math.min(100, Math.round(bondPercentage)));
    const cash = Math.max(0, Math.min(100, Math.round(cashPercentage)));
    const alternatives = Math.max(0, 100 - stocks - bonds - cash);

    // Determine risk level and expected return
    let riskLevel = "Moderate";
    let expectedReturn = "7-9";

    if (stocks >= 80) {
      riskLevel = "High";
      expectedReturn = "9-12";
    } else if (stocks >= 60) {
      riskLevel = "Moderate-High";
      expectedReturn = "8-10";
    } else if (stocks >= 40) {
      riskLevel = "Moderate";
      expectedReturn = "6-8";
    } else {
      riskLevel = "Conservative";
      expectedReturn = "4-6";
    }

    setResult({
      stocks,
      bonds,
      cash,
      alternatives,
      riskLevel,
      expectedReturn,
    });
  };

  const resetCalculator = () => {
    setAge("");
    setRiskTolerance("");
    setInvestmentGoal("");
    setTimeHorizon("");
    setCurrentWealth("");
    setResult(null);
  };

  return {
    age,
    setAge,
    riskTolerance,
    setRiskTolerance,
    investmentGoal,
    setInvestmentGoal,
    timeHorizon,
    setTimeHorizon,
    currentWealth,
    setCurrentWealth,
    result,
    calculateAllocation,
    resetCalculator,
  };
};
