import { NextRequest, NextResponse } from "next/server";

// Cache for storing session cookies
let sessionCookies: string = "";
let lastSessionTime = 0;
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

// Function to establish NSE session
async function establishNSESession(): Promise<string> {
  try {
    console.log("Establishing NSE session...");

    const response = await fetch("https://www.nseindia.com/", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
      },
    });

    if (response.ok) {
      const cookies = response.headers.get("set-cookie");
      if (cookies) {
        sessionCookies = cookies;
        lastSessionTime = Date.now();
        console.log("NSE session established successfully");
        return cookies;
      }
    }

    throw new Error("Failed to establish NSE session");
  } catch (error) {
    console.error("Session establishment error:", error);
    return "";
  }
}

// Function to get valid session cookies
async function getValidSession(): Promise<string> {
  const now = Date.now();
  let retryCount = 0;
  const maxRetries = 3;

  // Check if session is expired or doesn't exist
  if (!sessionCookies || now - lastSessionTime > SESSION_TIMEOUT) {
    while (retryCount < maxRetries) {
      try {
        sessionCookies = await establishNSESession();
        if (sessionCookies) {
          break;
        }
      } catch (error) {
        console.error(
          `Session establishment retry ${retryCount + 1} failed:`,
          error
        );
      }
      retryCount++;

      // Wait before retrying (exponential backoff)
      if (retryCount < maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, retryCount))
        );
      }
    }
  }

  return sessionCookies;
}

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
    // Get valid session cookies with retries
    const cookies = await getValidSession();
    if (!cookies) {
      console.error("Failed to establish NSE session after retries");
      throw new Error("Failed to establish NSE session");
    }

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

    console.log(`Fetching NSE data for ${symbol} from ${url}`);

    // Set up AbortController with 10 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://www.nseindia.com/",
          Origin: "https://www.nseindia.com",
          Connection: "keep-alive",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          ...(cookies && { Cookie: cookies }),
        },
        signal: controller.signal,
      });
    } catch (fetchError) {
      console.error(`NSE API fetch error: ${fetchError}`);
      clearTimeout(timeoutId);

      // Return mock data for fetch failures (timeout, network issues, etc)
      const mockData = getMockNSEData(symbol, type);
      return NextResponse.json(mockData);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      console.error(
        `NSE API error for ${symbol}: ${response.status} ${response.statusText}`
      );

      // If we get 401, try to refresh session and retry once
      if (response.status === 401) {
        console.log("401 error, refreshing session and retrying...");
        sessionCookies = ""; // Clear invalid session
        const newCookies = await getValidSession();

        // Set up a new AbortController for the retry
        const retryController = new AbortController();
        const retryTimeoutId = setTimeout(() => retryController.abort(), 10000);

        let retryResponse;
        try {
          retryResponse = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "application/json, text/plain, */*",
              "Accept-Language": "en-US,en;q=0.9",
              "Accept-Encoding": "gzip, deflate, br",
              Referer: "https://www.nseindia.com/",
              Origin: "https://www.nseindia.com",
              Connection: "keep-alive",
              "Sec-Fetch-Dest": "empty",
              "Sec-Fetch-Mode": "cors",
              "Sec-Fetch-Site": "same-origin",
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              ...(newCookies && { Cookie: newCookies }),
            },
            signal: retryController.signal,
          });
        } catch (retryError) {
          console.error(`NSE API retry fetch error: ${retryError}`);
          clearTimeout(retryTimeoutId);
          // Return mock data as fallback
          return NextResponse.json({
            info: {
              symbol: symbol,
              companyName: `${symbol} Limited`,
              industry: "Financial Services",
            },
            priceInfo: {
              lastPrice: Math.floor(Math.random() * 1000) + 100,
              change: Math.floor(Math.random() * 20) - 10,
              pChange: Math.random() * 4 - 2,
              weekHighLow: {
                max: Math.floor(Math.random() * 1200) + 900,
                min: Math.floor(Math.random() * 200) + 50,
              },
            },
            exchange: "NSE",
            lastUpdate: new Date().toISOString(),
            source: "Mock Data - NSE API Unavailable",
          });
        } finally {
          clearTimeout(retryTimeoutId);
        }

        if (!retryResponse.ok) {
          console.error(
            `NSE API retry failed for ${symbol}: ${retryResponse.status} ${retryResponse.statusText}`
          );

          // Return mock data as fallback
          return NextResponse.json({
            info: {
              symbol: symbol,
              companyName: `${symbol} Limited`,
              industry: "Financial Services",
            },
            priceInfo: {
              lastPrice: Math.floor(Math.random() * 1000) + 100,
              change: Math.floor(Math.random() * 20) - 10,
              pChange: Math.random() * 4 - 2,
              weekHighLow: {
                max: Math.floor(Math.random() * 1200) + 900,
                min: Math.floor(Math.random() * 200) + 50,
              },
            },
            exchange: "NSE",
            lastUpdate: new Date().toISOString(),
            source: "Mock Data - NSE API Unavailable",
          });
        }

        try {
          const retryData = await retryResponse.json();
          return NextResponse.json({
            ...retryData,
            exchange: "NSE",
            lastUpdate: new Date().toISOString(),
            source: "NSE Official",
          });
        } catch (jsonError) {
          console.error(`Error parsing retry JSON: ${jsonError}`);
          // Return mock data as fallback
          return NextResponse.json({
            info: {
              symbol: symbol,
              companyName: `${symbol} Limited`,
              industry: "Financial Services",
            },
            priceInfo: {
              lastPrice: Math.floor(Math.random() * 1000) + 100,
              change: Math.floor(Math.random() * 20) - 10,
              pChange: Math.random() * 4 - 2,
              weekHighLow: {
                max: Math.floor(Math.random() * 1200) + 900,
                min: Math.floor(Math.random() * 200) + 50,
              },
            },
            exchange: "NSE",
            lastUpdate: new Date().toISOString(),
            source: "Mock Data - NSE API Unavailable (JSON parse error)",
          });
        }
      }

      // For other errors, return mock data
      return NextResponse.json({
        info: {
          symbol: symbol,
          companyName: `${symbol} Limited`,
          industry: "Financial Services",
        },
        priceInfo: {
          lastPrice: Math.floor(Math.random() * 1000) + 100,
          change: Math.floor(Math.random() * 20) - 10,
          pChange: Math.random() * 4 - 2,
          weekHighLow: {
            max: Math.floor(Math.random() * 1200) + 900,
            min: Math.floor(Math.random() * 200) + 50,
          },
        },
        exchange: "NSE",
        lastUpdate: new Date().toISOString(),
        source: "Mock Data - NSE API Unavailable",
      });
    }

    try {
      const data = await response.json();
      console.log(`Successfully fetched NSE data for ${symbol}`);

      // Add exchange info
      const enhancedData = {
        ...data,
        exchange: "NSE",
        lastUpdate: new Date().toISOString(),
        source: "NSE Official",
      };

      return NextResponse.json(enhancedData);
    } catch (jsonError) {
      console.error(`Error parsing NSE JSON: ${jsonError}`);
      // Return mock data for JSON parsing errors
      const mockData = getMockNSEData(symbol, type);
      return NextResponse.json(mockData);
    }
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

  const mockStocks: {
    [key: string]: {
      info: {
        symbol: string;
        companyName: string;
        industry: string;
      };
      priceInfo: {
        lastPrice: number;
        change: number;
        pChange: number;
        previousClose?: number;
        open?: number;
        close?: number;
        vwap?: number;
        intraDayHighLow?: {
          min: number;
          max: number;
          value: number;
        };
        weekHighLow?: {
          min: number;
          max: number;
          value: number;
          minDate?: string;
          maxDate?: string;
        };
      };
      metadata?: {
        series: string;
        isin: string;
        industry: string;
      };
    };
  } = {
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
