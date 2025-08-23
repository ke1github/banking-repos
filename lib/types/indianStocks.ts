// Indian Stock Market Types for BSE and NSE integration

export interface NSEStockData {
  info: {
    symbol: string;
    companyName: string;
    industry?: string;
    activeSeries?: string[];
    debtSeries?: string[];
    isFNOSec?: boolean;
    isCASec?: boolean;
    isSLBSec?: boolean;
    isDebtSec?: boolean;
    isSuspended?: boolean;
    tempSuspendedSeries?: string[];
    isETFSec?: boolean;
    isDelisted?: boolean;
    isin?: string;
  };
  metadata: {
    series: string;
    symbol: string;
    isin: string;
    status: string;
    listingDate: string;
    industry: string;
    lastUpdateTime: string;
    pdSectorPe: number;
    pdSymbolPe: number;
    pdSectorInd: string;
  };
  priceInfo: {
    lastPrice: number;
    change: number;
    pChange: number;
    previousClose: number;
    open: number;
    close: number;
    vwap: number;
    lowerCP: string;
    upperCP: string;
    pPriceBand: string;
    basePrice: number;
    intraDayHighLow: {
      min: number;
      max: number;
      value: number;
    };
    weekHighLow: {
      min: number;
      minDate: string;
      max: number;
      maxDate: string;
      value: number;
    };
  };
  exchange: "NSE";
  lastUpdate: string;
  source: string;
}

export interface BSEStockData {
  securityCode: string;
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume: number;
  value: number;
  totalTradedQuantity: number;
  exchange: "BSE";
  lastUpdate: string;
  source: string;
}

export interface IndianStockSearch {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  type: "equity" | "derivative" | "commodity";
  securityCode?: string;
  industry?: string;
  isin?: string;
}

export interface IndianMarketIndex {
  index: string;
  last?: number;
  currentValue?: number;
  variation?: number;
  change?: number;
  percentChange: number;
  open: number;
  high: number;
  low: number;
  previousClose?: number;
  exchange: "NSE" | "BSE";
}

export interface IndianMarketOverview {
  indices: IndianMarketIndex[];
  marketStatus: "OPEN" | "CLOSED" | "PRE_OPEN" | "AFTER_HOURS";
  lastUpdate: string;
  topGainers: IndianStockSearch[];
  topLosers: IndianStockSearch[];
  mostActive: IndianStockSearch[];
}

export interface NSESearchResult {
  symbol: string;
  symbol_info: string;
}

export interface BSESearchResult {
  SecurityCode: string;
  SecurityName: string;
}

export interface SearchResultItem {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  type: string;
  securityCode?: string;
  industry?: string;
}

export type IndianStockData = NSEStockData | BSEStockData;

// Utility type guards
export function isNSEStock(stock: IndianStockData): stock is NSEStockData {
  return stock.exchange === "NSE";
}

export function isBSEStock(stock: IndianStockData): stock is BSEStockData {
  return stock.exchange === "BSE";
}

// Currency formatting utilities for Indian market
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat("en-IN").format(num);
}

// Market cap formatting for Indian context
export function formatMarketCap(value: number): string {
  if (value >= 1e12) {
    return `₹${(value / 1e12).toFixed(2)} Lakh Cr`;
  } else if (value >= 1e10) {
    return `₹${(value / 1e10).toFixed(2)} K Cr`;
  } else if (value >= 1e7) {
    return `₹${(value / 1e7).toFixed(2)} Cr`;
  } else if (value >= 1e5) {
    return `₹${(value / 1e5).toFixed(2)} Lakh`;
  } else {
    return `₹${formatIndianNumber(value)}`;
  }
}

// Volume formatting for Indian markets
export function formatVolume(volume: number): string {
  if (volume >= 1e7) {
    return `${(volume / 1e7).toFixed(2)} Cr`;
  } else if (volume >= 1e5) {
    return `${(volume / 1e5).toFixed(2)} L`;
  } else if (volume >= 1e3) {
    return `${(volume / 1e3).toFixed(2)} K`;
  } else {
    return volume.toString();
  }
}
