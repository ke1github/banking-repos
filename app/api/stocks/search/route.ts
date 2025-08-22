import { NextRequest, NextResponse } from "next/server";

// Indian stock exchanges and their major indices for fallback
const INDIAN_STOCKS = [
  // NSE Top Stocks
  {
    symbol: "RELIANCE.NS",
    name: "Reliance Industries Limited",
    exchange: "NSE",
    sector: "Energy",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "TCS.NS",
    name: "Tata Consultancy Services Limited",
    exchange: "NSE",
    sector: "Technology",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "INFY.NS",
    name: "Infosys Limited",
    exchange: "NSE",
    sector: "Technology",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "HDFCBANK.NS",
    name: "HDFC Bank Limited",
    exchange: "NSE",
    sector: "Banking",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "ICICIBANK.NS",
    name: "ICICI Bank Limited",
    exchange: "NSE",
    sector: "Banking",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "HINDUNILVR.NS",
    name: "Hindustan Unilever Limited",
    exchange: "NSE",
    sector: "Consumer Goods",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "ITC.NS",
    name: "ITC Limited",
    exchange: "NSE",
    sector: "Consumer Goods",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "SBIN.NS",
    name: "State Bank of India",
    exchange: "NSE",
    sector: "Banking",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "BHARTIARTL.NS",
    name: "Bharti Airtel Limited",
    exchange: "NSE",
    sector: "Telecom",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "KOTAKBANK.NS",
    name: "Kotak Mahindra Bank Limited",
    exchange: "NSE",
    sector: "Banking",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "LT.NS",
    name: "Larsen & Toubro Limited",
    exchange: "NSE",
    sector: "Construction",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "ASIANPAINT.NS",
    name: "Asian Paints Limited",
    exchange: "NSE",
    sector: "Chemicals",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "MARUTI.NS",
    name: "Maruti Suzuki India Limited",
    exchange: "NSE",
    sector: "Automobile",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "TITAN.NS",
    name: "Titan Company Limited",
    exchange: "NSE",
    sector: "Consumer Discretionary",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "WIPRO.NS",
    name: "Wipro Limited",
    exchange: "NSE",
    sector: "Technology",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "HCLTECH.NS",
    name: "HCL Technologies Limited",
    exchange: "NSE",
    sector: "Technology",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "SUNPHARMA.NS",
    name: "Sun Pharmaceutical Industries Limited",
    exchange: "NSE",
    sector: "Pharmaceuticals",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "ONGC.NS",
    name: "Oil and Natural Gas Corporation Limited",
    exchange: "NSE",
    sector: "Energy",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "NTPC.NS",
    name: "NTPC Limited",
    exchange: "NSE",
    sector: "Power",
    currency: "INR",
    type: "EQUITY",
  },
  {
    symbol: "POWERGRID.NS",
    name: "Power Grid Corporation of India Limited",
    exchange: "NSE",
    sector: "Power",
    currency: "INR",
    type: "EQUITY",
  },
  // Popular ETFs
  {
    symbol: "NIFTYBEES.NS",
    name: "Nippon India ETF Nifty BeES",
    exchange: "NSE",
    sector: "ETF",
    currency: "INR",
    type: "ETF",
  },
  {
    symbol: "BANKBEES.NS",
    name: "Nippon India ETF Bank BeES",
    exchange: "NSE",
    sector: "ETF",
    currency: "INR",
    type: "ETF",
  },
  {
    symbol: "ITBEES.NS",
    name: "Nippon India ETF IT BeES",
    exchange: "NSE",
    sector: "ETF",
    currency: "INR",
    type: "ETF",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Query must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Try Yahoo Finance API first (server-side, no CORS issues)
    try {
      const yahooResponse = await fetchYahooFinanceSearch(query);
      if (yahooResponse && yahooResponse.length > 0) {
        return NextResponse.json({ results: yahooResponse });
      }
    } catch (error) {
      console.error("Yahoo Finance API failed:", error);
    }

    // Fallback to local Indian stocks search
    const filteredStocks = INDIAN_STOCKS.filter(
      (stock) =>
        stock.name.toLowerCase().includes(query) ||
        stock.symbol.toLowerCase().includes(query) ||
        stock.sector.toLowerCase().includes(query)
    ).slice(0, 10);

    return NextResponse.json({ results: filteredStocks });
  } catch (error) {
    console.error("Stock search error:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}

async function fetchYahooFinanceSearch(query: string) {
  const url = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(
    query
  )}&quotesCount=10&newsCount=0`;

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Finance API error: ${response.statusText}`);
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
      typeDisp?: string;
    }) => ({
      symbol: item.symbol,
      name: item.shortname || item.longname || item.symbol,
      exchange: item.exchange || "NSE",
      sector: item.sector || "Unknown",
      currency: item.currency || "INR",
      type: item.typeDisp || "EQUITY",
    })
  );
}
