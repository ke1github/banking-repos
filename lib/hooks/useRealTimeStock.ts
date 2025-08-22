import { useState, useEffect, useCallback, useRef } from "react";
import { StockQuote, MarketIndex } from "../api/types";
import {
  realTimeDataManager,
  DataStreamStatus,
  RealTimeData,
} from "../realtime/dataManager";

export interface UseRealTimeStockOptions {
  symbol?: string;
  symbols?: string[];
  enabled?: boolean;
  updateInterval?: number;
  maxRetries?: number;
}

export interface UseRealTimeStockReturn {
  data: StockQuote | StockQuote[] | null;
  loading: boolean;
  error: string | null;
  status: DataStreamStatus;
  refetch: () => Promise<void>;
  subscribe: () => void;
  unsubscribe: () => void;
  isSubscribed: boolean;
}

export function useRealTimeStock(
  options: UseRealTimeStockOptions
): UseRealTimeStockReturn {
  const {
    symbol,
    symbols,
    enabled = true,
    updateInterval = 5000,
    maxRetries = 3,
  } = options;

  const [data, setData] = useState<StockQuote | StockQuote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<DataStreamStatus>(
    realTimeDataManager.getStatus()
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const subscriptionId = useRef<string>(
    `stock_${symbol || symbols?.join(",") || "unknown"}_${Date.now()}`
  );

  // Configure real-time manager
  useEffect(() => {
    realTimeDataManager.configure({
      updateInterval,
      maxRetries,
      retryDelay: 1000,
      enableAutoRefresh: enabled,
    });
  }, [updateInterval, maxRetries, enabled]);

  const handleData = useCallback((newData: RealTimeData) => {
    setData(newData as StockQuote | StockQuote[]);
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const handleStatusChange = useCallback((newStatus: DataStreamStatus) => {
    setStatus(newStatus);
  }, []);

  const subscribe = useCallback(() => {
    if ((!symbol && !symbols) || isSubscribed) return;

    setLoading(true);
    setError(null);

    const unsubscribe = realTimeDataManager.subscribe(subscriptionId.current, {
      symbol,
      symbols,
      type: "quote",
      onData: handleData,
      onError: handleError,
      onStatusChange: handleStatusChange,
    });

    unsubscribeRef.current = unsubscribe;
    setIsSubscribed(true);
  }, [
    symbol,
    symbols,
    isSubscribed,
    handleData,
    handleError,
    handleStatusChange,
  ]);

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsSubscribed(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!isSubscribed) return;

    setLoading(true);
    try {
      await realTimeDataManager.refresh(subscriptionId.current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    }
  }, [isSubscribed]);

  // Auto-subscribe when enabled
  useEffect(() => {
    if (enabled && (symbol || symbols)) {
      subscribe();
    } else {
      unsubscribe();
    }

    return () => {
      unsubscribe();
    };
  }, [enabled, symbol, symbols, subscribe, unsubscribe]);

  return {
    data,
    loading,
    error,
    status,
    refetch,
    subscribe,
    unsubscribe,
    isSubscribed,
  };
}

export interface UseRealTimeIndicesReturn {
  indices: MarketIndex[];
  loading: boolean;
  error: string | null;
  status: DataStreamStatus;
  refetch: () => Promise<void>;
  isSubscribed: boolean;
}

export function useRealTimeIndices(
  options: { enabled?: boolean; updateInterval?: number } = {}
): UseRealTimeIndicesReturn {
  const { enabled = true, updateInterval = 10000 } = options;

  const [indices, setIndices] = useState<MarketIndex[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<DataStreamStatus>(
    realTimeDataManager.getStatus()
  );
  const [isSubscribed, setIsSubscribed] = useState(false);

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const subscriptionId = useRef<string>(`indices_${Date.now()}`);

  const handleData = useCallback((newData: RealTimeData) => {
    setIndices(newData as MarketIndex[]);
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setLoading(false);
  }, []);

  const handleStatusChange = useCallback((newStatus: DataStreamStatus) => {
    setStatus(newStatus);
  }, []);

  const refetch = useCallback(async () => {
    if (!isSubscribed) return;

    setLoading(true);
    try {
      await realTimeDataManager.refresh(subscriptionId.current);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh indices"
      );
    }
  }, [isSubscribed]);

  useEffect(() => {
    if (!enabled) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        setIsSubscribed(false);
      }
      return;
    }

    realTimeDataManager.configure({
      updateInterval,
      maxRetries: 3,
      retryDelay: 1000,
      enableAutoRefresh: enabled,
    });

    setLoading(true);
    setError(null);

    const unsubscribe = realTimeDataManager.subscribe(subscriptionId.current, {
      type: "indices",
      onData: handleData,
      onError: handleError,
      onStatusChange: handleStatusChange,
    });

    unsubscribeRef.current = unsubscribe;
    setIsSubscribed(true);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        setIsSubscribed(false);
      }
    };
  }, [enabled, updateInterval, handleData, handleError, handleStatusChange]);

  return {
    indices,
    loading,
    error,
    status,
    refetch,
    isSubscribed,
  };
}
