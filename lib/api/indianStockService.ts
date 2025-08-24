import {
  IndianStockData,
  NSEStockData,
  BSEStockData,
  IndianStockSearch,
  IndianMarketOverview,
  IndianMarketIndex,
} from "@/lib/types/indianStocks";

class IndianStockService {
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

  async searchIndianStocks(query: string): Promise<IndianStockSearch[]> {
    const cacheKey = `search_${query}`;
    const cached = this.getCachedData<IndianStockSearch[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseURL}/api/stocks/indian-search?q=${encodeURIComponent(
          query
        )}`
      );
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      const results = data.results || [];

      this.setCachedData(cacheKey, results, 60000); // Cache for 1 minute
      return results;
    } catch (error) {
      console.error("Indian stock search error:", error);
      return this.getMockSearchResults(query);
    }
  }

  async getNSEStock(symbol: string): Promise<NSEStockData | null> {
    const cacheKey = `nse_${symbol}`;
    const cached = this.getCachedData<NSEStockData>(cacheKey);
    if (cached) return cached;

    try {
      console.log(`Fetching NSE data for ${symbol} from API endpoint`);

      // Use relative URL path to avoid issues with different environments
      const apiUrl = `/api/stocks/nse?symbol=${symbol}`;
      console.log(`API URL: ${apiUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(
            `NSE API error: ${response.status} ${response.statusText}`
          );
          throw new Error(`NSE API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully fetched data for ${symbol}`);
        this.setCachedData(cacheKey, data);
        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error("NSE stock error:", error);
      return this.getMockNSEStock(symbol);
    }
  }

  private getMockNSEStock(symbol: string): NSEStockData {
    try {
      const lastUpdateDate = new Date();
      const basePrice = Math.floor(Math.random() * 2000) + 100;
      const change = Math.random() * 40 - 20; // -20 to +20
      const changePercent = (change / basePrice) * 100;

      const companyNames: { [key: string]: string } = {
        RELIANCE: "Reliance Industries Ltd",
        TCS: "Tata Consultancy Services",
        INFY: "Infosys Limited",
        HDFCBANK: "HDFC Bank Limited",
        ICICIBANK: "ICICI Bank Limited",
        SBIN: "State Bank of India",
        LT: "Larsen & Toubro Limited",
        ITC: "ITC Limited",
        KOTAKBANK: "Kotak Mahindra Bank",
        BAJFINANCE: "Bajaj Finance Limited",
        BHARTIARTL: "Bharti Airtel Limited",
        ASIANPAINT: "Asian Paints Limited",
        MARUTI: "Maruti Suzuki India",
        HCLTECH: "HCL Technologies",
        HINDUNILVR: "Hindustan Unilever",
        WIPRO: "Wipro Limited",
        ADANIPORTS: "Adani Ports & SEZ",
        ULTRACEMCO: "UltraTech Cement",
        TATAMOTORS: "Tata Motors Limited",
        POWERGRID: "Power Grid Corporation",
      };

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

      const companyName = companyNames[symbol] || `${symbol} Limited`;
      const sector = sectors[symbol] || "Diversified";

      console.log(`Creating mock NSE data for ${symbol} (${companyName})`);

      return {
        exchange: "NSE",
        info: {
          symbol: symbol,
          companyName: companyName,
          industry: sector,
          activeSeries: ["EQ"],
          debtSeries: [],
          isFNOSec: true,
          isCASec: false,
          isSLBSec: false,
          isDebtSec: false,
          isSuspended: false,
          isETFSec: false,
          isDelisted: false,
          isin: `INE${Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase()}`,
        },
        metadata: {
          series: "EQ",
          symbol: symbol,
          isin: `INE${Math.random()
            .toString(36)
            .substring(2, 10)
            .toUpperCase()}`,
          status: "Listed",
          listingDate: "01-Jan-1990",
          industry: sector,
          lastUpdateTime: lastUpdateDate.toISOString(),
          pdSectorPe: 20 + Math.random() * 10,
          pdSymbolPe: 15 + Math.random() * 15,
          pdSectorInd: sector,
        },
        priceInfo: {
          lastPrice: basePrice,
          change: change,
          pChange: changePercent,
          previousClose: basePrice - change,
          open: basePrice * 0.98,
          close: basePrice - change,
          vwap: basePrice * 1.01,
          lowerCP: (basePrice * 0.8).toFixed(2),
          upperCP: (basePrice * 1.2).toFixed(2),
          pPriceBand: "No Band",
          basePrice: basePrice,
          intraDayHighLow: {
            min: basePrice * 0.9,
            max: basePrice * 1.1,
            value: basePrice,
          },
          weekHighLow: {
            min: basePrice * 0.7,
            minDate: "31-Dec-2024",
            max: basePrice * 1.3,
            maxDate: "15-Jan-2025",
            value: basePrice,
          },
        },
        lastUpdate: lastUpdateDate.toISOString(),
        source: "mock",
      };
    } catch (error) {
      console.error("Error creating mock NSE stock:", error);
      // Provide a minimal valid structure as fallback
      return {
        exchange: "NSE",
        info: {
          symbol: symbol,
          companyName: `${symbol} Ltd`,
          industry: "Miscellaneous",
        },
        metadata: {
          series: "EQ",
          symbol: symbol,
          isin: `INE000000000`,
          status: "Listed",
          listingDate: "01-Jan-1990",
          industry: "Miscellaneous",
          lastUpdateTime: new Date().toISOString(),
          pdSectorPe: 15,
          pdSymbolPe: 15,
          pdSectorInd: "Miscellaneous",
        },
        priceInfo: {
          lastPrice: 1000,
          change: 0,
          pChange: 0,
          previousClose: 1000,
          open: 1000,
          close: 1000,
          vwap: 1000,
          lowerCP: "800.00",
          upperCP: "1200.00",
          pPriceBand: "No Band",
          basePrice: 1000,
          intraDayHighLow: {
            min: 950,
            max: 1050,
            value: 1000,
          },
          weekHighLow: {
            min: 900,
            minDate: "31-Dec-2024",
            max: 1100,
            maxDate: "15-Jan-2025",
            value: 1000,
          },
        },
        lastUpdate: new Date().toISOString(),
        source: "mock-fallback",
      };
    }
  }

  async getBSEStock(symbolOrCode: string): Promise<BSEStockData | null> {
    const cacheKey = `bse_${symbolOrCode}`;
    const cached = this.getCachedData<BSEStockData>(cacheKey);
    if (cached) return cached;

    try {
      console.log(`Fetching BSE data for ${symbolOrCode} from API endpoint`);
      const isCode = /^\d+$/.test(symbolOrCode);
      const queryParam = isCode
        ? `code=${symbolOrCode}`
        : `symbol=${symbolOrCode}`;

      // Use relative URL path to avoid issues with different environments
      const apiUrl = `/api/stocks/bse?${queryParam}`;
      console.log(`API URL: ${apiUrl}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.error(
            `BSE API error: ${response.status} ${response.statusText}`
          );
          throw new Error(`BSE API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Successfully fetched BSE data for ${symbolOrCode}`);
        this.setCachedData(cacheKey, data);
        return data;
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
    } catch (error) {
      console.error("BSE stock error:", error);
      return this.getMockBSEStock(symbolOrCode);
    }
  }

  private getMockBSEStock(symbolOrCode: string): BSEStockData {
    const lastUpdateDate = new Date();
    const basePrice = Math.floor(Math.random() * 2000) + 100;
    const change = Math.random() * 40 - 20; // -20 to +20
    const percentChange = (change / basePrice) * 100;
    const volume = Math.floor(Math.random() * 10000000) + 100000;

    const companyNames: { [key: string]: string } = {
      RELIANCE: "Reliance Industries Ltd",
      TCS: "Tata Consultancy Services",
      INFY: "Infosys Limited",
      HDFCBANK: "HDFC Bank Limited",
      ICICIBANK: "ICICI Bank Limited",
      SBIN: "State Bank of India",
      LT: "Larsen & Toubro Limited",
      ITC: "ITC Limited",
      KOTAKBANK: "Kotak Mahindra Bank",
      BAJFINANCE: "Bajaj Finance Limited",
      BHARTIARTL: "Bharti Airtel Limited",
      ASIANPAINT: "Asian Paints Limited",
      MARUTI: "Maruti Suzuki India",
      HCLTECH: "HCL Technologies",
      HINDUNILVR: "Hindustan Unilever",
      WIPRO: "Wipro Limited",
      ADANIPORTS: "Adani Ports & SEZ",
      ULTRACEMCO: "UltraTech Cement",
      TATAMOTORS: "Tata Motors Limited",
      POWERGRID: "Power Grid Corporation",
    };

    console.log(`Creating mock BSE data for ${symbolOrCode}`);

    return {
      securityCode: /^\d+$/.test(symbolOrCode)
        ? symbolOrCode
        : String(500000 + Math.floor(Math.random() * 100000)),
      symbol: /^\d+$/.test(symbolOrCode)
        ? Object.keys(companyNames)[
            Math.floor(Math.random() * Object.keys(companyNames).length)
          ]
        : symbolOrCode,
      companyName: companyNames[symbolOrCode] || `${symbolOrCode} Limited`,
      currentPrice: basePrice,
      change: change,
      percentChange: percentChange,
      open: basePrice * 0.98,
      high: basePrice * 1.05,
      low: basePrice * 0.95,
      previousClose: basePrice - change,
      volume: volume,
      value: volume * basePrice,
      totalTradedQuantity: volume,
      exchange: "BSE",
      lastUpdate: lastUpdateDate.toISOString(),
      source: "mock",
    };
  }

  async getIndianStock(
    symbol: string,
    preferredExchange?: "NSE" | "BSE"
  ): Promise<IndianStockData | null> {
    if (preferredExchange === "BSE") {
      const bseData = await this.getBSEStock(symbol);
      if (bseData) return bseData;

      const nseData = await this.getNSEStock(symbol);
      return nseData;
    }

    // Default: Try NSE first, then BSE
    const nseData = await this.getNSEStock(symbol);
    if (nseData) return nseData;

    const bseData = await this.getBSEStock(symbol);
    return bseData;
  }

  async getNSEIndices(): Promise<IndianMarketIndex[]> {
    const cacheKey = "nse_indices";
    const cached = this.getCachedData<IndianMarketIndex[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseURL}/api/stocks/nse?type=indices`
      );
      if (!response.ok) throw new Error("NSE indices fetch failed");

      const result = await response.json();
      const indices = result.data || [];

      this.setCachedData(cacheKey, indices, 60000); // Cache for 1 minute
      return indices;
    } catch (error) {
      console.error("NSE indices error:", error);
      return this.getMockNSEIndices();
    }
  }

  async getBSEIndices(): Promise<IndianMarketIndex[]> {
    const cacheKey = "bse_indices";
    const cached = this.getCachedData<IndianMarketIndex[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${this.baseURL}/api/stocks/bse?type=indices`
      );
      if (!response.ok) throw new Error("BSE indices fetch failed");

      const result = await response.json();
      const indices = result.data || [];

      this.setCachedData(cacheKey, indices, 60000); // Cache for 1 minute
      return indices;
    } catch (error) {
      console.error("BSE indices error:", error);
      return this.getMockBSEIndices();
    }
  }

  async getIndianMarketOverview(): Promise<IndianMarketOverview> {
    const cacheKey = "indian_market_overview";
    const cached = this.getCachedData<IndianMarketOverview>(cacheKey);
    if (cached) return cached;

    try {
      const [nseIndices, bseIndices] = await Promise.all([
        this.getNSEIndices(),
        this.getBSEIndices(),
      ]);

      const overview: IndianMarketOverview = {
        indices: [...nseIndices, ...bseIndices],
        marketStatus: this.getMarketStatus(),
        lastUpdate: new Date().toISOString(),
        topGainers: await this.getTopGainers(),
        topLosers: await this.getTopLosers(),
        mostActive: await this.getMostActive(),
      };

      this.setCachedData(cacheKey, overview, 30000); // Cache for 30 seconds
      return overview;
    } catch (error) {
      console.error("Market overview error:", error);
      return this.getMockMarketOverview();
    }
  }

  private getMarketStatus(): "OPEN" | "CLOSED" | "PRE_OPEN" | "AFTER_HOURS" {
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const currentTime = hours * 100 + minutes;

    // Market hours: 9:15 AM to 3:30 PM IST
    if (currentTime >= 915 && currentTime <= 1530) {
      return "OPEN";
    } else if (currentTime >= 900 && currentTime < 915) {
      return "PRE_OPEN";
    } else if (currentTime > 1530 && currentTime <= 1800) {
      return "AFTER_HOURS";
    } else {
      return "CLOSED";
    }
  }

  private async getTopGainers(): Promise<IndianStockSearch[]> {
    // Mock implementation - in real app, this would fetch from NSE/BSE APIs
    return [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Limited",
        exchange: "NSE",
        type: "equity",
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services Limited",
        exchange: "NSE",
        type: "equity",
      },
      {
        symbol: "INFY",
        name: "Infosys Limited",
        exchange: "NSE",
        type: "equity",
      },
    ];
  }

  private async getTopLosers(): Promise<IndianStockSearch[]> {
    // Mock implementation
    return [
      {
        symbol: "ICICIBANK",
        name: "ICICI Bank Limited",
        exchange: "NSE",
        type: "equity",
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank Limited",
        exchange: "NSE",
        type: "equity",
      },
      {
        symbol: "SBIN",
        name: "State Bank of India",
        exchange: "NSE",
        type: "equity",
      },
    ];
  }

  private async getMostActive(): Promise<IndianStockSearch[]> {
    // Mock implementation
    return [
      {
        symbol: "BAJFINANCE",
        name: "Bajaj Finance Limited",
        exchange: "NSE",
        type: "equity",
      },
      {
        symbol: "LT",
        name: "Larsen & Toubro Limited",
        exchange: "NSE",
        type: "equity",
      },
      { symbol: "ITC", name: "ITC Limited", exchange: "NSE", type: "equity" },
    ];
  }

  private getMockSearchResults(query: string): IndianStockSearch[] {
    const popularStocks: IndianStockSearch[] = [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries Limited",
        exchange: "NSE",
        type: "equity",
        industry: "Oil & Gas",
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services Limited",
        exchange: "NSE",
        type: "equity",
        industry: "Information Technology",
      },
      {
        symbol: "INFY",
        name: "Infosys Limited",
        exchange: "NSE",
        type: "equity",
        industry: "Information Technology",
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank Limited",
        exchange: "NSE",
        type: "equity",
        industry: "Financial Services",
      },
      {
        symbol: "ICICIBANK",
        name: "ICICI Bank Limited",
        exchange: "NSE",
        type: "equity",
        industry: "Financial Services",
      },
    ];

    return popularStocks.filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockNSEIndices(): IndianMarketIndex[] {
    return [
      {
        index: "NIFTY 50",
        last: 19674.5,
        variation: 123.45,
        percentChange: 0.63,
        open: 19551.05,
        high: 19698.2,
        low: 19540.3,
        previousClose: 19551.05,
        exchange: "NSE",
      },
      {
        index: "NIFTY BANK",
        last: 44285.75,
        variation: -156.25,
        percentChange: -0.35,
        open: 44442.0,
        high: 44521.85,
        low: 44201.4,
        previousClose: 44442.0,
        exchange: "NSE",
      },
    ];
  }

  private getMockBSEIndices(): IndianMarketIndex[] {
    return [
      {
        index: "SENSEX",
        currentValue: 65953.48,
        change: 189.83,
        percentChange: 0.29,
        open: 65763.65,
        high: 66012.35,
        low: 65741.2,
        previousClose: 65763.65,
        exchange: "BSE",
      },
    ];
  }

  private getMockMarketOverview(): IndianMarketOverview {
    return {
      indices: [...this.getMockNSEIndices(), ...this.getMockBSEIndices()],
      marketStatus: this.getMarketStatus(),
      lastUpdate: new Date().toISOString(),
      topGainers: [],
      topLosers: [],
      mostActive: [],
    };
  }
}

export const indianStockService = new IndianStockService();
export default IndianStockService;
