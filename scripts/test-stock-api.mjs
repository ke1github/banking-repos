// Test script to verify stock API integration
import { stockDataService } from "../lib/api/stockDataService.js";

async function testStockAPIs() {
  console.log("🚀 Testing Stock Market API Integration...\n");

  try {
    // Test 1: Search functionality
    console.log("📈 Testing Stock Search...");
    const searchResults = await stockDataService.searchStocks("AAPL");
    console.log(
      `✅ Search Results (${searchResults.length} found):`,
      searchResults.slice(0, 3).map((r) => ({ symbol: r.symbol, name: r.name }))
    );

    // Test 2: Stock quote retrieval
    console.log("\n📊 Testing Stock Quote...");
    const quote = await stockDataService.getStockQuote("AAPL");
    console.log("✅ Quote for AAPL:", {
      symbol: quote.symbol,
      name: quote.name,
      price: quote.price,
      change: quote.change,
      changePercent: quote.changePercent,
    });

    // Test 3: Market indices
    console.log("\n🌐 Testing Market Indices...");
    const indices = await stockDataService.getMarketIndices();
    console.log(
      `✅ Market Indices (${indices.length} found):`,
      indices
        .slice(0, 3)
        .map((i) => ({ name: i.name, value: i.value, change: i.change }))
    );

    // Test 4: Multiple quotes
    console.log("\n📈 Testing Multiple Quotes...");
    const multipleQuotes = await stockDataService.getMultipleQuotes([
      "AAPL",
      "GOOGL",
      "MSFT",
    ]);
    console.log(
      `✅ Multiple Quotes (${multipleQuotes.length} found):`,
      multipleQuotes.map((q) => ({ symbol: q.symbol, price: q.price }))
    );

    console.log("\n🎉 All API tests completed successfully!");
  } catch (error) {
    console.error("❌ API Test Failed:", error.message);
    console.log(
      "\n⚠️  Note: This is expected if you do not have API keys configured."
    );
    console.log(
      "   The service will fall back to realistic mock data for development."
    );
  }
}

// Run the test
testStockAPIs();
