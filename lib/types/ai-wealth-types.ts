"use client";

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  priority: "low" | "medium" | "high";
  category:
    | "retirement"
    | "education"
    | "home"
    | "vehicle"
    | "travel"
    | "emergency"
    | "other";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WealthInsight {
  id: string;
  type: "opportunity" | "risk" | "advice" | "alert";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  category:
    | "investment"
    | "saving"
    | "spending"
    | "debt"
    | "tax"
    | "retirement"
    | "general";
  relatedAssets?: string[]; // IDs of related assets
  createdAt: Date;
  actionable: boolean;
  actionTaken?: boolean;
  dismissed?: boolean;
}

export interface PortfolioOptimizationSuggestion {
  id: string;
  currentAllocation: Record<string, number>; // Current allocation percentages
  suggestedAllocation: Record<string, number>; // Suggested allocation percentages
  expectedReturnCurrent: number;
  expectedReturnSuggested: number;
  riskScoreCurrent: number;
  riskScoreSuggested: number;
  rationale: string;
  suggestedTrades: AssetTrade[];
}

export interface AssetTrade {
  symbol: string;
  action: "buy" | "sell" | "hold";
  quantity?: number;
  targetAllocation: number;
  currentAllocation: number;
  rationale: string;
}

export interface MarketPrediction {
  assetSymbol: string;
  assetName: string;
  currentPrice: number;
  predictedPrice: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonths: number;
  };
  confidence: number; // 0-1
  factors: {
    name: string;
    impact: number; // -1 to 1, negative is bad
    description: string;
  }[];
  lastUpdated: Date;
}

export interface FinancialHealthScore {
  overall: number; // 0-100
  components: {
    savings: number;
    debt: number;
    investments: number;
    protection: number; // insurance, emergency fund
    retirement: number;
  };
  recommendations: {
    priority: "high" | "medium" | "low";
    category: string;
    description: string;
    potentialImpact: number; // 0-100 improvement in score
  }[];
}

export interface PersonalizedStrategy {
  id: string;
  name: string;
  description: string;
  riskLevel: "conservative" | "moderate" | "aggressive";
  timeHorizon: "short" | "medium" | "long";
  expectedReturn: number;
  assetAllocation: {
    category: string;
    percentage: number;
    recommendedAssets?: {
      symbol: string;
      name: string;
      allocation: number;
      rationale: string;
    }[];
  }[];
  suitabilityScore: number; // 0-100, how suitable for the user
  createdAt: Date;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  relatedInsights?: WealthInsight[];
  actions?: {
    type:
      | "view_asset"
      | "make_trade"
      | "update_goal"
      | "view_insight"
      | "other";
    label: string;
    data: Record<string, unknown>;
  }[];
}

export interface UserFinancialProfile {
  riskTolerance: "low" | "medium-low" | "medium" | "medium-high" | "high";
  investmentHorizon: "short-term" | "medium-term" | "long-term";
  incomeLevel: "low" | "medium" | "high";
  savingsRate: number; // Percentage of income
  retirementAge: number;
  financialGoals: FinancialGoal[];
  investmentPreferences: {
    preferredSectors?: string[];
    excludedSectors?: string[];
    preferESG: boolean;
    preferDividends: boolean;
    preferredGeographies?: string[];
  };
  taxBracket: string;
}
