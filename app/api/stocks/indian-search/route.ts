import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.length < 1) {
    return NextResponse.json({ results: [] });
  }

  try {
    // First try NSE search
    const nseResults = await searchNSE(query);

    // Then try BSE search
    const bseResults = await searchBSE(query);

    // Combine and deduplicate results
    const combinedResults = [...nseResults, ...bseResults];
    const uniqueResults = removeDuplicates(combinedResults);

    return NextResponse.json({
      results: uniqueResults.slice(0, 10), // Limit to 10 results
      totalFound: uniqueResults.length,
    });
  } catch (error) {
    console.error("Search Error:", error);

    // Return mock search results
    const mockResults = getMockSearchResults(query);
    return NextResponse.json({ results: mockResults });
  }
}

interface NSESearchItem {
  symbol: string;
  symbol_info: string;
}

async function searchNSE(query: string) {
  try {
    const response = await fetch(
      `https://www.nseindia.com/api/search/autocomplete?q=${query}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          Referer: "https://www.nseindia.com/",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return (
        data.symbols?.map((item: NSESearchItem) => ({
          symbol: item.symbol,
          name: item.symbol_info,
          exchange: "NSE" as const,
          type: "equity" as const,
        })) || []
      );
    }
  } catch (error) {
    console.error("NSE Search Error:", error);
  }

  return [];
}

interface BSESearchItem {
  SecurityCode: string;
  SecurityName: string;
}

interface SearchResult {
  symbol: string;
  name: string;
  exchange: "NSE" | "BSE";
  type: string;
  securityCode?: string;
  industry?: string;
}

async function searchBSE(query: string) {
  try {
    const response = await fetch(
      `https://api.bseindia.com/BseIndiaAPI/api/SearchSecuritywise/w?search=${query}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "application/json",
          Referer: "https://www.bseindia.com/",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return (
        data.Data?.map((item: BSESearchItem) => ({
          symbol: item.SecurityCode,
          name: item.SecurityName,
          exchange: "BSE" as const,
          type: "equity" as const,
          securityCode: item.SecurityCode,
        })) || []
      );
    }
  } catch (error) {
    console.error("BSE Search Error:", error);
  }

  return [];
}

function removeDuplicates(results: SearchResult[]) {
  const seen = new Set();
  return results.filter((item) => {
    const key = `${item.symbol}_${item.exchange}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getMockSearchResults(query: string) {
  const popularStocks = [
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
    {
      symbol: "SBIN",
      name: "State Bank of India",
      exchange: "NSE",
      type: "equity",
      industry: "Financial Services",
    },
    {
      symbol: "LT",
      name: "Larsen & Toubro Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Construction",
    },
    {
      symbol: "ITC",
      name: "ITC Limited",
      exchange: "NSE",
      type: "equity",
      industry: "FMCG",
    },
    {
      symbol: "KOTAKBANK",
      name: "Kotak Mahindra Bank Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Financial Services",
    },
    {
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Financial Services",
    },
    {
      symbol: "BHARTIARTL",
      name: "Bharti Airtel Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Telecommunications",
    },
    {
      symbol: "ASIANPAINT",
      name: "Asian Paints Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Paints",
    },
    {
      symbol: "MARUTI",
      name: "Maruti Suzuki India Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Automobile",
    },
    {
      symbol: "HCLTECH",
      name: "HCL Technologies Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Information Technology",
    },
    {
      symbol: "HINDUNILVR",
      name: "Hindustan Unilever Limited",
      exchange: "NSE",
      type: "equity",
      industry: "FMCG",
    },
    {
      symbol: "WIPRO",
      name: "Wipro Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Information Technology",
    },
    {
      symbol: "ADANIPORTS",
      name: "Adani Ports and Special Economic Zone Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Infrastructure",
    },
    {
      symbol: "ULTRACEMCO",
      name: "UltraTech Cement Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Cement",
    },
    {
      symbol: "TATAMOTORS",
      name: "Tata Motors Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Automobile",
    },
    {
      symbol: "POWERGRID",
      name: "Power Grid Corporation of India Limited",
      exchange: "NSE",
      type: "equity",
      industry: "Power",
    },
  ];

  return popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
  );
}
