import { useState } from "react";

interface MonteCarloResult {
  medianValue: number;
  bestCase: number;
  worstCase: number;
  successRate: number;
  confidence90: { min: number; max: number };
  confidence50: { min: number; max: number };
}

export const useMonteCarloCalculator = () => {
  const [initialAmount, setInitialAmount] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("7");
  const [volatility, setVolatility] = useState("15");
  const [simulations, setSimulations] = useState("1000");
  const [result, setResult] = useState<MonteCarloResult | null>(null);

  const calculateMonteCarlo = () => {
    const initial = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const years = parseFloat(timeHorizon) || 0;
    const returnRate = (parseFloat(expectedReturn) || 0) / 100;
    const vol = (parseFloat(volatility) || 0) / 100;
    const numSims = parseInt(simulations) || 1000;

    if (initial <= 0 || years <= 0 || returnRate <= 0) {
      alert("Please enter valid positive values for all required fields.");
      return;
    }

    const results: number[] = [];

    for (let sim = 0; sim < numSims; sim++) {
      let portfolioValue = initial;

      for (let year = 0; year < years; year++) {
        // Generate random return using normal distribution approximation
        const u1 = Math.random();
        const u2 = Math.random();
        const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

        // Annual return with volatility
        const annualReturn = returnRate + vol * z0;

        // Apply return to current portfolio value
        portfolioValue *= 1 + annualReturn;

        // Add monthly contributions throughout the year
        for (let month = 0; month < 12; month++) {
          portfolioValue += monthly;
          portfolioValue *= 1 + annualReturn / 12;
        }
      }

      results.push(portfolioValue);
    }

    // Sort results for percentile calculations
    results.sort((a, b) => a - b);

    const getPercentile = (arr: number[], percentile: number) => {
      const index = Math.floor((percentile / 100) * arr.length);
      return arr[Math.min(index, arr.length - 1)];
    };

    const medianValue = getPercentile(results, 50);
    const bestCase = getPercentile(results, 95);
    const worstCase = getPercentile(results, 5);

    const totalInvested = initial + monthly * 12 * years;
    const successfulOutcomes = results.filter((r) => r > totalInvested).length;
    const successRate = Math.round((successfulOutcomes / numSims) * 100);

    const confidence90 = {
      min: getPercentile(results, 5),
      max: getPercentile(results, 95),
    };

    const confidence50 = {
      min: getPercentile(results, 25),
      max: getPercentile(results, 75),
    };

    setResult({
      medianValue: Math.round(medianValue),
      bestCase: Math.round(bestCase),
      worstCase: Math.round(worstCase),
      successRate,
      confidence90: {
        min: Math.round(confidence90.min),
        max: Math.round(confidence90.max),
      },
      confidence50: {
        min: Math.round(confidence50.min),
        max: Math.round(confidence50.max),
      },
    });
  };

  const resetCalculator = () => {
    setInitialAmount("");
    setMonthlyContribution("");
    setTimeHorizon("");
    setExpectedReturn("7");
    setVolatility("15");
    setSimulations("1000");
    setResult(null);
  };

  return {
    initialAmount,
    setInitialAmount,
    monthlyContribution,
    setMonthlyContribution,
    timeHorizon,
    setTimeHorizon,
    expectedReturn,
    setExpectedReturn,
    volatility,
    setVolatility,
    simulations,
    setSimulations,
    result,
    calculateMonteCarlo,
    resetCalculator,
  };
};
