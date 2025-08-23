// Enhanced Stock Types with additional financial metrics

import { NSEStockData, BSEStockData } from "./indianStocks";

// Financial ratios
export interface FinancialRatios {
  pe?: number; // Price to Earnings Ratio
  pb?: number; // Price to Book Ratio
  roe?: number; // Return on Equity
  roce?: number; // Return on Capital Employed
  debtToEquity?: number; // Debt to Equity Ratio
  currentRatio?: number; // Current Ratio
  dividendYield?: number; // Dividend Yield
  profitMargin?: number; // Profit Margin
  operatingMargin?: number; // Operating Margin
  peg?: number; // PEG Ratio
  evToEbitda?: number; // EV to EBITDA
}

// Quarterly results
export interface QuarterlyResult {
  quarter: string; // e.g., "Q1 2023"
  revenue: number; // Revenue for the quarter
  netProfit: number; // Net profit for the quarter
  ebitda?: number; // EBITDA for the quarter
  eps?: number; // Earnings per share
  salesGrowth?: number; // YoY sales growth in percentage
  profitGrowth?: number; // YoY profit growth in percentage
}

// Financial performance - Profit & Loss statement key metrics
export interface FinancialPerformance {
  revenue: number; // Total revenue
  expenses: number; // Total expenses
  operatingProfit: number; // Operating profit
  netProfit: number; // Net profit
  eps: number; // Earnings per share
  year: string; // Financial year
}

// Balance sheet key metrics
export interface BalanceSheet {
  totalAssets: number; // Total assets
  totalLiabilities: number; // Total liabilities
  netWorth: number; // Net worth / Shareholder's equity
  debt: number; // Total debt
  cash: number; // Cash and cash equivalents
  year: string; // Financial year
}

// Cash flow key metrics
export interface CashFlow {
  operatingCashFlow: number; // Cash flow from operations
  investingCashFlow: number; // Cash flow from investing
  financingCashFlow: number; // Cash flow from financing
  netCashFlow: number; // Net cash flow
  year: string; // Financial year
}

// Shareholding pattern
export interface ShareholdingPattern {
  promoters: number; // Percentage held by promoters
  fii: number; // Foreign Institutional Investors
  dii: number; // Domestic Institutional Investors
  public: number; // Public shareholding
  others: number; // Other shareholdings
  asOfDate: string; // As of date
}

// Peer comparison metrics
export interface PeerComparisonMetric {
  symbol: string; // Stock symbol
  name: string; // Company name
  marketCap: number; // Market capitalization
  price: number; // Current price
  pe?: number; // PE ratio
  roe?: number; // ROE
  debtToEquity?: number; // Debt to Equity
  dividendYield?: number; // Dividend Yield
}

// Enhanced stock data with additional financial information
export interface EnhancedStockFinancials extends FinancialRatios {
  quarterlyResults?: QuarterlyResult[]; // Last 4-8 quarters
  financialPerformance?: FinancialPerformance[]; // Last 3-5 years
  balanceSheet?: BalanceSheet[]; // Last 3-5 years
  cashFlow?: CashFlow[]; // Last 3-5 years
  shareholdingPattern?: ShareholdingPattern; // Current shareholding
  peers?: PeerComparisonMetric[]; // Peer companies in same sector

  // Analysis metrics
  peerAverages?: {
    // Average metrics for peer group
    pe?: number;
    roe?: number;
    debtToEquity?: number;
    dividendYield?: number;
  };

  industryRank?: {
    // Ranking within industry
    marketCap?: number; // Rank by market cap
    roe?: number; // Rank by ROE
    salesGrowth?: number; // Rank by sales growth
  };

  // Technical indicators
  technicalIndicators?: {
    rsi?: number; // Relative Strength Index
    macd?: { value: number; signal: number }; // Moving Average Convergence Divergence
    movingAverages?: { ma50: number; ma200: number }; // Moving averages
  };
}

// Main enhanced stock type combining base data with financials
export interface DetailedStock {
  // Base stock data
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
  sector?: string;
  high52w?: number;
  low52w?: number;

  // Enhanced financial data
  financials: EnhancedStockFinancials;

  // Metadata
  lastUpdate: string;
  isFavorite?: boolean;
}

// Function to convert NSE/BSE data to enhanced format with mock financial data
export function convertToDetailedStock(
  stockData: NSEStockData | BSEStockData,
  includeFinancials: boolean = false
): DetailedStock {
  let baseStock: {
    symbol: string;
    name: string;
    exchange: "NSE" | "BSE";
    price: number;
    change: number;
    changePercent: number;
    lastUpdate: string;
  } = {
    symbol: "",
    name: "",
    exchange: "NSE",
    price: 0,
    change: 0,
    changePercent: 0,
    lastUpdate: new Date().toISOString(),
  };

  // Extract base data from NSE or BSE data
  if (stockData.exchange === "NSE") {
    const nseData = stockData as NSEStockData;
    baseStock = {
      symbol: nseData.info?.symbol || "N/A",
      name: nseData.info?.companyName || "Unknown Company",
      exchange: "NSE" as const,
      price: nseData.priceInfo?.lastPrice || 0,
      change: nseData.priceInfo?.change || 0,
      changePercent: nseData.priceInfo?.pChange || 0,
      lastUpdate: nseData.lastUpdate || new Date().toISOString(),
    };
  } else {
    const bseData = stockData as BSEStockData;
    baseStock = {
      symbol: bseData.symbol || "N/A",
      name: bseData.companyName || "Unknown Company",
      exchange: "BSE" as const,
      price: bseData.currentPrice || 0,
      change: bseData.change || 0,
      changePercent: bseData.percentChange || 0,
      lastUpdate: bseData.lastUpdate || new Date().toISOString(),
    };
  }

  // Generate mock financial data if requested
  const financials: EnhancedStockFinancials = includeFinancials
    ? generateMockFinancials(baseStock.symbol, baseStock.price)
    : { pe: undefined };

  // Return detailed stock
  return {
    ...baseStock,
    volume:
      stockData.exchange === "NSE"
        ? 0
        : (stockData as BSEStockData).volume || 0,
    marketCap: Math.floor(
      baseStock.price * (Math.random() * 100000000 + 10000000)
    ),
    sector:
      stockData.exchange === "NSE"
        ? (stockData as NSEStockData).info?.industry ||
          (stockData as NSEStockData).metadata?.industry ||
          "Unknown"
        : "Unknown",
    high52w:
      stockData.exchange === "NSE"
        ? (stockData as NSEStockData).priceInfo?.weekHighLow?.max
        : undefined,
    low52w:
      stockData.exchange === "NSE"
        ? (stockData as NSEStockData).priceInfo?.weekHighLow?.min
        : undefined,
    financials,
  };
}

// Function to generate mock financial data for testing
function generateMockFinancials(
  symbol: string,
  currentPrice: number
): EnhancedStockFinancials {
  // Generate realistic ratios based on sector patterns
  const sectors: { [key: string]: string } = {
    RELIANCE: "Energy",
    TCS: "Information Technology",
    INFY: "Information Technology",
    HDFCBANK: "Banking",
    ICICIBANK: "Banking",
    SBIN: "Banking",
    LT: "Construction",
    ITC: "FMCG",
    KOTAKBANK: "Banking",
    BAJFINANCE: "Financial Services",
    BHARTIARTL: "Telecommunications",
    ASIANPAINT: "Chemicals",
    MARUTI: "Automobile",
    HCLTECH: "Information Technology",
    HINDUNILVR: "FMCG",
    WIPRO: "Information Technology",
    ADANIPORTS: "Infrastructure",
    ULTRACEMCO: "Cement",
    TATAMOTORS: "Automobile",
    POWERGRID: "Power",
  };

  const sector = sectors[symbol] || "Diversified";

  // Set different ranges based on sector
  let peRange = [15, 25];
  let roeRange = [12, 18];
  let debtToEquityRange = [0.3, 0.8];
  let dividendYieldRange = [1, 2.5];

  switch (sector) {
    case "Information Technology":
      peRange = [20, 30];
      roeRange = [18, 28];
      debtToEquityRange = [0.1, 0.3];
      dividendYieldRange = [1.5, 3];
      break;
    case "Banking":
    case "Financial Services":
      peRange = [12, 20];
      roeRange = [10, 16];
      debtToEquityRange = [6, 10];
      dividendYieldRange = [0.5, 2];
      break;
    case "FMCG":
      peRange = [40, 60];
      roeRange = [25, 40];
      debtToEquityRange = [0.1, 0.4];
      dividendYieldRange = [1, 3];
      break;
    case "Energy":
    case "Power":
      peRange = [8, 15];
      roeRange = [8, 15];
      debtToEquityRange = [0.8, 1.5];
      dividendYieldRange = [3, 6];
      break;
  }

  // Generate random values within appropriate ranges
  const pe = Math.random() * (peRange[1] - peRange[0]) + peRange[0];
  const pb = Math.random() * 3 + 1;
  const roe = Math.random() * (roeRange[1] - roeRange[0]) + roeRange[0];
  const roce = roe * (Math.random() * 0.2 + 0.9); // ROCE slightly lower than ROE usually
  const debtToEquity =
    Math.random() * (debtToEquityRange[1] - debtToEquityRange[0]) +
    debtToEquityRange[0];
  const dividendYield =
    Math.random() * (dividendYieldRange[1] - dividendYieldRange[0]) +
    dividendYieldRange[0];

  // Generate quarterly results (last 4 quarters)
  const quarters = ["Q1", "Q2", "Q3", "Q4"];
  const years = ["2023", "2024"];
  const quarterlyResults: QuarterlyResult[] = [];

  let baseRevenue = Math.random() * 10000 + 5000;
  let baseProfit = baseRevenue * (Math.random() * 0.15 + 0.1); // 10-25% profit margin

  for (let i = 0; i < 4; i++) {
    const quarter = `${quarters[i % 4]} ${years[Math.floor(i / 4)]}`;
    const growthFactor = 1 + (Math.random() * 0.1 - 0.02); // -2% to +8% growth

    baseRevenue *= growthFactor;
    baseProfit *= growthFactor * (Math.random() * 0.1 + 0.95); // Profit can grow slightly differently

    quarterlyResults.unshift({
      quarter,
      revenue: Math.round(baseRevenue),
      netProfit: Math.round(baseProfit),
      ebitda: Math.round(baseProfit * (Math.random() * 0.4 + 1.3)), // EBITDA higher than net profit
      eps: Math.round((baseProfit / (currentPrice / pe)) * 100) / 100, // EPS based on current price and PE
      salesGrowth: Math.round((growthFactor - 1) * 100 * 10) / 10,
      profitGrowth:
        Math.round(
          (growthFactor * (Math.random() * 0.1 + 0.95) - 1) * 100 * 10
        ) / 10,
    });
  }

  // Generate peer comparison (3-5 companies in same sector)
  const peerSymbols: { [sector: string]: string[] } = {
    "Information Technology": ["TCS", "INFY", "WIPRO", "HCLTECH", "TECHM"],
    Banking: ["HDFCBANK", "ICICIBANK", "SBIN", "KOTAKBANK", "AXISBANK"],
    FMCG: ["HINDUNILVR", "ITC", "DABUR", "NESTLEIND", "GODREJCP"],
    Energy: ["RELIANCE", "ONGC", "IOC", "BPCL", "GAIL"],
    Automobile: ["MARUTI", "TATAMOTORS", "M&M", "HEROMOTOCO", "BAJAJ-AUTO"],
  };

  const sectorPeers = peerSymbols[sector] || [
    "RELIANCE",
    "TCS",
    "INFY",
    "HDFCBANK",
    "ITC",
  ];
  const peers: PeerComparisonMetric[] = [];

  for (const peerSymbol of sectorPeers) {
    if (peerSymbol !== symbol) {
      peers.push({
        symbol: peerSymbol,
        name: `${peerSymbol} Limited`,
        marketCap: Math.round(Math.random() * 500000 + 100000),
        price: Math.round(Math.random() * 5000 + 500),
        pe:
          Math.round(
            (Math.random() * (peRange[1] - peRange[0]) + peRange[0]) * 10
          ) / 10,
        roe:
          Math.round(
            (Math.random() * (roeRange[1] - roeRange[0]) + roeRange[0]) * 10
          ) / 10,
        debtToEquity:
          Math.round(
            (Math.random() * (debtToEquityRange[1] - debtToEquityRange[0]) +
              debtToEquityRange[0]) *
              100
          ) / 100,
        dividendYield:
          Math.round(
            (Math.random() * (dividendYieldRange[1] - dividendYieldRange[0]) +
              dividendYieldRange[0]) *
              10
          ) / 10,
      });
    }
  }

  return {
    // Financial ratios
    pe: Math.round(pe * 10) / 10,
    pb: Math.round(pb * 10) / 10,
    roe: Math.round(roe * 10) / 10,
    roce: Math.round(roce * 10) / 10,
    debtToEquity: Math.round(debtToEquity * 100) / 100,
    currentRatio: Math.round((Math.random() * 1 + 1.2) * 100) / 100,
    dividendYield: Math.round(dividendYield * 10) / 10,
    profitMargin: Math.round((baseProfit / baseRevenue) * 100 * 10) / 10,

    // Quarterly results
    quarterlyResults,

    // Peer comparison
    peers,

    // Shareholding pattern
    shareholdingPattern: {
      promoters: Math.round(Math.random() * 30 + 40),
      fii: Math.round(Math.random() * 15 + 15),
      dii: Math.round(Math.random() * 15 + 10),
      public: Math.round(Math.random() * 15 + 5),
      others: Math.round(Math.random() * 5 + 1),
      asOfDate: "31 Mar 2024",
    },

    // Technical indicators
    technicalIndicators: {
      rsi: Math.round(Math.random() * 60 + 20),
      macd: {
        value: Math.round((Math.random() * 2 - 1) * 100) / 100,
        signal: Math.round((Math.random() * 2 - 1) * 100) / 100,
      },
      movingAverages: {
        ma50: Math.round(currentPrice * (1 + (Math.random() * 0.1 - 0.05))),
        ma200: Math.round(currentPrice * (1 + (Math.random() * 0.2 - 0.1))),
      },
    },
  };
}
