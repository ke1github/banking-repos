"use client";

import {
  FinancialStatement,
  CompanyProfile,
  FinancialRatio,
  ValuationModel,
  IndustryAnalysis,
  PeerComparisonItem,
  AnalystRating,
  CompanyInsiderTrading,
  ESGScore,
  MacroEconomicIndicator,
  FinancialLineItem,
} from "../types/fundamental-analysis-types";

class FundamentalAnalysisService {
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
  private readonly DEFAULT_TTL = 60000; // 1 minute

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
   * Generic method to fetch data with caching
   */
  private async fetchWithCache<T>(
    cacheKey: string,
    fetchData: () => T,
    ttl = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.getCachedData<T>(cacheKey);
    if (cached) return cached;

    // In a real implementation, this would typically await an API call
    // For now, we'll get the mock data
    const data = fetchData();
    this.setCachedData(cacheKey, data, ttl);
    return data;
  }

  /**
   * Get company profile information
   */
  async getCompanyProfile(ticker: string): Promise<CompanyProfile> {
    return this.fetchWithCache<CompanyProfile>(
      `company-profile-${ticker}`,
      () => this.getMockCompanyProfile(ticker)
    );
  }

  /**
   * Get financial statements for a company
   */
  async getFinancialStatements(
    ticker: string,
    reportType: "income" | "balance" | "cash-flow",
    period: "annual" | "quarterly",
    limit: number = 5
  ): Promise<FinancialStatement[]> {
    return this.fetchWithCache<FinancialStatement[]>(
      `financial-statements-${ticker}-${reportType}-${period}-${limit}`,
      () => this.getMockFinancialStatements(ticker, reportType, period, limit)
    );
  }

  /**
   * Get financial ratios for a company
   */
  async getFinancialRatios(
    ticker: string,
    period: "annual" | "quarterly" | "ttm",
    limit: number = 5
  ): Promise<FinancialRatio[]> {
    return this.fetchWithCache<FinancialRatio[]>(
      `financial-ratios-${ticker}-${period}-${limit}`,
      () => this.getMockFinancialRatios(ticker, period, limit)
    );
  }

  /**
   * Get valuation models for a company
   */
  async getValuationModels(
    ticker: string
  ): Promise<Record<string, ValuationModel>> {
    return this.fetchWithCache<Record<string, ValuationModel>>(
      `valuation-models-${ticker}`,
      () => this.getMockValuationModels(ticker)
    );
  }

  /**
   * Get industry analysis for a company's industry
   */
  async getIndustryAnalysis(
    ticker: string,
    period: "annual" | "quarterly" | "ttm"
  ): Promise<IndustryAnalysis> {
    return this.fetchWithCache<IndustryAnalysis>(
      `industry-analysis-${ticker}-${period}`,
      () => this.getMockIndustryAnalysis(ticker, period)
    );
  }

  /**
   * Get peer comparison data for a company
   */
  async getPeerComparison(
    ticker: string,
    metrics: string[] = [
      "peRatio",
      "evToEbitda",
      "returnOnEquity",
      "operatingMargin",
    ]
  ): Promise<PeerComparisonItem[]> {
    return this.fetchWithCache<PeerComparisonItem[]>(
      `peer-comparison-${ticker}-${metrics.join("-")}`,
      () => this.getMockPeerComparison(ticker)
    );
  }

  /**
   * Get analyst ratings for a company
   */
  async getAnalystRatings(ticker: string): Promise<AnalystRating[]> {
    return this.fetchWithCache<AnalystRating[]>(
      `analyst-ratings-${ticker}`,
      () => this.getMockAnalystRatings(ticker)
    );
  }

  /**
   * Get insider trading data for a company
   */
  async getInsiderTrading(
    ticker: string,
    limit: number = 10
  ): Promise<CompanyInsiderTrading[]> {
    return this.fetchWithCache<CompanyInsiderTrading[]>(
      `insider-trading-${ticker}-${limit}`,
      () => this.getMockInsiderTrading(ticker, limit)
    );
  }

  /**
   * Get ESG scores for a company
   */
  async getESGScores(ticker: string): Promise<ESGScore> {
    return this.fetchWithCache<ESGScore>(`esg-scores-${ticker}`, () =>
      this.getMockESGScores(ticker)
    );
  }

  /**
   * Get macroeconomic indicators
   */
  async getMacroEconomicIndicators(
    country: string = "US",
    categories: string[] = []
  ): Promise<MacroEconomicIndicator[]> {
    return this.fetchWithCache<MacroEconomicIndicator[]>(
      `macro-indicators-${country}-${categories.join("-")}`,
      () => this.getMockMacroEconomicIndicators(country, categories)
    );
  }

  // Mock data implementation methods
  private getMockCompanyProfile(ticker: string): CompanyProfile {
    const mockProfiles: Record<string, CompanyProfile> = {
      AAPL: {
        id: "cp-apple",
        ticker: "AAPL",
        name: "Apple Inc.",
        description:
          "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services.",
        sector: "Technology",
        industry: "Consumer Electronics",
        employees: 164000,
        ceo: "Tim Cook",
        founded: 1976,
        headquarters: "Cupertino, California, USA",
        website: "https://www.apple.com",
        logoUrl: "/mock-data/logos/apple.png",
        marketCap: 2950000000000,
        exchange: "NASDAQ",
      },
      MSFT: {
        id: "cp-microsoft",
        ticker: "MSFT",
        name: "Microsoft Corporation",
        description:
          "Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.",
        sector: "Technology",
        industry: "Software—Infrastructure",
        employees: 221000,
        ceo: "Satya Nadella",
        founded: 1975,
        headquarters: "Redmond, Washington, USA",
        website: "https://www.microsoft.com",
        logoUrl: "/mock-data/logos/microsoft.png",
        marketCap: 2800000000000,
        exchange: "NASDAQ",
      },
      GOOGL: {
        id: "cp-alphabet",
        ticker: "GOOGL",
        name: "Alphabet Inc.",
        description:
          "Alphabet Inc. provides various products and platforms in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.",
        sector: "Technology",
        industry: "Internet Content & Information",
        employees: 182000,
        ceo: "Sundar Pichai",
        founded: 1998,
        headquarters: "Mountain View, California, USA",
        website: "https://www.abc.xyz",
        logoUrl: "/mock-data/logos/alphabet.png",
        marketCap: 1800000000000,
        exchange: "NASDAQ",
      },
      AMZN: {
        id: "cp-amazon",
        ticker: "AMZN",
        name: "Amazon.com, Inc.",
        description:
          "Amazon.com, Inc. engages in the retail sale of consumer products and subscriptions in North America and internationally.",
        sector: "Consumer Cyclical",
        industry: "Internet Retail",
        employees: 1541000,
        ceo: "Andy Jassy",
        founded: 1994,
        headquarters: "Seattle, Washington, USA",
        website: "https://www.amazon.com",
        logoUrl: "/mock-data/logos/amazon.png",
        marketCap: 1650000000000,
        exchange: "NASDAQ",
      },
      RELIANCE: {
        id: "cp-reliance",
        ticker: "RELIANCE",
        name: "Reliance Industries Limited",
        description:
          "Reliance Industries Limited, together with its subsidiaries, engages in hydrocarbon exploration and production, petroleum refining and marketing, petrochemicals, retail, and telecommunications businesses in India and internationally.",
        sector: "Energy",
        industry: "Oil & Gas Integrated",
        employees: 236334,
        ceo: "Mukesh Ambani",
        founded: 1966,
        headquarters: "Mumbai, Maharashtra, India",
        website: "https://www.ril.com",
        logoUrl: "/mock-data/logos/reliance.png",
        marketCap: 2100000000000,
        exchange: "NSE",
      },
      ICICIBANK: {
        id: "cp-icici",
        ticker: "ICICIBANK",
        name: "ICICI Bank Limited",
        description:
          "ICICI Bank Limited provides various banking products and services in India and internationally.",
        sector: "Financial Services",
        industry: "Banks—Regional",
        employees: 103010,
        ceo: "Sandeep Bakhshi",
        founded: 1994,
        headquarters: "Mumbai, Maharashtra, India",
        website: "https://www.icicibank.com",
        logoUrl: "/mock-data/logos/icicibank.png",
        marketCap: 420000000000,
        exchange: "NSE",
      },
    };

    return mockProfiles[ticker] || this.generateGenericCompanyProfile(ticker);
  }

  private generateGenericCompanyProfile(ticker: string): CompanyProfile {
    return {
      id: `cp-${ticker.toLowerCase()}`,
      ticker: ticker,
      name: `${ticker} Corporation`,
      description: `${ticker} Corporation is a leading company in its industry.`,
      sector: "Other",
      industry: "Diversified",
      employees: Math.floor(Math.random() * 100000) + 1000,
      ceo: "John Doe",
      founded: 2000,
      headquarters: "New York, USA",
      website: `https://www.${ticker.toLowerCase()}.com`,
      logoUrl: "/mock-data/logos/generic.png",
      marketCap: Math.floor(Math.random() * 1000000000000) + 10000000000,
      exchange: "NYSE",
    };
  }

  private getMockFinancialStatements(
    ticker: string,
    reportType: "income" | "balance" | "cash-flow",
    period: "annual" | "quarterly",
    limit: number
  ): FinancialStatement[] {
    // This is a simplified mock implementation
    // A real implementation would have more comprehensive data

    const currentYear = new Date().getFullYear();
    const companyId = `cp-${ticker.toLowerCase()}`;
    const result: FinancialStatement[] = [];

    for (let i = 0; i < limit; i++) {
      const year = currentYear - i;
      const statement: FinancialStatement = {
        id: `fs-${ticker}-${reportType}-${year}`,
        companyId,
        period,
        year,
        reportType,
        reportDate: new Date(year, 11, 31),
        currency:
          ticker === "RELIANCE" || ticker === "ICICIBANK" ? "INR" : "USD",
        items: this.generateMockFinancialLineItems(ticker, reportType, year, i),
      };
      result.push(statement);
    }

    return result;
  }

  private generateMockFinancialLineItems(
    ticker: string,
    reportType: string,
    year: number,
    index: number
  ): FinancialLineItem[] {
    // This would be a complex implementation in a real app
    // For simplicity, we're generating some basic mock data

    const baseMultiplier = 1 - index * 0.05; // Decrease by 5% each year back

    if (reportType === "income") {
      const revenue =
        ticker === "AAPL"
          ? 394328000000 * baseMultiplier
          : Math.random() * 100000000000 * baseMultiplier;

      const cogs = revenue * 0.65;
      const grossProfit = revenue - cogs;
      const operatingExpenses = grossProfit * 0.4;
      const operatingIncome = grossProfit - operatingExpenses;
      const netIncome = operatingIncome * 0.75;

      return [
        {
          id: "1",
          name: "Revenue",
          value: revenue,
          order: 1,
          unit: "millions",
        },
        {
          id: "2",
          name: "Cost of Goods Sold",
          value: cogs,
          order: 2,
          unit: "millions",
        },
        {
          id: "3",
          name: "Gross Profit",
          value: grossProfit,
          isSubtotal: true,
          order: 3,
          unit: "millions",
        },
        {
          id: "4",
          name: "Operating Expenses",
          value: operatingExpenses,
          order: 4,
          unit: "millions",
        },
        {
          id: "5",
          name: "Operating Income",
          value: operatingIncome,
          isSubtotal: true,
          order: 5,
          unit: "millions",
        },
        {
          id: "6",
          name: "Net Income",
          value: netIncome,
          isTotal: true,
          order: 6,
          unit: "millions",
        },
      ];
    } else if (reportType === "balance") {
      const assets =
        ticker === "AAPL"
          ? 323888000000 * baseMultiplier
          : Math.random() * 500000000000 * baseMultiplier;

      const liabilities = assets * 0.4;
      const equity = assets - liabilities;

      return [
        {
          id: "1",
          name: "Total Assets",
          value: assets,
          isTotal: true,
          order: 1,
          unit: "millions",
        },
        {
          id: "2",
          name: "Total Liabilities",
          value: liabilities,
          isTotal: true,
          order: 2,
          unit: "millions",
        },
        {
          id: "3",
          name: "Total Equity",
          value: equity,
          isTotal: true,
          order: 3,
          unit: "millions",
        },
      ];
    } else {
      // cash-flow
      const operatingCashFlow =
        ticker === "AAPL"
          ? 104038000000 * baseMultiplier
          : Math.random() * 50000000000 * baseMultiplier;

      const investingCashFlow = -operatingCashFlow * 0.3;
      const financingCashFlow = -operatingCashFlow * 0.5;
      const netCashFlow =
        operatingCashFlow + investingCashFlow + financingCashFlow;

      return [
        {
          id: "1",
          name: "Operating Cash Flow",
          value: operatingCashFlow,
          isSubtotal: true,
          order: 1,
          unit: "millions",
        },
        {
          id: "2",
          name: "Investing Cash Flow",
          value: investingCashFlow,
          isSubtotal: true,
          order: 2,
          unit: "millions",
        },
        {
          id: "3",
          name: "Financing Cash Flow",
          value: financingCashFlow,
          isSubtotal: true,
          order: 3,
          unit: "millions",
        },
        {
          id: "4",
          name: "Net Cash Flow",
          value: netCashFlow,
          isTotal: true,
          order: 4,
          unit: "millions",
        },
      ];
    }
  }

  private getMockFinancialRatios(
    ticker: string,
    period: string,
    limit: number
  ): FinancialRatio[] {
    const currentYear = new Date().getFullYear();
    const companyId = `cp-${ticker.toLowerCase()}`;
    const result: FinancialRatio[] = [];

    for (let i = 0; i < limit; i++) {
      const year = currentYear - i;
      const baseMultiplier = 1 - i * 0.05; // Decrease by 5% each year back

      const ratio: FinancialRatio = {
        id: `ratio-${ticker}-${period}-${year}`,
        companyId,
        period: period as "annual" | "quarterly" | "ttm",
        year,
        reportDate: new Date(year, 11, 31),

        // Generate mock ratios based on ticker and year
        grossMargin: 0.35 + Math.random() * 0.1 * baseMultiplier,
        operatingMargin: 0.2 + Math.random() * 0.1 * baseMultiplier,
        netMargin: 0.15 + Math.random() * 0.05 * baseMultiplier,
        returnOnAssets: 0.08 + Math.random() * 0.04 * baseMultiplier,
        returnOnEquity: 0.15 + Math.random() * 0.1 * baseMultiplier,
        returnOnInvestedCapital: 0.12 + Math.random() * 0.08 * baseMultiplier,

        currentRatio: 1.2 + Math.random() * 0.8 * baseMultiplier,
        quickRatio: 0.9 + Math.random() * 0.6 * baseMultiplier,
        cashRatio: 0.3 + Math.random() * 0.3 * baseMultiplier,

        debtToEquity: 0.5 + Math.random() * 0.5 * baseMultiplier,
        debtToAssets: 0.3 + Math.random() * 0.2 * baseMultiplier,
        interestCoverage: 8 + Math.random() * 5 * baseMultiplier,

        assetTurnover: 0.7 + Math.random() * 0.3 * baseMultiplier,
        inventoryTurnover: 8 + Math.random() * 4 * baseMultiplier,
        receivablesTurnover: 10 + Math.random() * 5 * baseMultiplier,
        payablesTurnover: 12 + Math.random() * 4 * baseMultiplier,

        peRatio: 20 + Math.random() * 10 * baseMultiplier,
        pbRatio: 3 + Math.random() * 2 * baseMultiplier,
        evToEbitda: 12 + Math.random() * 6 * baseMultiplier,
        evToSales: 3 + Math.random() * 2 * baseMultiplier,
        priceToSalesTTM: 2.5 + Math.random() * 1.5 * baseMultiplier,
        priceToFreeCashFlow: 15 + Math.random() * 10 * baseMultiplier,

        dividendYield: 0.01 + Math.random() * 0.03 * baseMultiplier,
        dividendPayoutRatio: 0.2 + Math.random() * 0.3 * baseMultiplier,

        revenueGrowth: 0.1 + Math.random() * 0.15 * baseMultiplier,
        earningsGrowth: 0.08 + Math.random() * 0.2 * baseMultiplier,
        ebitdaGrowth: 0.09 + Math.random() * 0.18 * baseMultiplier,
      };

      result.push(ratio);
    }

    return result;
  }

  private getMockValuationModels(
    ticker: string
  ): Record<string, ValuationModel> {
    const companyId = `cp-${ticker.toLowerCase()}`;
    const profile = this.getMockCompanyProfile(ticker);
    const currentPrice =
      profile.marketCap / (Math.random() * 20000000000 + 5000000000);

    // Create a simplified DCF model
    const dcfModel: ValuationModel = {
      id: `dcf-${ticker}`,
      companyId,
      modelType: "DCF",
      createdAt: new Date(),
      updatedAt: new Date(),

      assumptions: {
        revenueGrowth: [0.15, 0.12, 0.1, 0.08, 0.06],
        ebitdaMargin: [0.3, 0.31, 0.32, 0.32, 0.33],
        taxRate: 0.25,
        capexToRevenue: 0.08,
        nwcToRevenue: 0.1,
      },
      projectionYears: 5,
      terminalGrowthRate: 0.03,
      discountRate: 0.09,

      fairValue: currentPrice * (0.8 + Math.random() * 0.4),
      upside: Math.random() * 0.3 - 0.15,
      sensitivity: {
        discountRates: [0.07, 0.08, 0.09, 0.1, 0.11],
        growthRates: [0.01, 0.02, 0.03, 0.04, 0.05],
        matrix: [
          [1.2, 1.1, 1.0, 0.9, 0.8],
          [1.3, 1.2, 1.1, 1.0, 0.9],
          [1.4, 1.3, 1.2, 1.1, 1.0],
          [1.5, 1.4, 1.3, 1.2, 1.1],
          [1.6, 1.5, 1.4, 1.3, 1.2],
        ],
      },

      modelSpecificData: {
        presentValueFcf: 500000000000,
        presentValueTerminal: 1500000000000,
        netDebt: 100000000000,
        enterpriseValue: 1900000000000,
        equityValue: 1800000000000,
        sharesOutstanding: 16500000000,
      },
    };

    // Create a comparables model
    const comparablesModel: ValuationModel = {
      id: `comps-${ticker}`,
      companyId,
      modelType: "Comparables",
      createdAt: new Date(),
      updatedAt: new Date(),

      assumptions: {
        metrics: ["peRatio", "evToEbitda", "pbRatio", "evToSales"],
        weights: [0.4, 0.3, 0.2, 0.1],
        peerGroup: ["AAPL", "MSFT", "GOOGL", "AMZN"],
      },
      projectionYears: 1,
      discountRate: 0.09,

      fairValue: currentPrice * (0.85 + Math.random() * 0.3),
      upside: Math.random() * 0.25 - 0.1,
      sensitivity: {
        discountRates: [0.07, 0.08, 0.09, 0.1, 0.11],
        growthRates: [0.01, 0.02, 0.03, 0.04, 0.05],
        matrix: [
          [1.15, 1.1, 1.05, 1.0, 0.95],
          [1.2, 1.15, 1.1, 1.05, 1.0],
          [1.25, 1.2, 1.15, 1.1, 1.05],
          [1.3, 1.25, 1.2, 1.15, 1.1],
          [1.35, 1.3, 1.25, 1.2, 1.15],
        ],
      },

      modelSpecificData: {
        peerValuations: {
          peRatio: 25,
          evToEbitda: 18,
          pbRatio: 6,
          evToSales: 5,
        },
        targetMetrics: {
          earnings: 100000000000,
          ebitda: 150000000000,
          bookValue: 400000000000,
          sales: 500000000000,
        },
        valuesFromMetrics: {
          peRatio: currentPrice * 1.1,
          evToEbitda: currentPrice * 0.95,
          pbRatio: currentPrice * 1.05,
          evToSales: currentPrice * 0.9,
        },
      },
    };

    return {
      dcf: dcfModel,
      comparables: comparablesModel,
    };
  }

  private getMockIndustryAnalysis(
    ticker: string,
    period: string
  ): IndustryAnalysis {
    const profile = this.getMockCompanyProfile(ticker);
    const currentYear = new Date().getFullYear();

    return {
      id: `industry-${profile.industry}-${currentYear}`,
      industryId: `ind-${profile.industry.toLowerCase().replace(/\s+/g, "-")}`,
      industryName: profile.industry,
      period: period as "annual" | "quarterly" | "ttm",
      year: currentYear,
      reportDate: new Date(),

      totalMarketSize: 2500000000000,
      growthRate: 0.08,
      avgProfitMargin: 0.18,
      avgROE: 0.22,
      avgPE: 24,
      concentration: 0.3,

      topCompanies: [
        {
          companyId: "cp-apple",
          companyName: "Apple Inc.",
          marketShare: 0.25,
          rank: 1,
        },
        {
          companyId: "cp-microsoft",
          companyName: "Microsoft Corporation",
          marketShare: 0.2,
          rank: 2,
        },
        {
          companyId: "cp-alphabet",
          companyName: "Alphabet Inc.",
          marketShare: 0.15,
          rank: 3,
        },
        {
          companyId: "cp-amazon",
          companyName: "Amazon.com, Inc.",
          marketShare: 0.1,
          rank: 4,
        },
        {
          companyId: `cp-${ticker.toLowerCase()}`,
          companyName: profile.name,
          marketShare: 0.05,
          rank: 5,
        },
      ],

      trends: [
        {
          name: "Digital Transformation",
          description: "Accelerating shift to digital products and services",
          impact: "positive",
          strength: 9,
        },
        {
          name: "Supply Chain Disruptions",
          description: "Ongoing global supply chain challenges",
          impact: "negative",
          strength: 7,
        },
        {
          name: "AI Integration",
          description: "Increasing adoption of AI technologies",
          impact: "positive",
          strength: 8,
        },
        {
          name: "Regulatory Scrutiny",
          description: "Growing regulatory oversight in the industry",
          impact: "negative",
          strength: 6,
        },
      ],

      swot: {
        strengths: [
          "Strong market position of established players",
          "High profit margins",
          "Significant R&D investments",
          "Brand recognition",
        ],
        weaknesses: [
          "High competition",
          "Rapid technological changes",
          "Talent acquisition challenges",
          "High capital requirements",
        ],
        opportunities: [
          "Emerging markets expansion",
          "New product categories",
          "Strategic partnerships",
          "Cloud computing growth",
        ],
        threats: [
          "Disruptive technologies",
          "Economic downturns",
          "Increasing regulations",
          "Cybersecurity risks",
        ],
      },
    };
  }

  private getMockPeerComparison(ticker: string): PeerComparisonItem[] {
    const profile = this.getMockCompanyProfile(ticker);
    const colors = [
      "#0088FE",
      "#00C49F",
      "#FFBB28",
      "#FF8042",
      "#8884D8",
      "#82CA9D",
      "#FF6E6E",
      "#A0522D",
      "#6495ED",
      "#FFA500",
    ];

    const peers: PeerComparisonItem[] = [];

    // Generate random metrics for a company
    const generateMetrics = () => ({
      peRatio: 25 + (Math.random() * 10 - 5),
      pbRatio: 5 + (Math.random() * 2 - 1),
      evToEbitda: 15 + (Math.random() * 5 - 2.5),
      evToSales: 4 + (Math.random() * 2 - 1),
      returnOnEquity: 0.18 + (Math.random() * 0.08 - 0.04),
      returnOnAssets: 0.1 + (Math.random() * 0.04 - 0.02),
      operatingMargin: 0.25 + (Math.random() * 0.1 - 0.05),
      netMargin: 0.18 + (Math.random() * 0.08 - 0.04),
      revenueGrowth: 0.12 + (Math.random() * 0.1 - 0.05),
      earningsGrowth: 0.15 + (Math.random() * 0.15 - 0.075),
      debtToEquity: 0.5 + (Math.random() * 0.4 - 0.2),
      currentRatio: 1.5 + (Math.random() * 1 - 0.5),
      dividendYield: 0.02 + (Math.random() * 0.02 - 0.01),
    });

    // Add the target company
    peers.push({
      companyId: `cp-${ticker.toLowerCase()}`,
      ticker: ticker,
      companyName: profile.name,
      marketCap: profile.marketCap,
      metrics: generateMetrics(),
      relativePerformance: {
        peRatio: 0.5,
        pbRatio: 0.6,
        evToEbitda: 0.55,
        evToSales: 0.45,
        returnOnEquity: 0.7,
        returnOnAssets: 0.65,
        operatingMargin: 0.75,
        netMargin: 0.7,
        revenueGrowth: 0.6,
        earningsGrowth: 0.65,
        debtToEquity: 0.4,
        currentRatio: 0.6,
        dividendYield: 0.5,
      },
      color: colors[0],
    });

    // Add peer companies
    const peerTickers = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "RELIANCE",
      "ICICIBANK",
    ]
      .filter((t) => t !== ticker)
      .slice(0, 5);

    peerTickers.forEach((peerTicker, index) => {
      const peerProfile = this.getMockCompanyProfile(peerTicker);

      peers.push({
        companyId: `cp-${peerTicker.toLowerCase()}`,
        ticker: peerTicker,
        companyName: peerProfile.name,
        marketCap: peerProfile.marketCap,
        metrics: generateMetrics(),
        relativePerformance: {
          peRatio: Math.random(),
          pbRatio: Math.random(),
          evToEbitda: Math.random(),
          evToSales: Math.random(),
          returnOnEquity: Math.random(),
          returnOnAssets: Math.random(),
          operatingMargin: Math.random(),
          netMargin: Math.random(),
          revenueGrowth: Math.random(),
          earningsGrowth: Math.random(),
          debtToEquity: Math.random(),
          currentRatio: Math.random(),
          dividendYield: Math.random(),
        },
        color: colors[index + 1],
      });
    });

    return peers;
  }

  private getMockAnalystRatings(ticker: string): AnalystRating[] {
    type RatingType =
      | "Buy"
      | "Sell"
      | "Hold"
      | "Overweight"
      | "Underweight"
      | "Neutral";
    const ratings: RatingType[] = [
      "Buy",
      "Sell",
      "Hold",
      "Overweight",
      "Underweight",
      "Neutral",
    ];
    const profile = this.getMockCompanyProfile(ticker);
    const analystFirms = [
      "Morgan Stanley",
      "Goldman Sachs",
      "JP Morgan",
      "Bank of America",
      "Citigroup",
      "Wells Fargo",
      "UBS",
      "Deutsche Bank",
      "Credit Suisse",
      "Barclays",
    ];

    const currentPrice =
      profile.marketCap / (Math.random() * 20000000000 + 5000000000);
    const result: AnalystRating[] = [];

    analystFirms.forEach((firm, index) => {
      const rating = ratings[Math.floor(Math.random() * ratings.length)];
      const previousRating =
        ratings[Math.floor(Math.random() * ratings.length)];
      const priceTarget = currentPrice * (0.8 + Math.random() * 0.4);
      const previousPriceTarget = priceTarget * (0.9 + Math.random() * 0.2);

      const today = new Date();
      const ratingDate = new Date(today);
      ratingDate.setDate(today.getDate() - Math.floor(Math.random() * 30));

      result.push({
        id: `ar-${ticker}-${index}`,
        companyId: `cp-${ticker.toLowerCase()}`,
        analystFirm: firm,
        analystName: this.getRandomAnalystName(),
        rating,
        priceTarget,
        previousRating,
        previousPriceTarget,
        date: ratingDate,
        notes: this.getRandomAnalystNote(ticker, rating, priceTarget),
      });
    });

    return result;
  }

  private getRandomAnalystName(): string {
    const firstNames = [
      "John",
      "Sarah",
      "Michael",
      "Emma",
      "David",
      "Lisa",
      "Robert",
      "Jennifer",
      "William",
      "Elizabeth",
    ];
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Miller",
      "Davis",
      "Garcia",
      "Rodriguez",
      "Wilson",
    ];

    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
      lastNames[Math.floor(Math.random() * lastNames.length)]
    }`;
  }

  private getRandomAnalystNote(
    ticker: string,
    rating: string,
    priceTarget: number
  ): string {
    const positive = [
      `${ticker} continues to outperform in its sector with strong growth prospects. Our price target of $${priceTarget.toFixed(
        2
      )} reflects confidence in the company's direction.`,
      `We see significant upside potential given the company's market position and innovation pipeline, setting a price target of $${priceTarget.toFixed(
        2
      )}.`,
      `Recent product launches are expected to drive revenue growth in the coming quarters, supporting our target of $${priceTarget.toFixed(
        2
      )}.`,
      `The company's expansion strategy in emerging markets is promising, leading to our $${priceTarget.toFixed(
        2
      )} price target.`,
    ];

    const neutral = [
      `${ticker} is fairly valued at current levels considering market conditions, with our price target at $${priceTarget.toFixed(
        2
      )}.`,
      `While the company has strong fundamentals, we see limited near-term catalysts, maintaining a price target of $${priceTarget.toFixed(
        2
      )}.`,
      `Competitive pressures may limit margin expansion in the near term. Our price target stands at $${priceTarget.toFixed(
        2
      )}.`,
      `We maintain a balanced view given macroeconomic uncertainties, with a price target of $${priceTarget.toFixed(
        2
      )}.`,
    ];

    const negative = [
      `${ticker} faces significant headwinds in its core markets, reflected in our price target of $${priceTarget.toFixed(
        2
      )}.`,
      `Valuation appears stretched relative to peers and growth prospects. We set a price target of $${priceTarget.toFixed(
        2
      )}.`,
      `Recent operational challenges may impact financial performance, leading to our $${priceTarget.toFixed(
        2
      )} price target.`,
      `Increasing competition poses risks to market share and margins, resulting in our price target of $${priceTarget.toFixed(
        2
      )}.`,
    ];

    if (rating === "Buy" || rating === "Overweight") {
      return positive[Math.floor(Math.random() * positive.length)];
    } else if (rating === "Hold" || rating === "Neutral") {
      return neutral[Math.floor(Math.random() * neutral.length)];
    } else {
      return negative[Math.floor(Math.random() * negative.length)];
    }
  }

  private getMockInsiderTrading(
    ticker: string,
    limit: number
  ): CompanyInsiderTrading[] {
    type TransactionType = "Buy" | "Sell" | "Option Exercise" | "Award";

    const profile = this.getMockCompanyProfile(ticker);
    const insiders = [
      { name: `${profile.ceo}`, position: "CEO" },
      { name: "Jane Smith", position: "CFO" },
      { name: "Robert Johnson", position: "CTO" },
      { name: "Maria Garcia", position: "COO" },
      { name: "David Brown", position: "Director" },
      { name: "Elizabeth Wilson", position: "Director" },
      { name: "Michael Davis", position: "VP, Marketing" },
      { name: "Sarah Miller", position: "VP, Sales" },
      { name: "James Thompson", position: "VP, Product" },
      { name: "Jennifer Martinez", position: "VP, HR" },
    ];

    const transactionTypes: TransactionType[] = [
      "Buy",
      "Sell",
      "Option Exercise",
      "Award",
    ];
    const result: CompanyInsiderTrading[] = [];

    for (let i = 0; i < limit; i++) {
      const insider = insiders[Math.floor(Math.random() * insiders.length)];
      const transactionType =
        transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

      const today = new Date();
      const transactionDate = new Date(today);
      transactionDate.setDate(today.getDate() - Math.floor(Math.random() * 90));

      const shareCount = Math.floor(Math.random() * 10000) + 1000;
      const sharePrice = Math.floor(Math.random() * 500) + 50;
      const totalValue = shareCount * sharePrice;
      const sharesOwned = Math.floor(Math.random() * 1000000) + 100000;

      result.push({
        id: `it-${ticker}-${i}`,
        companyId: `cp-${ticker.toLowerCase()}`,
        insiderName: insider.name,
        position: insider.position,
        transactionDate,
        transactionType,
        shareCount,
        sharePrice,
        totalValue,
        sharesOwned,
        percentOwnership:
          (sharesOwned / (profile.marketCap / sharePrice)) * 100,
      });
    }

    return result;
  }

  private getMockESGScores(ticker: string): ESGScore {
    return {
      id: `esg-${ticker}`,
      companyId: `cp-${ticker.toLowerCase()}`,
      reportDate: new Date(),
      environmentalScore: Math.floor(Math.random() * 50) + 50,
      socialScore: Math.floor(Math.random() * 50) + 50,
      governanceScore: Math.floor(Math.random() * 50) + 50,
      totalScore: Math.floor(Math.random() * 50) + 50,
      industry: this.getMockCompanyProfile(ticker).industry,
      industryAvg: {
        environmentalScore: 65,
        socialScore: 70,
        governanceScore: 75,
        totalScore: 70,
      },
      ratings: [
        { source: "MSCI", rating: "AA", scale: "AAA-CCC" },
        {
          source: "Sustainalytics",
          rating: "Medium Risk",
          scale: "Low-High Risk",
        },
        { source: "Bloomberg", rating: "58/100", scale: "0-100" },
      ],
      controversies: [
        {
          description: "Supply chain labor issues in manufacturing facilities",
          severity: "Medium",
          date: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        },
        {
          description:
            "Environmental compliance violation at production facility",
          severity: "Low",
          date: new Date(new Date().setMonth(new Date().getMonth() - 8)),
        },
      ],
    };
  }

  private getMockMacroEconomicIndicators(
    country: string,
    categories: string[]
  ): MacroEconomicIndicator[] {
    const indicators: MacroEconomicIndicator[] = [
      {
        id: "macro-fed-rate",
        name: "Federal Funds Rate",
        category: "Interest Rates",
        value: 4.75,
        previousValue: 4.5,
        change: 0.25,
        changePercent: 5.56,
        date: new Date(),
        frequency: "Monthly",
        country: "US",
        impact: {
          sectors: [
            { sectorName: "Financials", impact: "Positive", magnitude: 8 },
            { sectorName: "Utilities", impact: "Negative", magnitude: 7 },
            { sectorName: "Real Estate", impact: "Negative", magnitude: 9 },
            { sectorName: "Technology", impact: "Negative", magnitude: 6 },
          ],
        },
      },
      {
        id: "macro-cpi",
        name: "Consumer Price Index",
        category: "Inflation",
        value: 3.1,
        previousValue: 3.3,
        change: -0.2,
        changePercent: -6.06,
        date: new Date(),
        frequency: "Monthly",
        country: "US",
        impact: {
          sectors: [
            {
              sectorName: "Consumer Staples",
              impact: "Negative",
              magnitude: 7,
            },
            { sectorName: "Energy", impact: "Positive", magnitude: 6 },
            { sectorName: "Healthcare", impact: "Neutral", magnitude: 4 },
            { sectorName: "Financials", impact: "Positive", magnitude: 5 },
          ],
        },
      },
      {
        id: "macro-gdp",
        name: "GDP Growth Rate",
        category: "GDP",
        value: 2.4,
        previousValue: 2.1,
        change: 0.3,
        changePercent: 14.29,
        date: new Date(),
        frequency: "Quarterly",
        country: "US",
        impact: {
          sectors: [
            {
              sectorName: "Consumer Discretionary",
              impact: "Positive",
              magnitude: 8,
            },
            { sectorName: "Industrials", impact: "Positive", magnitude: 7 },
            { sectorName: "Materials", impact: "Positive", magnitude: 6 },
            { sectorName: "Technology", impact: "Positive", magnitude: 7 },
          ],
        },
      },
      {
        id: "macro-unemployment",
        name: "Unemployment Rate",
        category: "Employment",
        value: 3.7,
        previousValue: 3.8,
        change: -0.1,
        changePercent: -2.63,
        date: new Date(),
        frequency: "Monthly",
        country: "US",
        impact: {
          sectors: [
            {
              sectorName: "Consumer Discretionary",
              impact: "Positive",
              magnitude: 9,
            },
            { sectorName: "Financials", impact: "Positive", magnitude: 6 },
            { sectorName: "Industrials", impact: "Positive", magnitude: 7 },
            { sectorName: "Healthcare", impact: "Neutral", magnitude: 3 },
          ],
        },
      },
      {
        id: "macro-housing",
        name: "Housing Starts",
        category: "Housing",
        value: 1487,
        previousValue: 1359,
        change: 128,
        changePercent: 9.42,
        date: new Date(),
        frequency: "Monthly",
        country: "US",
        impact: {
          sectors: [
            { sectorName: "Real Estate", impact: "Positive", magnitude: 10 },
            { sectorName: "Materials", impact: "Positive", magnitude: 8 },
            {
              sectorName: "Consumer Discretionary",
              impact: "Positive",
              magnitude: 7,
            },
            { sectorName: "Financials", impact: "Positive", magnitude: 6 },
          ],
        },
      },
    ];

    // Filter by country if specified
    let result = indicators.filter((i) => i.country === country);

    // Filter by categories if specified
    if (categories.length > 0) {
      result = result.filter((i) => categories.includes(i.category));
    }

    return result.length > 0 ? result : indicators;
  }
}

export const fundamentalAnalysisService = new FundamentalAnalysisService();
