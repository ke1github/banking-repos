import { useState, useEffect, useCallback } from "react";
import { stockDataService } from "../api/stockDataService";
import { StockQuote, MarketIndex, StockSearchResult } from "../api/types";

// Hook for real-time stock quotes
export const useStockQuote = (
  symbol: string,
  exchange: string = "NSE",
  autoRefresh: boolean = true
) => {
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    try {
      const data = await stockDataService.getStockQuote(symbol, exchange);
      setQuote(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  }, [symbol, exchange]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  useEffect(() => {
    if (!autoRefresh || !symbol) return;

    const interval = setInterval(fetchQuote, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchQuote, autoRefresh, symbol]);

  return { quote, loading, error, refetch: fetchQuote };
};

// Hook for multiple stock quotes
export const useMultipleQuotes = (
  symbols: string[],
  exchange: string = "NSE",
  autoRefresh: boolean = true
) => {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    if (!symbols.length) return;

    setLoading(true);
    setError(null);

    try {
      const data = await stockDataService.getMultipleQuotes(symbols, exchange);
      setQuotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch quotes");
    } finally {
      setLoading(false);
    }
  }, [symbols, exchange]);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  useEffect(() => {
    if (!autoRefresh || !symbols.length) return;

    const interval = setInterval(fetchQuotes, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, [fetchQuotes, autoRefresh, symbols]);

  return { quotes, loading, error, refetch: fetchQuotes };
};

// Hook for market indices
export const useMarketIndices = (autoRefresh: boolean = true) => {
  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIndices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await stockDataService.getMarketIndices();
      setIndices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch indices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndices();
  }, [fetchIndices]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchIndices, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchIndices, autoRefresh]);

  return { indices, loading, error, refetch: fetchIndices };
};

// Hook for stock search
export const useStockSearch = () => {
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStocks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await stockDataService.searchStocks(query);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, searchStocks, clearResults };
};

// Hook for watchlist with real-time updates
export const useWatchlist = (symbols: string[], exchange: string = "NSE") => {
  const { quotes, loading, error, refetch } = useMultipleQuotes(
    symbols,
    exchange,
    true
  );

  const [watchlistData, setWatchlistData] = useState<
    (StockQuote & {
      addedDate: string;
      targetPrice?: number;
      alertPrice?: number;
    })[]
  >([]);

  useEffect(() => {
    if (quotes.length === 0) return;

    setWatchlistData((prevData) => {
      return quotes.map((quote) => {
        const existing = prevData.find((item) => item.symbol === quote.symbol);
        return {
          ...quote,
          addedDate: existing?.addedDate || new Date().toISOString(),
          targetPrice: existing?.targetPrice,
          alertPrice: existing?.alertPrice,
        };
      });
    });
  }, [quotes]);

  const addToWatchlist = useCallback(
    (symbol: string, targetPrice?: number, alertPrice?: number) => {
      // This would typically save to localStorage or API
      console.log(`Added ${symbol} to watchlist`, { targetPrice, alertPrice });
    },
    []
  );

  const removeFromWatchlist = useCallback((symbol: string) => {
    // This would typically remove from localStorage or API
    setWatchlistData((prev) => prev.filter((item) => item.symbol !== symbol));
  }, []);

  const updateTarget = useCallback((symbol: string, targetPrice: number) => {
    setWatchlistData((prev) =>
      prev.map((item) =>
        item.symbol === symbol ? { ...item, targetPrice } : item
      )
    );
  }, []);

  const updateAlert = useCallback((symbol: string, alertPrice: number) => {
    setWatchlistData((prev) =>
      prev.map((item) =>
        item.symbol === symbol ? { ...item, alertPrice } : item
      )
    );
  }, []);

  return {
    watchlistData,
    loading,
    error,
    refetch,
    addToWatchlist,
    removeFromWatchlist,
    updateTarget,
    updateAlert,
  };
};

// Hook for real-time market overview
export const useMarketOverview = () => {
  const {
    indices,
    loading: indicesLoading,
    error: indicesError,
  } = useMarketIndices(true);

  const [marketSummary, setMarketSummary] = useState({
    totalStocks: 0,
    advancing: 0,
    declining: 0,
    unchanged: 0,
    totalVolume: 0,
    totalTurnover: 0,
  });

  const [topMovers, setTopMovers] = useState<{
    gainers: StockQuote[];
    losers: StockQuote[];
  }>({
    gainers: [],
    losers: [],
  });

  // Fetch top movers
  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        // In a real implementation, this would be a separate API call
        const popularSymbols = [
          "RELIANCE",
          "TCS",
          "HDFCBANK",
          "INFY",
          "ICICIBANK",
          "HINDUNILVR",
          "ITC",
          "BHARTIARTL",
        ];
        const quotes = await stockDataService.getMultipleQuotes(popularSymbols);

        const sortedByChange = [...quotes].sort(
          (a, b) => b.changePercent - a.changePercent
        );
        setTopMovers({
          gainers: sortedByChange.slice(0, 4),
          losers: sortedByChange.slice(-4).reverse(),
        });

        // Calculate market summary
        const advancing = quotes.filter((q) => q.changePercent > 0).length;
        const declining = quotes.filter((q) => q.changePercent < 0).length;
        const unchanged = quotes.filter((q) => q.changePercent === 0).length;
        const totalVolume = quotes.reduce((sum, q) => sum + q.volume, 0);

        setMarketSummary({
          totalStocks: quotes.length * 500, // Estimate
          advancing: advancing * 500,
          declining: declining * 500,
          unchanged: unchanged * 500,
          totalVolume,
          totalTurnover: totalVolume * 1000, // Estimate
        });
      } catch (error) {
        console.error("Failed to fetch top movers:", error);
      }
    };

    fetchTopMovers();
    const interval = setInterval(fetchTopMovers, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return {
    indices,
    marketSummary,
    topMovers,
    loading: indicesLoading,
    error: indicesError,
  };
};

// Hook for price alerts
export const usePriceAlerts = () => {
  const [alerts, setAlerts] = useState<
    {
      symbol: string;
      price: number;
      condition: "above" | "below";
      triggered: boolean;
    }[]
  >([]);

  const addAlert = useCallback(
    (symbol: string, price: number, condition: "above" | "below") => {
      setAlerts((prev) => [
        ...prev,
        { symbol, price, condition, triggered: false },
      ]);
    },
    []
  );

  const removeAlert = useCallback((index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const checkAlerts = useCallback((quotes: StockQuote[]) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        const quote = quotes.find((q) => q.symbol === alert.symbol);
        if (!quote || alert.triggered) return alert;

        const shouldTrigger =
          alert.condition === "above"
            ? quote.price >= alert.price
            : quote.price <= alert.price;

        if (shouldTrigger) {
          // In a real app, you'd send a notification here
          console.log(
            `Alert triggered: ${alert.symbol} is ${alert.condition} ${alert.price}`
          );
          return { ...alert, triggered: true };
        }

        return alert;
      })
    );
  }, []);

  return { alerts, addAlert, removeAlert, checkAlerts };
};
