import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol");
  const type = searchParams.get("type") || "quote";

  if (!symbol && type === "quote") {
    return NextResponse.json(
      { error: "Symbol is required for quote" },
      { status: 400 }
    );
  }

  try {
    let url: string;

    switch (type) {
      case "quote":
        url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
        break;
      case "indices":
        url = "https://www.nseindia.com/api/allIndices";
        break;
      case "gainers":
        url =
          "https://www.nseindia.com/api/equity-stockIndices?index=SECURITIES%20IN%20F%26O";
        break;
      default:
        url = `https://www.nseindia.com/api/quote-equity?symbol=${symbol}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Referer: "https://www.nseindia.com/",
        Origin: "https://www.nseindia.com",
        Connection: "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin",
      },
    });

    if (!response.ok) {
      throw new Error(`NSE API error: ${response.status}`);
    }

    const data = await response.json();

    // Add exchange info
    const enhancedData = {
      ...data,
      exchange: "NSE",
      lastUpdate: new Date().toISOString(),
      source: "NSE Official",
    };

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("NSE API Error:", error);

    // Return mock NSE data on error
    const mockData = getMockNSEData(symbol, type);
    return NextResponse.json(mockData);
  }
}

function getMockNSEData(symbol: string | null, type: string) {
  if (type === "indices") {
    return {
      data: [
        {
          index: "NIFTY 50",
          last: 19674.5,
          variation: 123.45,
          percentChange: 0.63,
          open: 19551.05,
          high: 19698.2,
          low: 19540.3,
          previousClose: 19551.05,
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
        },
        {
          index: "NIFTY IT",
          last: 31254.8,
          variation: 289.65,
          percentChange: 0.94,
          open: 30965.15,
          high: 31301.25,
          low: 30912.5,
          previousClose: 30965.15,
        },
      ],
      exchange: "NSE",
      lastUpdate: new Date().toISOString(),
      source: "NSE Mock Data",
    };
  }

  const mockStocks: { [key: string]: any } = {
    RELIANCE: {
      info: {
        symbol: "RELIANCE",
        companyName: "Reliance Industries Limited",
        industry: "Oil & Gas",
      },
      priceInfo: {
        lastPrice: 2456.75,
        change: 23.45,
        pChange: 0.96,
        previousClose: 2433.3,
        open: 2433.3,
        close: 2456.75,
        vwap: 2445.25,
        intraDayHighLow: { min: 2421.5, max: 2467.85, value: 2456.75 },
        weekHighLow: {
          min: 2156.3,
          max: 2534.85,
          value: 2456.75,
          minDate: "15-Feb-2024",
          maxDate: "28-Jan-2024",
        },
      },
      metadata: { series: "EQ", isin: "INE002A01018", industry: "Oil & Gas" },
    },
    TCS: {
      info: {
        symbol: "TCS",
        companyName: "Tata Consultancy Services Limited",
        industry: "Information Technology",
      },
      priceInfo: {
        lastPrice: 3567.8,
        change: -12.35,
        pChange: -0.34,
        previousClose: 3580.15,
        open: 3580.15,
        close: 3567.8,
        vwap: 3574.25,
        intraDayHighLow: { min: 3556.4, max: 3589.25, value: 3567.8 },
        weekHighLow: {
          min: 3234.5,
          max: 3899.5,
          value: 3567.8,
          minDate: "12-Mar-2024",
          maxDate: "18-Dec-2023",
        },
      },
      metadata: {
        series: "EQ",
        isin: "INE467B01029",
        industry: "Information Technology",
      },
    },
    INFY: {
      info: {
        symbol: "INFY",
        companyName: "Infosys Limited",
        industry: "Information Technology",
      },
      priceInfo: {
        lastPrice: 1456.25,
        change: 18.9,
        pChange: 1.32,
        previousClose: 1437.35,
        open: 1437.35,
        close: 1456.25,
        vwap: 1447.8,
        intraDayHighLow: { min: 1432.1, max: 1462.75, value: 1456.25 },
        weekHighLow: {
          min: 1234.5,
          max: 1648.35,
          value: 1456.25,
          minDate: "08-Feb-2024",
          maxDate: "22-Nov-2023",
        },
      },
      metadata: {
        series: "EQ",
        isin: "INE009A01021",
        industry: "Information Technology",
      },
    },
    HDFCBANK: {
      info: {
        symbol: "HDFCBANK",
        companyName: "HDFC Bank Limited",
        industry: "Financial Services",
      },
      priceInfo: {
        lastPrice: 1598.45,
        change: 7.8,
        pChange: 0.49,
        previousClose: 1590.65,
        open: 1590.65,
        close: 1598.45,
        vwap: 1594.55,
        intraDayHighLow: { min: 1587.2, max: 1603.85, value: 1598.45 },
        weekHighLow: {
          min: 1363.55,
          max: 1794.0,
          value: 1598.45,
          minDate: "26-Apr-2024",
          maxDate: "19-Sep-2023",
        },
      },
      metadata: {
        series: "EQ",
        isin: "INE040A01034",
        industry: "Financial Services",
      },
    },
    ICICIBANK: {
      info: {
        symbol: "ICICIBANK",
        companyName: "ICICI Bank Limited",
        industry: "Financial Services",
      },
      priceInfo: {
        lastPrice: 956.3,
        change: -4.25,
        pChange: -0.44,
        previousClose: 960.55,
        open: 960.55,
        close: 956.3,
        vwap: 958.42,
        intraDayHighLow: { min: 952.15, max: 964.8, value: 956.3 },
        weekHighLow: {
          min: 856.75,
          max: 1058.45,
          value: 956.3,
          minDate: "25-Mar-2024",
          maxDate: "15-Dec-2023",
        },
      },
      metadata: {
        series: "EQ",
        isin: "INE090A01021",
        industry: "Financial Services",
      },
    },
  };

  return {
    ...mockStocks[symbol || "RELIANCE"],
    exchange: "NSE",
    lastUpdate: new Date().toISOString(),
    source: "NSE Mock Data",
  };
}
