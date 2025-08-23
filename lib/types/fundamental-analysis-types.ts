"use client";

export interface FinancialStatement {
  id: string;
  companyId: string;
  period: "annual" | "quarterly";
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportType: "income" | "balance" | "cash-flow";
  reportDate: Date;
  currency: string;
  items: FinancialLineItem[];
}

export interface FinancialLineItem {
  id: string;
  name: string;
  value: number;
  parentId?: string;
  isTotal?: boolean;
  isSubtotal?: boolean;
  order: number;
  unit: "millions" | "billions" | "thousands";
  growthYoY?: number;
  growthQoQ?: number;
}

export interface CompanyProfile {
  id: string;
  ticker: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  employees: number;
  ceo: string;
  founded: number;
  headquarters: string;
  website: string;
  logoUrl: string;
  marketCap: number;
  exchange: string;
}

export interface FinancialRatio {
  id: string;
  companyId: string;
  period: "annual" | "quarterly" | "ttm";
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportDate: Date;

  // Profitability ratios
  grossMargin: number;
  operatingMargin: number;
  netMargin: number;
  returnOnAssets: number;
  returnOnEquity: number;
  returnOnInvestedCapital: number;

  // Liquidity ratios
  currentRatio: number;
  quickRatio: number;
  cashRatio: number;

  // Solvency ratios
  debtToEquity: number;
  debtToAssets: number;
  interestCoverage: number;

  // Efficiency ratios
  assetTurnover: number;
  inventoryTurnover: number;
  receivablesTurnover: number;
  payablesTurnover: number;

  // Valuation ratios
  peRatio: number;
  pbRatio: number;
  evToEbitda: number;
  evToSales: number;
  priceToSalesTTM: number;
  priceToFreeCashFlow: number;

  // Dividend ratios
  dividendYield: number;
  dividendPayoutRatio: number;

  // Growth ratios
  revenueGrowth: number;
  earningsGrowth: number;
  ebitdaGrowth: number;
}

export interface ValuationModel {
  id: string;
  companyId: string;
  modelType: "DCF" | "DDM" | "Comparables" | "AssetBased" | "EVA";
  createdAt: Date;
  updatedAt: Date;

  // Common fields
  assumptions: Record<string, unknown>;
  projectionYears: number;
  terminalGrowthRate?: number;
  discountRate: number;

  // Results
  fairValue: number;
  upside: number;
  sensitivity: {
    discountRates: number[];
    growthRates: number[];
    matrix: number[][];
  };

  // Model specific fields
  modelSpecificData: Record<string, unknown>;
}

export interface IndustryAnalysis {
  id: string;
  industryId: string;
  industryName: string;
  period: "annual" | "quarterly" | "ttm";
  year: number;
  quarter?: 1 | 2 | 3 | 4;
  reportDate: Date;

  // Industry metrics
  totalMarketSize: number;
  growthRate: number;
  avgProfitMargin: number;
  avgROE: number;
  avgPE: number;
  concentration: number; // Herfindahl-Hirschman Index

  // Top players
  topCompanies: {
    companyId: string;
    companyName: string;
    marketShare: number;
    rank: number;
  }[];

  // Industry trends
  trends: {
    name: string;
    description: string;
    impact: "positive" | "negative" | "neutral";
    strength: number; // 1-10
  }[];

  // SWOT analysis
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
}

export interface PeerComparisonItem {
  companyId: string;
  ticker: string;
  companyName: string;
  marketCap: number;
  metrics: Record<string, number>;
  relativePerformance: Record<string, number>; // Percentile ranking
  color: string; // For charts
}

export interface AnalystRating {
  id: string;
  companyId: string;
  analystFirm: string;
  analystName: string;
  rating: "Buy" | "Sell" | "Hold" | "Overweight" | "Underweight" | "Neutral";
  priceTarget: number;
  previousRating?:
    | "Buy"
    | "Sell"
    | "Hold"
    | "Overweight"
    | "Underweight"
    | "Neutral";
  previousPriceTarget?: number;
  date: Date;
  notes: string;
}

export interface CompanyInsiderTrading {
  id: string;
  companyId: string;
  insiderName: string;
  position: string;
  transactionDate: Date;
  transactionType: "Buy" | "Sell" | "Option Exercise" | "Award";
  shareCount: number;
  sharePrice: number;
  totalValue: number;
  sharesOwned: number;
  percentOwnership: number;
}

export interface ESGScore {
  id: string;
  companyId: string;
  reportDate: Date;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  industry: string;
  industryAvg: {
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    totalScore: number;
  };
  ratings: {
    source: string;
    rating: string;
    scale: string;
  }[];
  controversies: {
    description: string;
    severity: "Low" | "Medium" | "High" | "Severe";
    date: Date;
  }[];
}

export interface MacroEconomicIndicator {
  id: string;
  name: string;
  category:
    | "Interest Rates"
    | "Inflation"
    | "GDP"
    | "Employment"
    | "Housing"
    | "Sentiment"
    | "Other";
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  date: Date;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Annually";
  country: string;
  impact: {
    sectors: {
      sectorName: string;
      impact: "Positive" | "Negative" | "Neutral";
      magnitude: number; // 1-10
    }[];
  };
}
