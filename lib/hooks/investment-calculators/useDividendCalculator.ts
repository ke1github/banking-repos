import { useState } from "react";

interface DividendResult {
  finalPortfolioValue: number;
  finalAnnualDividends: number;
  monthlyDividendIncome: number;
  totalDividendsReceived: number;
  totalContributions: number;
  yieldOnCost: number;
  capitalGrowth: number;
  dividendGrowth: number;
}

export const useDividendCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState("");
  const [currentDividendYield, setCurrentDividendYield] = useState("");
  const [annualGrowthRate, setAnnualGrowthRate] = useState("");
  const [yearsToProject, setYearsToProject] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [reinvestDividends, setReinvestDividends] = useState(true);
  const [result, setResult] = useState<DividendResult | null>(null);

  const calculateDividend = () => {
    const initial = parseFloat(initialInvestment) || 0;
    const yieldRate = (parseFloat(currentDividendYield) || 0) / 100;
    const growthRate = (parseFloat(annualGrowthRate) || 0) / 100;
    const years = parseFloat(yearsToProject) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;

    if (initial <= 0 || yieldRate <= 0 || years <= 0) {
      alert("Please enter valid positive values for all required fields.");
      return;
    }

    let portfolioValue = initial;
    let totalDividendsReceived = 0;
    let currentYield = yieldRate;
    const totalContributions = initial + monthly * 12 * years;

    // Year-by-year calculation
    for (let year = 1; year <= years; year++) {
      // Add monthly contributions throughout the year
      portfolioValue += monthly * 12;

      // Calculate annual dividends
      const annualDividends = portfolioValue * currentYield;
      totalDividendsReceived += annualDividends;

      // Reinvest dividends if option is selected
      if (reinvestDividends) {
        portfolioValue += annualDividends;
      }

      // Assume stock price grows at same rate as dividends for simplicity
      // In reality, stock prices may fluctuate independently
      portfolioValue *= 1 + growthRate;

      // Increase dividend yield due to growth
      currentYield *= 1 + growthRate;
    }

    const finalAnnualDividends = portfolioValue * currentYield;
    const monthlyDividendIncome = finalAnnualDividends / 12;

    // Calculate yield on cost (annual dividends / original investment)
    const yieldOnCost = (finalAnnualDividends / initial) * 100;

    // Calculate growth breakdown
    const capitalGrowth =
      portfolioValue - totalContributions - totalDividendsReceived;
    const dividendGrowth = totalDividendsReceived;

    setResult({
      finalPortfolioValue: Math.round(portfolioValue),
      finalAnnualDividends: Math.round(finalAnnualDividends),
      monthlyDividendIncome: Math.round(monthlyDividendIncome),
      totalDividendsReceived: Math.round(totalDividendsReceived),
      totalContributions: Math.round(totalContributions),
      yieldOnCost,
      capitalGrowth: Math.round(capitalGrowth),
      dividendGrowth: Math.round(dividendGrowth),
    });
  };

  const resetCalculator = () => {
    setInitialInvestment("");
    setCurrentDividendYield("");
    setAnnualGrowthRate("");
    setYearsToProject("");
    setMonthlyContribution("");
    setReinvestDividends(true);
    setResult(null);
  };

  return {
    initialInvestment,
    setInitialInvestment,
    currentDividendYield,
    setCurrentDividendYield,
    annualGrowthRate,
    setAnnualGrowthRate,
    yearsToProject,
    setYearsToProject,
    monthlyContribution,
    setMonthlyContribution,
    reinvestDividends,
    setReinvestDividends,
    result,
    calculateDividend,
    resetCalculator,
  };
};
