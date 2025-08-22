import { NextRequest, NextResponse } from "next/server";

// Indian market indices for fallback data
const MARKET_INDICES = [
  {
    name: "Nifty 50",
    symbol: "^NSEI",
    value: 19674.25,
    change: 145.35,
    changePercent: 0.74,
    volume: "2.1B",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Sensex",
    symbol: "^BSESN",
    value: 65953.48,
    change: 501.92,
    changePercent: 0.77,
    volume: "1.8B",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Bank Nifty",
    symbol: "^NSEBANK",
    value: 44692.15,
    change: 287.45,
    changePercent: 0.65,
    volume: "894M",
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "Nifty IT",
    symbol: "^CNXIT",
    value: 31245.8,
    change: -125.2,
    changePercent: -0.4,
    volume: "456M",
    lastUpdated: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get("symbol");
    const type = searchParams.get("type") || "quote";

    if (type === "indices") {
      // Return market indices
      try {
        const indices = await fetchYahooFinanceIndices();
        if (indices && indices.length > 0) {
          return NextResponse.json({ indices });
        }
      } catch (error) {
        console.error("Yahoo Finance indices API failed:", error);
      }

      // Fallback to mock data
      return NextResponse.json({ indices: MARKET_INDICES });
    }

    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    // Try Yahoo Finance API for individual stock quote
    try {
      const quote = await fetchYahooFinanceQuote(symbol);
      if (quote) {
        return NextResponse.json({ quote });
      }
    } catch (error) {
      console.error("Yahoo Finance quote API failed:", error);
    }

    // Fallback quote data
    const fallbackQuote = {
      symbol: symbol,
      name: symbol,
      price: 1250.75,
      change: 12.5,
      changePercent: 1.01,
      volume: 2450000,
      marketCap: 125000000000,
      sector: "Technology",
      exchange: "NSE",
      high: 1265.0,
      low: 1240.25,
      open: 1245.0,
      previousClose: 1238.25,
      dayRange: [1240.25, 1265.0] as [number, number],
      week52Range: [980.5, 1450.75] as [number, number],
      pe: 24.5,
      pb: 3.2,
      dividendYield: 1.25,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ quote: fallbackQuote });
  } catch (error) {
    console.error("Stock quote error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}

async function fetchYahooFinanceIndices() {
  const symbols = ["^NSEI", "^BSESN", "^NSEBANK", "^CNXIT"];

  try {
    const results = await Promise.allSettled(
      symbols.map((symbol) => fetchYahooFinanceQuote(symbol))
    );

    return results
      .filter((result) => result.status === "fulfilled")
      .map(
        (result) =>
          (
            result as PromiseFulfilledResult<
              Awaited<ReturnType<typeof fetchYahooFinanceQuote>>
            >
          ).value
      )
      .filter(Boolean);
  } catch (error) {
    console.error("Failed to fetch indices:", error);
    return [];
  }
}

async function fetchYahooFinanceQuote(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance quote API error: ${response.statusText}`);
  }

  const data = await response.json();
  const result = data.chart?.result?.[0];

  if (!result) {
    throw new Error("No data found for symbol");
  }

  const meta = result.meta;
  const quote = result.indicators?.quote?.[0];

  if (!meta || !quote) {
    throw new Error("Invalid data structure");
  }

  const currentPrice = meta.regularMarketPrice || 0;
  const previousClose = meta.previousClose || 0;
  const change = currentPrice - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol: meta.symbol,
    name: meta.symbol,
    value: currentPrice,
    price: currentPrice,
    change: change,
    changePercent: changePercent,
    volume: meta.regularMarketVolume || 0,
    marketCap: meta.marketCap || 0,
    sector: "Unknown",
    exchange: meta.exchangeName || "NSE",
    high: meta.regularMarketDayHigh || currentPrice,
    low: meta.regularMarketDayLow || currentPrice,
    open: meta.regularMarketOpen || currentPrice,
    previousClose: previousClose,
    dayRange: [
      meta.regularMarketDayLow || currentPrice,
      meta.regularMarketDayHigh || currentPrice,
    ] as [number, number],
    week52Range: [
      meta.fiftyTwoWeekLow || currentPrice,
      meta.fiftyTwoWeekHigh || currentPrice,
    ] as [number, number],
    lastUpdated: new Date().toISOString(),
  };
}
