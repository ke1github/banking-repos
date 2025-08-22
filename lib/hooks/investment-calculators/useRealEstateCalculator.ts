import { useState } from "react";

interface RealEstateResult {
  totalROI: number;
  cashOnCashReturn: number;
  capRate: number;
  monthlyCashFlow: number;
  annualCashFlow: number;
  futureValue: number;
  totalAppreciation: number;
}

export const useRealEstateCalculator = () => {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [propertyTaxes, setPropertyTaxes] = useState("");
  const [insurance, setInsurance] = useState("");
  const [maintenance, setMaintenance] = useState("2");
  const [vacancyRate, setVacancyRate] = useState("5");
  const [appreciationRate, setAppreciationRate] = useState("3");
  const [holdingPeriod, setHoldingPeriod] = useState("10");
  const [result, setResult] = useState<RealEstateResult | null>(null);

  const calculateRealEstate = () => {
    const price = parseFloat(purchasePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rent = parseFloat(monthlyRent) || 0;
    const expenses = parseFloat(monthlyExpenses) || 0;
    const taxes = parseFloat(propertyTaxes) || 0;
    const insuranceCost = parseFloat(insurance) || 0;
    const maintenanceRate = (parseFloat(maintenance) || 0) / 100;
    const vacancy = (parseFloat(vacancyRate) || 0) / 100;
    const appreciation = (parseFloat(appreciationRate) || 0) / 100;
    const years = parseFloat(holdingPeriod) || 0;

    if (price <= 0 || down <= 0 || rent <= 0) {
      alert(
        "Please enter valid positive values for purchase price, down payment, and monthly rent."
      );
      return;
    }

    // Calculate monthly expenses
    const monthlyTaxes = taxes / 12;
    const monthlyInsurance = insuranceCost / 12;
    const monthlyMaintenance = (price * maintenanceRate) / 12;

    // Calculate effective monthly rent (accounting for vacancy)
    const effectiveMonthlyRent = rent * (1 - vacancy);

    // Calculate total monthly expenses
    const totalMonthlyExpenses =
      expenses + monthlyTaxes + monthlyInsurance + monthlyMaintenance;

    // Calculate monthly cash flow
    const monthlyCashFlow = effectiveMonthlyRent - totalMonthlyExpenses;
    const annualCashFlow = monthlyCashFlow * 12;

    // Calculate Net Operating Income (NOI)
    const annualRent = effectiveMonthlyRent * 12;
    const annualExpenses = totalMonthlyExpenses * 12;
    const NOI = annualRent - annualExpenses;

    // Calculate Cap Rate
    const capRate = (NOI / price) * 100;

    // Calculate Cash-on-Cash Return
    const cashOnCashReturn = (annualCashFlow / down) * 100;

    // Calculate future property value
    const futureValue = price * Math.pow(1 + appreciation, years);
    const totalAppreciation = futureValue - price;

    // Calculate total return over holding period
    const totalCashFlow = annualCashFlow * years;
    const totalReturn = totalCashFlow + totalAppreciation;
    const totalROI = (totalReturn / down) * 100;

    setResult({
      totalROI,
      cashOnCashReturn,
      capRate,
      monthlyCashFlow: Math.round(monthlyCashFlow),
      annualCashFlow: Math.round(annualCashFlow),
      futureValue: Math.round(futureValue),
      totalAppreciation: Math.round(totalAppreciation),
    });
  };

  const resetCalculator = () => {
    setPurchasePrice("");
    setDownPayment("");
    setMonthlyRent("");
    setMonthlyExpenses("");
    setPropertyTaxes("");
    setInsurance("");
    setMaintenance("2");
    setVacancyRate("5");
    setAppreciationRate("3");
    setHoldingPeriod("10");
    setResult(null);
  };

  return {
    purchasePrice,
    setPurchasePrice,
    downPayment,
    setDownPayment,
    monthlyRent,
    setMonthlyRent,
    monthlyExpenses,
    setMonthlyExpenses,
    propertyTaxes,
    setPropertyTaxes,
    insurance,
    setInsurance,
    maintenance,
    setMaintenance,
    vacancyRate,
    setVacancyRate,
    appreciationRate,
    setAppreciationRate,
    holdingPeriod,
    setHoldingPeriod,
    result,
    calculateRealEstate,
    resetCalculator,
  };
};
