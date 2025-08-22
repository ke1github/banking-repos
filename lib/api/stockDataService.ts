import {
  StockQuote,
  MarketIndex,
  StockSearchResult,
  API_CONFIG,
  APIError,
  checkRateLimit,
  getCachedData,
  setCachedData,
  formatSymbol,
  parseNumber,
  calculateChange,
} from "./types";

// Stock Data Service
export class StockDataService {
  // Search for stocks
  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const cacheKey = `search_${query.toLowerCase()}`;
    const cached = getCachedData<StockSearchResult[]>(cacheKey);
    if (cached) return cached;

    try {
      // Use our Next.js API route instead of direct external calls
      const response = await fetch(
        `/api/stocks/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Search API failed: ${response.statusText}`);
      }

      const data = await response.json();
      const results = data.results || [];

      setCachedData(cacheKey, results, 30); // Cache for 30 minutes
      return results;
    } catch (error) {
      console.error("Stock search failed:", error);
      return this.getFallbackSearchResults(query);
    }
  }

  // Get real-time quote
  async getStockQuote(
    symbol: string,
    exchange: string = "NSE"
  ): Promise<StockQuote> {
    const formattedSymbol = formatSymbol(symbol, exchange);
    const cacheKey = `quote_${formattedSymbol}`;
    const cached = getCachedData<StockQuote>(cacheKey);
    if (cached) return cached;

    try {
      // Use our Next.js API route instead of direct external calls
      const response = await fetch(
        `/api/stocks/quote?symbol=${encodeURIComponent(
          formattedSymbol
        )}&type=quote`
      );

      if (!response.ok) {
        throw new Error(`Quote API failed: ${response.statusText}`);
      }

      const data = await response.json();
      const quote = data.quote;

      if (quote) {
        setCachedData(cacheKey, quote, 2); // Cache for 2 minutes
        return quote;
      }
    } catch (error) {
      console.error("Stock quote failed:", error);
    }

    // Fallback to mock data
    return this.getFallbackQuote(symbol, exchange);
  }

  // Get multiple quotes
  async getMultipleQuotes(
    symbols: string[],
    exchange: string = "NSE"
  ): Promise<StockQuote[]> {
    const promises = symbols.map((symbol) =>
      this.getStockQuote(symbol, exchange).catch((error) => {
        console.warn(`Failed to get quote for ${symbol}:`, error);
        return this.getFallbackQuote(symbol, exchange);
      })
    );

    return Promise.all(promises);
  }

  // Get market indices
  async getMarketIndices(): Promise<MarketIndex[]> {
    const cacheKey = "market_indices";
    const cached = getCachedData<MarketIndex[]>(cacheKey);
    if (cached) return cached;

    try {
      // Use our Next.js API route instead of direct external calls
      const response = await fetch(`/api/stocks/quote?type=indices`);

      if (!response.ok) {
        throw new Error(`Indices API failed: ${response.statusText}`);
      }

      const data = await response.json();
      const indices = data.indices || [];

      setCachedData(cacheKey, indices, 5); // Cache for 5 minutes
      return indices;
    } catch (error) {
      console.error("Market indices fetch failed:", error);
      return this.getFallbackIndices();
    }
  }

  // Yahoo Finance API calls
  private async searchYahooFinance(
    query: string
  ): Promise<StockSearchResult[]> {
    if (!checkRateLimit("yahoo_search", 10)) {
      throw new APIError("Rate limit exceeded for Yahoo Finance search");
    }

    const url = `${API_CONFIG.YAHOO_FINANCE.SEARCH_URL}?q=${encodeURIComponent(
      query
    )}&quotesCount=10&newsCount=0`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new APIError(
        `Yahoo Finance search failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    return (data.quotes || []).map(
      (item: {
        symbol: string;
        shortname?: string;
        longname?: string;
        exchange?: string;
        sector?: string;
        currency?: string;
        quoteType?: string;
      }) => ({
        symbol: item.symbol,
        name: item.shortname || item.longname || item.symbol,
        exchange: item.exchange || "NSE",
        sector: item.sector || "",
        currency: item.currency || "INR",
        type: item.quoteType || "EQUITY",
      })
    );
  }

  private async getYahooFinanceQuote(symbol: string): Promise<StockQuote> {
    if (!checkRateLimit("yahoo_quote", 10)) {
      throw new APIError("Rate limit exceeded for Yahoo Finance quote");
    }

    const url = `${API_CONFIG.YAHOO_FINANCE.BASE_URL}/${symbol}?range=1d&interval=1m`;

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new APIError(
        `Yahoo Finance quote failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const result = data.chart?.result?.[0];

    if (!result) {
      throw new APIError("Invalid response from Yahoo Finance");
    }

    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    const currentPrice =
      meta.regularMarketPrice || quote?.close?.[quote.close.length - 1] || 0;
    const previousClose = meta.previousClose || 0;
    const { change, changePercent } = calculateChange(
      currentPrice,
      previousClose
    );

    return {
      symbol: meta.symbol.replace(".NS", ""),
      name: meta.shortName || meta.longName || meta.symbol,
      price: currentPrice,
      change,
      changePercent,
      volume: meta.regularMarketVolume || 0,
      marketCap: meta.marketCap || 0,
      sector: meta.sector || "",
      exchange: meta.exchangeName || "NSE",
      high: meta.regularMarketDayHigh || currentPrice,
      low: meta.regularMarketDayLow || currentPrice,
      open: meta.regularMarketOpen || currentPrice,
      previousClose,
      dayRange: [
        meta.regularMarketDayLow || currentPrice,
        meta.regularMarketDayHigh || currentPrice,
      ],
      week52Range: [
        meta.fiftyTwoWeekLow || currentPrice,
        meta.fiftyTwoWeekHigh || currentPrice,
      ],
      pe: meta.trailingPE,
      pb: meta.priceToBook,
      dividendYield: meta.dividendYield ? meta.dividendYield * 100 : undefined,
      lastUpdated: new Date().toISOString(),
    };
  }

  private async getYahooFinanceIndices(): Promise<MarketIndex[]> {
    const indexSymbols = [
      { symbol: "^NSEI", name: "Nifty 50" },
      { symbol: "^BSESN", name: "Sensex" },
      { symbol: "^NSEBANK", name: "Nifty Bank" },
      { symbol: "^CNXIT", name: "Nifty IT" },
    ];

    const promises = indexSymbols.map(async ({ symbol, name }) => {
      try {
        const quote = await this.getYahooFinanceQuote(symbol);
        return {
          name,
          symbol: symbol.replace("^", ""),
          value: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          lastUpdated: quote.lastUpdated,
        };
      } catch (error) {
        console.warn(`Failed to get index ${name}:`, error);
        return {
          name,
          symbol: symbol.replace("^", ""),
          value: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
    });

    return Promise.all(promises);
  }

  // Alpha Vantage API calls
  private async getAlphaVantageQuote(symbol: string): Promise<StockQuote> {
    if (!checkRateLimit("alpha_vantage", 5)) {
      throw new APIError("Rate limit exceeded for Alpha Vantage");
    }

    const url = `${API_CONFIG.ALPHA_VANTAGE.BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_CONFIG.ALPHA_VANTAGE.API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new APIError(
        `Alpha Vantage failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    const quote = data["Global Quote"];

    if (!quote) {
      throw new APIError("Invalid response from Alpha Vantage");
    }

    const currentPrice = parseNumber(quote["05. price"]);
    const change = parseNumber(quote["09. change"]);
    const changePercent = parseNumber(
      quote["10. change percent"].replace("%", "")
    );

    return {
      symbol: quote["01. symbol"],
      name: quote["01. symbol"], // Alpha Vantage doesn't provide company name
      price: currentPrice,
      change,
      changePercent,
      volume: parseNumber(quote["06. volume"]),
      marketCap: 0, // Not provided by Alpha Vantage
      sector: "",
      exchange: "NSE",
      high: parseNumber(quote["03. high"]),
      low: parseNumber(quote["04. low"]),
      open: parseNumber(quote["02. open"]),
      previousClose: parseNumber(quote["08. previous close"]),
      dayRange: [parseNumber(quote["04. low"]), parseNumber(quote["03. high"])],
      week52Range: [currentPrice * 0.8, currentPrice * 1.2], // Approximate
      lastUpdated: new Date().toISOString(),
    };
  }

  // Finnhub API calls
  private async getFinnhubQuote(symbol: string): Promise<StockQuote> {
    if (!API_CONFIG.FINNHUB.API_KEY || !checkRateLimit("finnhub", 60)) {
      throw new APIError("Finnhub API not available or rate limited");
    }

    const url = `${API_CONFIG.FINNHUB.BASE_URL}/quote?symbol=${symbol}&token=${API_CONFIG.FINNHUB.API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new APIError(
        `Finnhub failed: ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();

    if (data.error) {
      throw new APIError(`Finnhub error: ${data.error}`);
    }

    const currentPrice = data.c || 0;
    const previousClose = data.pc || 0;
    const { change, changePercent } = calculateChange(
      currentPrice,
      previousClose
    );

    return {
      symbol: symbol.replace(".NS", ""),
      name: symbol,
      price: currentPrice,
      change,
      changePercent,
      volume: 0,
      marketCap: 0,
      sector: "",
      exchange: "NSE",
      high: data.h || currentPrice,
      low: data.l || currentPrice,
      open: data.o || currentPrice,
      previousClose,
      dayRange: [data.l || currentPrice, data.h || currentPrice],
      week52Range: [currentPrice * 0.8, currentPrice * 1.2],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Fallback methods
  private getFallbackSearchResults(query: string): StockSearchResult[] {
    const indianStocks = [
      { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Energy" },
      { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT" },
      { symbol: "HDFCBANK", name: "HDFC Bank Limited", sector: "Banking" },
      { symbol: "INFY", name: "Infosys Limited", sector: "IT" },
      { symbol: "ICICIBANK", name: "ICICI Bank Limited", sector: "Banking" },
      { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "FMCG" },
      { symbol: "ITC", name: "ITC Limited", sector: "FMCG" },
      {
        symbol: "BHARTIARTL",
        name: "Bharti Airtel Limited",
        sector: "Telecom",
      },
    ];

    return indianStocks
      .filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
          stock.name.toLowerCase().includes(query.toLowerCase()) ||
          stock.sector.toLowerCase().includes(query.toLowerCase())
      )
      .map((stock) => ({
        symbol: stock.symbol,
        name: stock.name,
        exchange: "NSE",
        sector: stock.sector,
        currency: "INR",
        type: "EQUITY",
      }));
  }

  private getFallbackQuote(symbol: string, exchange: string): StockQuote {
    // Generate realistic mock data based on symbol
    const basePrice = 1000 + symbol.charCodeAt(0) * 10;
    const randomFactor = (Math.random() - 0.5) * 0.1;
    const currentPrice = basePrice * (1 + randomFactor);
    const previousClose = basePrice;
    const { change, changePercent } = calculateChange(
      currentPrice,
      previousClose
    );

    return {
      symbol,
      name: `${symbol} Limited`,
      price: currentPrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: currentPrice * 1000000000,
      sector: "Technology",
      exchange,
      high: currentPrice * 1.02,
      low: currentPrice * 0.98,
      open: currentPrice * 0.99,
      previousClose,
      dayRange: [currentPrice * 0.98, currentPrice * 1.02],
      week52Range: [currentPrice * 0.7, currentPrice * 1.3],
      pe: 15 + Math.random() * 20,
      pb: 1 + Math.random() * 5,
      dividendYield: Math.random() * 5,
      lastUpdated: new Date().toISOString(),
    };
  }

  private getFallbackIndices(): MarketIndex[] {
    return [
      {
        name: "Nifty 50",
        symbol: "NIFTY",
        value: 19845.3,
        change: 245.85,
        changePercent: 1.25,
        lastUpdated: new Date().toISOString(),
      },
      {
        name: "Sensex",
        symbol: "SENSEX",
        value: 66589.93,
        change: 487.22,
        changePercent: 0.74,
        lastUpdated: new Date().toISOString(),
      },
      {
        name: "Nifty Bank",
        symbol: "NIFTYBANK",
        value: 44532.15,
        change: 623.45,
        changePercent: 1.42,
        lastUpdated: new Date().toISOString(),
      },
      {
        name: "Nifty IT",
        symbol: "NIFTYIT",
        value: 32156.78,
        change: 812.34,
        changePercent: 2.59,
        lastUpdated: new Date().toISOString(),
      },
    ];
  }
}

// Export singleton instance
export const stockDataService = new StockDataService();
