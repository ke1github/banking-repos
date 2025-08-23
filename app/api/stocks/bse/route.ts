import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const securityCode = searchParams.get("code");
  const type = searchParams.get("type") || "quote";

  try {
    let url: string;

    if (type === "indices") {
      url =
        "https://api.bseindia.com/BseIndiaAPI/api/BSEIndexdata/w?strIndices=1,2,3,4,5";
    } else if (securityCode) {
      url = `https://api.bseindia.com/BseIndiaAPI/api/GetMktData/w?strcode=${securityCode}`;
    } else {
      // Convert NSE symbol to BSE code if needed
      const bseCode = convertToBSECode(symbol);
      url = `https://api.bseindia.com/BseIndiaAPI/api/GetMktData/w?strcode=${bseCode}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "application/json",
        Referer: "https://www.bseindia.com/",
        Origin: "https://www.bseindia.com",
      },
    });

    if (!response.ok) {
      throw new Error(`BSE API error: ${response.status}`);
    }

    const data = await response.json();

    const enhancedData = {
      ...data,
      exchange: "BSE",
      lastUpdate: new Date().toISOString(),
      source: "BSE Official",
    };

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("BSE API Error:", error);

    // Return mock BSE data on error
    const mockData = getMockBSEData(symbol, securityCode, type);
    return NextResponse.json(mockData);
  }
}

function convertToBSECode(symbol: string | null): string {
  const symbolToBSE: { [key: string]: string } = {
    RELIANCE: "500325",
    TCS: "532540",
    INFY: "500209",
    HDFCBANK: "500180",
    ICICIBANK: "532174",
    SBIN: "500112",
    LT: "500510",
    ITC: "500875",
    KOTAKBANK: "500247",
    BAJFINANCE: "500034",
    BHARTIARTL: "532454",
    ASIANPAINT: "500820",
    MARUTI: "532500",
    HCLTECH: "532281",
    HINDUNILVR: "500696",
  };

  return symbolToBSE[symbol || "RELIANCE"] || "500325";
}

function getMockBSEData(
  symbol: string | null,
  code: string | null,
  type: string
) {
  if (type === "indices") {
    return {
      data: [
        {
          index: "SENSEX",
          currentValue: 65953.48,
          change: 189.83,
          percentChange: 0.29,
          open: 65763.65,
          high: 66012.35,
          low: 65741.2,
          previousClose: 65763.65,
        },
        {
          index: "BSE MID CAP",
          currentValue: 28456.72,
          change: -45.28,
          percentChange: -0.16,
          open: 28501.0,
          high: 28567.85,
          low: 28398.45,
          previousClose: 28501.0,
        },
        {
          index: "BSE SMALL CAP",
          currentValue: 31247.65,
          change: 234.12,
          percentChange: 0.75,
          open: 31013.53,
          high: 31298.77,
          low: 30987.34,
          previousClose: 31013.53,
        },
        {
          index: "BSE AUTO",
          currentValue: 42156.82,
          change: 156.45,
          percentChange: 0.37,
          open: 42000.37,
          high: 42234.56,
          low: 41987.23,
          previousClose: 42000.37,
        },
      ],
      exchange: "BSE",
      lastUpdate: new Date().toISOString(),
      source: "BSE Mock Data",
    };
  }

  const mockStocks: { [key: string]: any } = {
    "500325": {
      securityCode: "500325",
      symbol: "RELIANCE",
      companyName: "Reliance Industries Limited",
      currentPrice: 2456.75,
      change: 23.45,
      percentChange: 0.96,
      open: 2433.3,
      high: 2467.85,
      low: 2421.5,
      previousClose: 2433.3,
      volume: 2456789,
      value: 6034567890,
      totalTradedQuantity: 2456789,
    },
    "532540": {
      securityCode: "532540",
      symbol: "TCS",
      companyName: "Tata Consultancy Services Limited",
      currentPrice: 3567.8,
      change: -12.35,
      percentChange: -0.34,
      open: 3580.15,
      high: 3589.25,
      low: 3556.4,
      previousClose: 3580.15,
      volume: 1234567,
      value: 4401234567,
      totalTradedQuantity: 1234567,
    },
    "500209": {
      securityCode: "500209",
      symbol: "INFY",
      companyName: "Infosys Limited",
      currentPrice: 1456.25,
      change: 18.9,
      percentChange: 1.32,
      open: 1437.35,
      high: 1462.75,
      low: 1432.1,
      previousClose: 1437.35,
      volume: 3456789,
      value: 5032156789,
      totalTradedQuantity: 3456789,
    },
    "500180": {
      securityCode: "500180",
      symbol: "HDFCBANK",
      companyName: "HDFC Bank Limited",
      currentPrice: 1598.45,
      change: 7.8,
      percentChange: 0.49,
      open: 1590.65,
      high: 1603.85,
      low: 1587.2,
      previousClose: 1590.65,
      volume: 2134567,
      value: 3412345678,
      totalTradedQuantity: 2134567,
    },
    "532174": {
      securityCode: "532174",
      symbol: "ICICIBANK",
      companyName: "ICICI Bank Limited",
      currentPrice: 956.3,
      change: -4.25,
      percentChange: -0.44,
      open: 960.55,
      high: 964.8,
      low: 952.15,
      previousClose: 960.55,
      volume: 4567890,
      value: 4367890123,
      totalTradedQuantity: 4567890,
    },
  };

  const stockCode = code || convertToBSECode(symbol);
  return {
    ...mockStocks[stockCode],
    exchange: "BSE",
    lastUpdate: new Date().toISOString(),
    source: "BSE Mock Data",
  };
}
