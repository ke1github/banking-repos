import { useState, useEffect } from "react";
import { indianStockService } from "@/lib/api/indianStockService";
import {
  IndianStockData,
  IndianStockSearch,
  IndianMarketOverview,
  IndianMarketIndex,
} from "@/lib/types/indianStocks";

export function useIndianStockData(symbol: string, exchange?: "NSE" | "BSE") {
  const [data, setData] = useState<IndianStockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const stockData = await indianStockService.getIndianStock(
          symbol,
          exchange
        );
        setData(stockData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch stock data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [symbol, exchange]);

  return { data, loading, error, refetch: () => {} };
}

export function useIndianStockSearch(query: string) {
  const [results, setResults] = useState<IndianStockSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    const searchStocks = async () => {
      setLoading(true);
      setError(null);

      try {
        const searchResults = await indianStockService.searchIndianStocks(
          query
        );
        setResults(searchResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Search failed");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(searchStocks, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, loading, error };
}

export function useIndianMarketOverview() {
  const [data, setData] = useState<IndianMarketOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const overview = await indianStockService.getIndianMarketOverview();
        setData(overview);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch market overview"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: () => {} };
}

export function useNSEIndices() {
  const [indices, setIndices] = useState<IndianMarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndices = async () => {
      setLoading(true);
      setError(null);

      try {
        const nseIndices = await indianStockService.getNSEIndices();
        setIndices(nseIndices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch NSE indices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();

    // Auto-refresh every minute
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  return { indices, loading, error };
}

export function useBSEIndices() {
  const [indices, setIndices] = useState<IndianMarketIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIndices = async () => {
      setLoading(true);
      setError(null);

      try {
        const bseIndices = await indianStockService.getBSEIndices();
        setIndices(bseIndices);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch BSE indices"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIndices();

    // Auto-refresh every minute
    const interval = setInterval(fetchIndices, 60000);
    return () => clearInterval(interval);
  }, []);

  return { indices, loading, error };
}

export function useIndianMarketStatus() {
  const [status, setStatus] = useState<
    "OPEN" | "CLOSED" | "PRE_OPEN" | "AFTER_HOURS"
  >("CLOSED");

  useEffect(() => {
    const getMarketStatus = () => {
      const now = new Date();
      const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Convert to IST
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const currentTime = hours * 100 + minutes;

      // Market hours: 9:15 AM to 3:30 PM IST
      if (currentTime >= 915 && currentTime <= 1530) {
        setStatus("OPEN");
      } else if (currentTime >= 900 && currentTime < 915) {
        setStatus("PRE_OPEN");
      } else if (currentTime > 1530 && currentTime <= 1800) {
        setStatus("AFTER_HOURS");
      } else {
        setStatus("CLOSED");
      }
    };

    getMarketStatus();

    // Update every minute
    const interval = setInterval(getMarketStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
