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
    process.env.NODE_ENV === "production"
      ? "https://your-domain.com"
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
      const response = await fetch(
        `${this.baseURL}/api/stocks/nse?symbol=${symbol}`
      );
      if (!response.ok) throw new Error("NSE fetch failed");

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("NSE stock error:", error);
      return null;
    }
  }

  async getBSEStock(symbolOrCode: string): Promise<BSEStockData | null> {
    const cacheKey = `bse_${symbolOrCode}`;
    const cached = this.getCachedData<BSEStockData>(cacheKey);
    if (cached) return cached;

    try {
      const isCode = /^\d+$/.test(symbolOrCode);
      const queryParam = isCode
        ? `code=${symbolOrCode}`
        : `symbol=${symbolOrCode}`;

      const response = await fetch(
        `${this.baseURL}/api/stocks/bse?${queryParam}`
      );
      if (!response.ok) throw new Error("BSE fetch failed");

      const data = await response.json();
      this.setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      console.error("BSE stock error:", error);
      return null;
    }
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
