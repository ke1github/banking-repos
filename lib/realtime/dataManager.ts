import { StockQuote, MarketIndex } from "../api/types";

export interface RealTimeConfig {
  updateInterval: number; // milliseconds
  maxRetries: number;
  retryDelay: number;
  enableAutoRefresh: boolean;
}

export interface DataStreamStatus {
  isConnected: boolean;
  lastUpdate: Date;
  errors: string[];
  retryCount: number;
  latency: number;
}

export type RealTimeData = StockQuote | StockQuote[] | MarketIndex[];

export interface SubscriptionOptions {
  symbol?: string;
  symbols?: string[];
  type: "quote" | "indices" | "search";
  onData?: (data: RealTimeData) => void;
  onError?: (error: string) => void;
  onStatusChange?: (status: DataStreamStatus) => void;
}

class RealTimeDataManager {
  private subscriptions = new Map<string, SubscriptionOptions>();
  private intervals = new Map<string, NodeJS.Timeout>();
  private config: RealTimeConfig = {
    updateInterval: 5000, // 5 seconds
    maxRetries: 3,
    retryDelay: 1000,
    enableAutoRefresh: true,
  };
  private status: DataStreamStatus = {
    isConnected: false,
    lastUpdate: new Date(0), // Use epoch to avoid hydration issues
    errors: [],
    retryCount: 0,
    latency: 0,
  };

  configure(config: Partial<RealTimeConfig>) {
    this.config = { ...this.config, ...config };
  }

  subscribe(id: string, options: SubscriptionOptions): () => void {
    this.subscriptions.set(id, options);

    if (this.config.enableAutoRefresh) {
      this.startPolling(id);
    }

    // Return unsubscribe function
    return () => this.unsubscribe(id);
  }

  unsubscribe(id: string) {
    this.subscriptions.delete(id);
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
    }
  }

  async refresh(id?: string): Promise<void> {
    if (id) {
      await this.fetchData(id);
    } else {
      // Refresh all subscriptions
      const promises = Array.from(this.subscriptions.keys()).map((subId) =>
        this.fetchData(subId)
      );
      await Promise.allSettled(promises);
    }
  }

  getStatus(): DataStreamStatus {
    return { ...this.status };
  }

  private startPolling(id: string) {
    const interval = setInterval(() => {
      this.fetchData(id);
    }, this.config.updateInterval);

    this.intervals.set(id, interval);

    // Initial fetch
    this.fetchData(id);
  }

  private async fetchData(id: string, retryCount = 0): Promise<void> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return;

    const startTime = Date.now();

    try {
      let data: RealTimeData | undefined;

      switch (subscription.type) {
        case "quote":
          if (subscription.symbol) {
            data = await this.fetchStockQuote(subscription.symbol);
          } else if (subscription.symbols) {
            data = await this.fetchMultipleQuotes(subscription.symbols);
          }
          break;
        case "indices":
          data = await this.fetchMarketIndices();
          break;
        case "search":
          // Search doesn't need real-time updates
          return;
      }

      if (!data) return;

      const latency = Date.now() - startTime;

      this.updateStatus({
        isConnected: true,
        lastUpdate: new Date(),
        latency,
        retryCount: 0,
      });

      subscription.onData?.(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      if (retryCount < this.config.maxRetries) {
        setTimeout(() => {
          this.fetchData(id, retryCount + 1);
        }, this.config.retryDelay * (retryCount + 1));

        this.updateStatus({
          retryCount: retryCount + 1,
        });
      } else {
        this.updateStatus({
          isConnected: false,
          errors: [...this.status.errors.slice(-4), errorMessage],
          retryCount: 0,
        });

        subscription.onError?.(errorMessage);
      }
    }
  }

  private async fetchStockQuote(symbol: string): Promise<StockQuote> {
    const response = await fetch(
      `/api/stocks/quote?symbol=${encodeURIComponent(symbol)}&type=quote`
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch quote for ${symbol}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.quote;
  }

  private async fetchMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map((symbol) => this.fetchStockQuote(symbol));
    const results = await Promise.allSettled(promises);

    return results
      .filter(
        (result): result is PromiseFulfilledResult<StockQuote> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);
  }

  private async fetchMarketIndices(): Promise<MarketIndex[]> {
    const response = await fetch("/api/stocks/quote?type=indices");

    if (!response.ok) {
      throw new Error(`Failed to fetch market indices: ${response.statusText}`);
    }

    const data = await response.json();
    return data.indices;
  }

  private updateStatus(updates: Partial<DataStreamStatus>) {
    this.status = { ...this.status, ...updates };

    // Notify all subscriptions about status changes
    this.subscriptions.forEach((subscription) => {
      subscription.onStatusChange?.(this.getStatus());
    });
  }

  dispose() {
    // Clean up all subscriptions and intervals
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.subscriptions.clear();
  }
}

// Global instance
export const realTimeDataManager = new RealTimeDataManager();

// Auto cleanup on page unload
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    realTimeDataManager.dispose();
  });
}
