// Stock market data APIs
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  sector: string;
  exchange: string;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  dayRange: [number, number];
  week52Range: [number, number];
  pe?: number;
  pb?: number;
  dividendYield?: number;
  lastUpdated: string;
}

export interface MarketIndex {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
  volume?: string;
  lastUpdated: string;
}

export interface SectorData {
  name: string;
  symbol: string;
  performance: number;
  marketCap: number;
  stocks: number;
  topPerformers: string[];
  lastUpdated: string;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  exchange: string;
  sector?: string;
  currency: string;
  type: string;
}

// API Configuration
export const API_CONFIG = {
  // Alpha Vantage (Free tier: 5 calls per minute, 500 calls per day)
  ALPHA_VANTAGE: {
    BASE_URL: "https://www.alphavantage.co/query",
    API_KEY: process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || "demo", // Use demo for testing
  },

  // Yahoo Finance (Unofficial API)
  YAHOO_FINANCE: {
    BASE_URL: "https://query1.finance.yahoo.com/v8/finance/chart",
    SEARCH_URL: "https://query2.finance.yahoo.com/v1/finance/search",
  },

  // Finnhub (Free tier: 60 calls per minute)
  FINNHUB: {
    BASE_URL: "https://finnhub.io/api/v1",
    API_KEY: process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "",
  },

  // Polygon.io (Free tier: 5 calls per minute)
  POLYGON: {
    BASE_URL: "https://api.polygon.io/v2",
    API_KEY: process.env.NEXT_PUBLIC_POLYGON_API_KEY || "",
  },
};

// Rate limiting
const rateLimiter = new Map<string, number>();

export const checkRateLimit = (
  apiName: string,
  callsPerMinute: number
): boolean => {
  const now = Date.now();
  const lastCall = rateLimiter.get(apiName) || 0;
  const timeDiff = now - lastCall;
  const minInterval = (60 * 1000) / callsPerMinute; // milliseconds between calls

  if (timeDiff >= minInterval) {
    rateLimiter.set(apiName, now);
    return true;
  }
  return false;
};

// Error types
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public apiName?: string
  ) {
    super(message);
    this.name = "APIError";
  }
}

// Cache for API responses
const cache = new Map<
  string,
  { data: unknown; timestamp: number; ttl: number }
>();

export const getCachedData = <T>(key: string): T | null => {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
};

export const setCachedData = <T>(
  key: string,
  data: T,
  ttlMinutes: number = 5
): void => {
  const ttl = ttlMinutes * 60 * 1000; // Convert minutes to milliseconds
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
};

// Utility functions
export const formatSymbol = (
  symbol: string,
  exchange: string = "NSE"
): string => {
  // Format symbol for different exchanges
  if (exchange === "NSE" || exchange === "BSE") {
    return `${symbol}.NS`; // For Indian stocks
  }
  return symbol;
};

export const parseNumber = (value: string | number): number => {
  if (typeof value === "number") return value;
  const parsed = parseFloat(value.toString().replace(/[,$%]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateChange = (
  current: number,
  previous: number
): { change: number; changePercent: number } => {
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercent };
};
