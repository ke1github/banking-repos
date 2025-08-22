import { useState } from "react";

interface RebalancingAction {
  amount: number;
  action: string;
}

interface RebalancingResult {
  stocksAction: RebalancingAction;
  bondsAction: RebalancingAction;
  cashAction: RebalancingAction;
  rebalanceNeeded: boolean;
  totalTrades: number;
}

export const useRebalancingCalculator = () => {
  const [currentStocks, setCurrentStocks] = useState("");
  const [currentBonds, setCurrentBonds] = useState("");
  const [currentCash, setCurrentCash] = useState("");
  const [targetStocks, setTargetStocks] = useState("");
  const [targetBonds, setTargetBonds] = useState("");
  const [targetCash, setTargetCash] = useState("");
  const [totalPortfolio, setTotalPortfolio] = useState("");
  const [result, setResult] = useState<RebalancingResult | null>(null);

  const calculateRebalancing = () => {
    const portfolio = parseFloat(totalPortfolio) || 0;
    const currentS = parseFloat(currentStocks) || 0;
    const currentB = parseFloat(currentBonds) || 0;
    const currentC = parseFloat(currentCash) || 0;
    const targetS = parseFloat(targetStocks) || 0;
    const targetB = parseFloat(targetBonds) || 0;
    const targetT = parseFloat(targetCash) || 0;

    if (portfolio <= 0) {
      alert("Please enter a valid portfolio value.");
      return;
    }

    if (Math.abs(currentS + currentB + currentC - 100) > 1) {
      alert("Current allocation percentages should add up to 100%.");
      return;
    }

    if (Math.abs(targetS + targetB + targetT - 100) > 1) {
      alert("Target allocation percentages should add up to 100%.");
      return;
    }

    // Calculate current dollar amounts
    const currentStockValue = (currentS / 100) * portfolio;
    const currentBondValue = (currentB / 100) * portfolio;
    const currentCashValue = (currentC / 100) * portfolio;

    // Calculate target dollar amounts
    const targetStockValue = (targetS / 100) * portfolio;
    const targetBondValue = (targetB / 100) * portfolio;
    const targetCashValue = (targetT / 100) * portfolio;

    // Calculate differences
    const stockDiff = targetStockValue - currentStockValue;
    const bondDiff = targetBondValue - currentBondValue;
    const cashDiff = targetCashValue - currentCashValue;

    // Create action descriptions
    const getAction = (diff: number, assetType: string): string => {
      if (Math.abs(diff) < portfolio * 0.01) {
        // Less than 1% of portfolio
        return `${assetType} allocation is on target`;
      }
      if (diff > 0) {
        return `Buy $${Math.abs(diff).toLocaleString()} more in ${assetType}`;
      } else {
        return `Sell $${Math.abs(diff).toLocaleString()} from ${assetType}`;
      }
    };

    const stocksAction: RebalancingAction = {
      amount: Math.round(stockDiff),
      action: getAction(stockDiff, "stocks"),
    };

    const bondsAction: RebalancingAction = {
      amount: Math.round(bondDiff),
      action: getAction(bondDiff, "bonds"),
    };

    const cashAction: RebalancingAction = {
      amount: Math.round(cashDiff),
      action: getAction(cashDiff, "cash"),
    };

    const totalTrades =
      Math.abs(stockDiff) + Math.abs(bondDiff) + Math.abs(cashDiff);
    const rebalanceNeeded = totalTrades > portfolio * 0.05; // More than 5% of portfolio needs rebalancing

    setResult({
      stocksAction,
      bondsAction,
      cashAction,
      rebalanceNeeded,
      totalTrades: Math.round(totalTrades / 2), // Divide by 2 since each trade has a buy and sell side
    });
  };

  const resetCalculator = () => {
    setCurrentStocks("");
    setCurrentBonds("");
    setCurrentCash("");
    setTargetStocks("");
    setTargetBonds("");
    setTargetCash("");
    setTotalPortfolio("");
    setResult(null);
  };

  return {
    currentStocks,
    setCurrentStocks,
    currentBonds,
    setCurrentBonds,
    currentCash,
    setCurrentCash,
    targetStocks,
    setTargetStocks,
    targetBonds,
    setTargetBonds,
    targetCash,
    setTargetCash,
    totalPortfolio,
    setTotalPortfolio,
    result,
    calculateRebalancing,
    resetCalculator,
  };
};
