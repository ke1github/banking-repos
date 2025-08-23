import {
  FinancialGoal,
  WealthInsight,
  PortfolioOptimizationSuggestion,
  MarketPrediction,
  FinancialHealthScore,
  PersonalizedStrategy,
  AIChatMessage,
  UserFinancialProfile,
} from "../types/ai-wealth-types";

class AIWealthService {
  private baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NODE_ENV === "production"
      ? "https://banking-repos.vercel.app/"
      : "http://localhost:3000";

  private cache = new Map<
    string,
    { data: unknown; timestamp: number; ttl: number }
  >();
  private readonly DEFAULT_TTL = 30000; // 30 seconds

  private getCachedData<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, { data, timestamp: Date.now(), ttl });
  }

  /**
   * Get AI-generated insights for a user's financial situation
   */
  async getWealthInsights(userId: string): Promise<WealthInsight[]> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockWealthInsights();
  }

  /**
   * Get personalized investment strategies based on user profile
   */
  async getPersonalizedStrategies(
    userId: string
  ): Promise<PersonalizedStrategy[]> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockPersonalizedStrategies();
  }

  /**
   * Get portfolio optimization suggestions
   */
  async getPortfolioOptimizationSuggestions(
    userId: string
  ): Promise<PortfolioOptimizationSuggestion> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockPortfolioOptimizationSuggestion();
  }

  /**
   * Get market predictions for specific assets
   */
  async getMarketPredictions(
    symbols: string[]
  ): Promise<Record<string, MarketPrediction>> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockMarketPredictions(symbols);
  }

  /**
   * Get financial health score with recommendations
   */
  async getFinancialHealthScore(userId: string): Promise<FinancialHealthScore> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockFinancialHealthScore();
  }

  /**
   * Send a message to the AI financial assistant
   */
  async sendFinancialAssistantMessage(
    userId: string,
    message: string
  ): Promise<AIChatMessage> {
    // In a real implementation, this would call your AI backend
    // For now, we'll return mock data
    return this.getMockAIResponse(message);
  }

  /**
   * Get a user's financial profile
   */
  async getUserFinancialProfile(userId: string): Promise<UserFinancialProfile> {
    // In a real implementation, this would call your backend
    // For now, we'll return mock data
    return this.getMockUserFinancialProfile();
  }

  /**
   * Update a user's financial profile
   */
  async updateUserFinancialProfile(
    userId: string,
    profile: Partial<UserFinancialProfile>
  ): Promise<UserFinancialProfile> {
    // In a real implementation, this would call your backend
    // For now, we'll return mock data
    return {
      ...this.getMockUserFinancialProfile(),
      ...profile,
    };
  }

  /**
   * Get user's financial goals
   */
  async getFinancialGoals(userId: string): Promise<FinancialGoal[]> {
    // In a real implementation, this would call your backend
    // For now, we'll return mock data
    return this.getMockFinancialGoals();
  }

  /**
   * Create a new financial goal
   */
  async createFinancialGoal(
    userId: string,
    goal: Omit<FinancialGoal, "id" | "createdAt" | "updatedAt">
  ): Promise<FinancialGoal> {
    // In a real implementation, this would call your backend
    // For now, we'll return mock data
    return {
      ...goal,
      id: Math.random().toString(36).substring(2, 11),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as FinancialGoal;
  }

  /**
   * Update an existing financial goal
   */
  async updateFinancialGoal(
    userId: string,
    goalId: string,
    updates: Partial<FinancialGoal>
  ): Promise<FinancialGoal> {
    // In a real implementation, this would call your backend
    // For now, we'll return mock data
    const goals = this.getMockFinancialGoals();
    const goalIndex = goals.findIndex((g) => g.id === goalId);

    if (goalIndex === -1) {
      throw new Error("Goal not found");
    }

    const updatedGoal = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date(),
    };

    return updatedGoal;
  }

  /**
   * Delete a financial goal
   */
  async deleteFinancialGoal(
    userId: string,
    goalId: string
  ): Promise<{ success: boolean }> {
    // In a real implementation, this would call your backend
    return { success: true };
  }

  // Mock data generators for development
  private getMockWealthInsights(): WealthInsight[] {
    return [
      {
        id: "ins-1",
        type: "opportunity",
        title: "High-yield savings opportunity",
        description:
          "You currently have ₹2,50,000 in a low-interest savings account. Moving these funds to our high-yield savings product could earn you an additional ₹15,000 annually.",
        impact: "medium",
        category: "saving",
        createdAt: new Date(),
        actionable: true,
      },
      {
        id: "ins-2",
        type: "risk",
        title: "Portfolio concentration risk",
        description:
          "Your portfolio is heavily concentrated in tech stocks (62%). Consider diversifying to reduce sector-specific risk.",
        impact: "high",
        category: "investment",
        relatedAssets: ["INFY", "TCS", "HCLTECH"],
        createdAt: new Date(),
        actionable: true,
      },
      {
        id: "ins-3",
        type: "advice",
        title: "Tax-saving investment opportunity",
        description:
          "Based on your income bracket, investing in ELSS funds could save you up to ₹46,800 in taxes this financial year.",
        impact: "high",
        category: "tax",
        createdAt: new Date(),
        actionable: true,
      },
      {
        id: "ins-4",
        type: "alert",
        title: "Emergency fund below target",
        description:
          "Your emergency fund covers only 2 months of expenses. Consider increasing this to the recommended 6 months.",
        impact: "high",
        category: "saving",
        createdAt: new Date(),
        actionable: true,
      },
    ];
  }

  private getMockPersonalizedStrategies(): PersonalizedStrategy[] {
    return [
      {
        id: "strat-1",
        name: "Conservative Growth",
        description:
          "A low-risk strategy focused on capital preservation with modest growth potential.",
        riskLevel: "conservative",
        timeHorizon: "medium",
        expectedReturn: 8.5,
        assetAllocation: [
          {
            category: "Fixed Income",
            percentage: 60,
            recommendedAssets: [
              {
                symbol: "LIQUIDBEES",
                name: "Nippon India ETF Liquid BeES",
                allocation: 20,
                rationale: "Highly liquid with steady returns",
              },
              {
                symbol: "BHARAT_BOND",
                name: "Bharat Bond ETF",
                allocation: 40,
                rationale: "Government-backed bonds with tax efficiency",
              },
            ],
          },
          {
            category: "Equity",
            percentage: 30,
            recommendedAssets: [
              {
                symbol: "NIFTYBEES",
                name: "Nippon India ETF Nifty BeES",
                allocation: 15,
                rationale: "Broad market exposure with low volatility",
              },
              {
                symbol: "KOTAKBANK",
                name: "Kotak Mahindra Bank",
                allocation: 7.5,
                rationale: "Strong financial institution with growth potential",
              },
              {
                symbol: "RELIANCE",
                name: "Reliance Industries",
                allocation: 7.5,
                rationale: "Diversified business with stable returns",
              },
            ],
          },
          {
            category: "Gold",
            percentage: 10,
            recommendedAssets: [
              {
                symbol: "GOLDBEES",
                name: "Nippon India ETF Gold BeES",
                allocation: 10,
                rationale: "Hedge against inflation and market volatility",
              },
            ],
          },
        ],
        suitabilityScore: 92,
        createdAt: new Date(),
      },
      {
        id: "strat-2",
        name: "Balanced Growth",
        description:
          "A balanced approach with moderate risk, aimed at capital appreciation and income generation.",
        riskLevel: "moderate",
        timeHorizon: "medium",
        expectedReturn: 12.0,
        assetAllocation: [
          {
            category: "Fixed Income",
            percentage: 40,
            recommendedAssets: [
              {
                symbol: "BHARAT_BOND",
                name: "Bharat Bond ETF",
                allocation: 25,
                rationale: "Government-backed bonds with tax efficiency",
              },
              {
                symbol: "LIQUIDBEES",
                name: "Nippon India ETF Liquid BeES",
                allocation: 15,
                rationale: "Highly liquid with steady returns",
              },
            ],
          },
          {
            category: "Equity",
            percentage: 50,
            recommendedAssets: [
              {
                symbol: "NIFTYBEES",
                name: "Nippon India ETF Nifty BeES",
                allocation: 20,
                rationale: "Broad market exposure with moderate volatility",
              },
              {
                symbol: "HDFCBANK",
                name: "HDFC Bank",
                allocation: 10,
                rationale: "Leading private bank with strong growth",
              },
              {
                symbol: "INFY",
                name: "Infosys",
                allocation: 10,
                rationale: "Technology leader with global presence",
              },
              {
                symbol: "ITC",
                name: "ITC Ltd",
                allocation: 10,
                rationale: "Diversified business with strong dividends",
              },
            ],
          },
          {
            category: "Gold",
            percentage: 5,
            recommendedAssets: [
              {
                symbol: "GOLDBEES",
                name: "Nippon India ETF Gold BeES",
                allocation: 5,
                rationale: "Hedge against inflation and market volatility",
              },
            ],
          },
          {
            category: "International",
            percentage: 5,
            recommendedAssets: [
              {
                symbol: "MAFANG",
                name: "Motilal Oswal NASDAQ 100 ETF",
                allocation: 5,
                rationale: "Exposure to global tech giants",
              },
            ],
          },
        ],
        suitabilityScore: 85,
        createdAt: new Date(),
      },
      {
        id: "strat-3",
        name: "Aggressive Growth",
        description:
          "A high-risk, high-reward strategy focused on capital appreciation through equity investments.",
        riskLevel: "aggressive",
        timeHorizon: "long",
        expectedReturn: 15.0,
        assetAllocation: [
          {
            category: "Equity",
            percentage: 75,
            recommendedAssets: [
              {
                symbol: "NIFTYBEES",
                name: "Nippon India ETF Nifty BeES",
                allocation: 25,
                rationale: "Core market exposure",
              },
              {
                symbol: "RELIANCE",
                name: "Reliance Industries",
                allocation: 10,
                rationale: "Market leader with diversified businesses",
              },
              {
                symbol: "INFY",
                name: "Infosys",
                allocation: 10,
                rationale: "Technology leader with global presence",
              },
              {
                symbol: "HDFCBANK",
                name: "HDFC Bank",
                allocation: 10,
                rationale: "Leading private bank with strong growth",
              },
              {
                symbol: "LT",
                name: "Larsen & Toubro",
                allocation: 10,
                rationale: "Infrastructure play with strong order book",
              },
              {
                symbol: "BAJFINANCE",
                name: "Bajaj Finance",
                allocation: 10,
                rationale: "Leading NBFC with high growth potential",
              },
            ],
          },
          {
            category: "International",
            percentage: 15,
            recommendedAssets: [
              {
                symbol: "MAFANG",
                name: "Motilal Oswal NASDAQ 100 ETF",
                allocation: 15,
                rationale: "Exposure to global tech giants",
              },
            ],
          },
          {
            category: "Fixed Income",
            percentage: 10,
            recommendedAssets: [
              {
                symbol: "LIQUIDBEES",
                name: "Nippon India ETF Liquid BeES",
                allocation: 10,
                rationale: "Cash component for opportunities",
              },
            ],
          },
        ],
        suitabilityScore: 75,
        createdAt: new Date(),
      },
    ];
  }

  private getMockPortfolioOptimizationSuggestion(): PortfolioOptimizationSuggestion {
    return {
      id: "opt-1",
      currentAllocation: {
        "Large Cap Equity": 35,
        "Mid Cap Equity": 20,
        "Small Cap Equity": 15,
        "Fixed Income": 20,
        Gold: 5,
        "International Equity": 5,
      },
      suggestedAllocation: {
        "Large Cap Equity": 30,
        "Mid Cap Equity": 15,
        "Small Cap Equity": 10,
        "Fixed Income": 30,
        Gold: 5,
        "International Equity": 10,
      },
      expectedReturnCurrent: 12.5,
      expectedReturnSuggested: 11.8,
      riskScoreCurrent: 75,
      riskScoreSuggested: 65,
      rationale:
        "Your current portfolio has higher risk than necessary for your goals. The suggested allocation reduces risk while maintaining reasonable returns by increasing fixed income and international exposure for better diversification.",
      suggestedTrades: [
        {
          symbol: "NIFTYBEES",
          action: "sell",
          quantity: 10,
          targetAllocation: 15,
          currentAllocation: 20,
          rationale: "Reduce large cap exposure to lower overall risk",
        },
        {
          symbol: "JUNIORBEES",
          action: "sell",
          quantity: 15,
          targetAllocation: 10,
          currentAllocation: 15,
          rationale: "Reduce small cap exposure to lower volatility",
        },
        {
          symbol: "BHARAT_BOND",
          action: "buy",
          quantity: 25,
          targetAllocation: 20,
          currentAllocation: 10,
          rationale: "Increase fixed income for stability",
        },
        {
          symbol: "MAFANG",
          action: "buy",
          quantity: 5,
          targetAllocation: 10,
          currentAllocation: 5,
          rationale: "Increase international exposure for diversification",
        },
      ],
    };
  }

  private getMockMarketPredictions(
    symbols: string[]
  ): Record<string, MarketPrediction> {
    const predictions: Record<string, MarketPrediction> = {};

    // Generate mock predictions for each requested symbol
    symbols.forEach((symbol) => {
      const currentPrice =
        symbol === "RELIANCE"
          ? 2874.65
          : symbol === "TCS"
          ? 3675.25
          : symbol === "HDFCBANK"
          ? 1685.3
          : symbol === "INFY"
          ? 1840.75
          : Math.floor(Math.random() * 5000) + 500;

      const dayChange = (Math.random() * 0.06 - 0.03) * currentPrice; // -3% to +3%
      const weekChange = dayChange * (Math.random() * 2 + 1); // Slightly higher than daily
      const monthChange = weekChange * (Math.random() * 2 + 1); // Slightly higher than weekly
      const threeMonthChange = monthChange * (Math.random() * 2 + 1); // Slightly higher than monthly

      predictions[symbol] = {
        assetSymbol: symbol,
        assetName: this.getSymbolName(symbol),
        currentPrice,
        predictedPrice: {
          oneDay: currentPrice + dayChange,
          oneWeek: currentPrice + weekChange,
          oneMonth: currentPrice + monthChange,
          threeMonths: currentPrice + threeMonthChange,
        },
        confidence: Math.random() * 0.3 + 0.6, // 0.6 to 0.9
        factors: [
          {
            name: "Earnings Forecast",
            impact: Math.random() * 1.6 - 0.8, // -0.8 to 0.8
            description: "Recent quarterly earnings exceeded expectations",
          },
          {
            name: "Industry Trends",
            impact: Math.random() * 1.6 - 0.8,
            description: "Sector showing strong growth momentum",
          },
          {
            name: "Market Sentiment",
            impact: Math.random() * 1.6 - 0.8,
            description: "Overall positive market sentiment for this sector",
          },
          {
            name: "Technical Indicators",
            impact: Math.random() * 1.6 - 0.8,
            description: "Moving averages indicate potential upward momentum",
          },
          {
            name: "Volatility Analysis",
            impact: Math.random() * 1.6 - 0.8,
            description: "Historical volatility suggests moderate price swings",
          },
        ],
        lastUpdated: new Date(),
      };
    });

    return predictions;
  }

  private getSymbolName(symbol: string): string {
    const symbolNames: Record<string, string> = {
      RELIANCE: "Reliance Industries Ltd",
      TCS: "Tata Consultancy Services Ltd",
      INFY: "Infosys Ltd",
      HDFCBANK: "HDFC Bank Ltd",
      ICICIBANK: "ICICI Bank Ltd",
      KOTAKBANK: "Kotak Mahindra Bank Ltd",
      ITC: "ITC Ltd",
      SBIN: "State Bank of India",
      LT: "Larsen & Toubro Ltd",
      HINDUNILVR: "Hindustan Unilever Ltd",
      BAJFINANCE: "Bajaj Finance Ltd",
      BHARTIARTL: "Bharti Airtel Ltd",
      ASIANPAINT: "Asian Paints Ltd",
      MARUTI: "Maruti Suzuki India Ltd",
      WIPRO: "Wipro Ltd",
      HCLTECH: "HCL Technologies Ltd",
      SUNPHARMA: "Sun Pharmaceutical Industries Ltd",
      TATAMOTORS: "Tata Motors Ltd",
      NESTLEIND: "Nestle India Ltd",
      TITAN: "Titan Company Ltd",
      NIFTYBEES: "Nippon India ETF Nifty BeES",
      JUNIORBEES: "Nippon India ETF Junior BeES",
      BANKBEES: "Nippon India ETF Bank BeES",
      GOLDBEES: "Nippon India ETF Gold BeES",
      LIQUIDBEES: "Nippon India ETF Liquid BeES",
      MAFANG: "Motilal Oswal NASDAQ 100 ETF",
      BHARAT_BOND: "Bharat Bond ETF",
    };

    return symbolNames[symbol] || `${symbol} Stock`;
  }

  private getMockFinancialHealthScore(): FinancialHealthScore {
    return {
      overall: 72,
      components: {
        savings: 65,
        debt: 85,
        investments: 70,
        protection: 60,
        retirement: 65,
      },
      recommendations: [
        {
          priority: "high",
          category: "protection",
          description:
            "Increase emergency fund from 2 months to 6 months of expenses",
          potentialImpact: 15,
        },
        {
          priority: "high",
          category: "retirement",
          description:
            "Increase retirement contributions by at least 5% of income",
          potentialImpact: 12,
        },
        {
          priority: "medium",
          category: "investments",
          description: "Diversify portfolio to reduce concentration risk",
          potentialImpact: 8,
        },
        {
          priority: "medium",
          category: "savings",
          description:
            "Move savings to higher-yield accounts to beat inflation",
          potentialImpact: 5,
        },
        {
          priority: "low",
          category: "debt",
          description:
            "Continue current debt repayment strategy, focus on high-interest debt first",
          potentialImpact: 3,
        },
      ],
    };
  }

  private getMockAIResponse(userMessage: string): AIChatMessage {
    const responses: Record<string, string> = {
      default:
        "I'm your AI financial assistant. I can help you with investment advice, portfolio analysis, financial planning, and more. What would you like to know about your finances today?",
      hello:
        "Hello! I'm your AI financial assistant. I can help you with investment advice, portfolio analysis, financial planning, and more. What would you like to know about your finances today?",
      portfolio:
        "Your portfolio is currently valued at ₹15,28,640, up 2.3% today. Your asset allocation is 60% in equities, 30% in fixed income, 5% in gold, and 5% in international equities. I've noticed your tech sector exposure is quite high at 62% of your equity allocation. Would you like to see some diversification recommendations?",
      recommendation:
        "Based on your financial goals and risk profile, I recommend increasing your exposure to large-cap equities and reducing your mid-cap allocation. This would provide more stability while maintaining growth potential. Would you like to see specific investment recommendations?",
      market:
        "The Indian markets are showing mixed signals today. Nifty is up 0.5% while Sensex is up 0.3%. Global cues are positive with US markets closing higher yesterday. The IT and Banking sectors are outperforming, while FMCG and Auto are underperforming. Any specific sector you're interested in?",
      retirement:
        "Based on your current savings rate and investment strategy, you're on track to reach about 85% of your retirement goal by your target age of 60. To reach 100%, consider increasing your monthly SIP contributions by ₹5,000 or extending your retirement age to 62. Would you like to see a detailed retirement analysis?",
      tax: "Looking at your investment portfolio, I've identified potential tax-saving opportunities worth up to ₹46,800 this financial year. This includes maximizing your Section 80C investments through ELSS funds and utilizing your NPS Tier II account. Would you like to see a detailed tax optimization plan?",
      goals:
        "You currently have 3 financial goals set up: Retirement (60% funded), Children's Education (45% funded), and Home Purchase (25% funded). Based on your current saving and investment rate, you're on track to achieve your retirement goal, but might fall short on the other two. Would you like some suggestions to stay on track?",
    };

    // Simple keyword matching for demo purposes
    let responseText = responses.default;
    const lowerCaseMessage = userMessage.toLowerCase();

    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      responseText = responses.hello;
    } else if (
      lowerCaseMessage.includes("portfolio") ||
      lowerCaseMessage.includes("holdings") ||
      lowerCaseMessage.includes("investments")
    ) {
      responseText = responses.portfolio;
    } else if (
      lowerCaseMessage.includes("recommend") ||
      lowerCaseMessage.includes("suggest") ||
      lowerCaseMessage.includes("advice")
    ) {
      responseText = responses.recommendation;
    } else if (
      lowerCaseMessage.includes("market") ||
      lowerCaseMessage.includes("stock") ||
      lowerCaseMessage.includes("index") ||
      lowerCaseMessage.includes("nifty") ||
      lowerCaseMessage.includes("sensex")
    ) {
      responseText = responses.market;
    } else if (
      lowerCaseMessage.includes("retire") ||
      lowerCaseMessage.includes("pension")
    ) {
      responseText = responses.retirement;
    } else if (
      lowerCaseMessage.includes("tax") ||
      lowerCaseMessage.includes("80c") ||
      lowerCaseMessage.includes("saving")
    ) {
      responseText = responses.tax;
    } else if (
      lowerCaseMessage.includes("goal") ||
      lowerCaseMessage.includes("target") ||
      lowerCaseMessage.includes("plan")
    ) {
      responseText = responses.goals;
    }

    return {
      id: Math.random().toString(36).substring(2, 11),
      role: "assistant",
      content: responseText,
      timestamp: new Date(),
      relatedInsights: lowerCaseMessage.includes("tax")
        ? [this.getMockWealthInsights()[2]]
        : lowerCaseMessage.includes("portfolio")
        ? [this.getMockWealthInsights()[1]]
        : undefined,
      actions:
        lowerCaseMessage.includes("portfolio") ||
        lowerCaseMessage.includes("holdings") ||
        lowerCaseMessage.includes("investments")
          ? [
              {
                type: "view_insight",
                label: "View Portfolio Analysis",
                data: { insightId: "ins-2" },
              },
              {
                type: "view_asset",
                label: "View Tech Stocks",
                data: { symbols: ["INFY", "TCS", "HCLTECH"] },
              },
            ]
          : undefined,
    };
  }

  private getMockUserFinancialProfile(): UserFinancialProfile {
    return {
      riskTolerance: "medium",
      investmentHorizon: "medium-term",
      incomeLevel: "medium",
      savingsRate: 22, // Percentage of income
      retirementAge: 60,
      financialGoals: this.getMockFinancialGoals(),
      investmentPreferences: {
        preferredSectors: ["Technology", "Banking", "Pharmaceuticals"],
        excludedSectors: ["Tobacco", "Gambling"],
        preferESG: true,
        preferDividends: true,
        preferredGeographies: ["India", "US"],
      },
      taxBracket: "30%",
    };
  }

  private getMockFinancialGoals(): FinancialGoal[] {
    return [
      {
        id: "goal-1",
        name: "Retirement",
        targetAmount: 5000000,
        currentAmount: 3000000,
        targetDate: new Date(2045, 0, 1),
        priority: "high",
        category: "retirement",
        notes:
          "Need to ensure comfortable retirement with adequate health coverage",
        createdAt: new Date(2020, 3, 15),
        updatedAt: new Date(2023, 10, 20),
      },
      {
        id: "goal-2",
        name: "Children's Education",
        targetAmount: 2500000,
        currentAmount: 1125000,
        targetDate: new Date(2035, 5, 1),
        priority: "high",
        category: "education",
        notes: "Higher education funding for two children",
        createdAt: new Date(2021, 1, 10),
        updatedAt: new Date(2023, 11, 5),
      },
      {
        id: "goal-3",
        name: "Home Purchase",
        targetAmount: 8000000,
        currentAmount: 2000000,
        targetDate: new Date(2030, 2, 1),
        priority: "medium",
        category: "home",
        notes: "Down payment for a 3BHK apartment",
        createdAt: new Date(2022, 5, 20),
        updatedAt: new Date(2023, 12, 15),
      },
      {
        id: "goal-4",
        name: "Emergency Fund",
        targetAmount: 1000000,
        currentAmount: 600000,
        targetDate: new Date(2025, 0, 1),
        priority: "high",
        category: "emergency",
        notes: "6 months of expenses as emergency fund",
        createdAt: new Date(2022, 7, 5),
        updatedAt: new Date(2023, 11, 25),
      },
      {
        id: "goal-5",
        name: "Family Vacation",
        targetAmount: 500000,
        currentAmount: 200000,
        targetDate: new Date(2025, 11, 1),
        priority: "low",
        category: "travel",
        notes: "International family trip",
        createdAt: new Date(2023, 2, 15),
        updatedAt: new Date(2023, 12, 10),
      },
    ];
  }
}

export const aiWealthService = new AIWealthService();
