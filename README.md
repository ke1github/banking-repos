# SP Banking App

A modern banking and investment application built with Next.js and Appwrite.

## Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Investment portfolio management
- **Real-Time Stock Market Analysis** - Live market data with multi-provider API integration
- **Investment Screener** - Advanced multi-asset screening tool
- Transaction history
- Fund transfers between accounts
- Responsive dashboard interface
- Toggle between Banking and Investment modes

## Application Structure

The application is organized into two main sections:

1. **Banking Section** (`/banking/*`)

   - Dashboard, accounts, transactions, transfers, etc.

2. **Investment Section** (`/investment/*`)
   - Portfolio, stocks, mutual funds, bonds, crypto, etc.
   - **Real-Time Stock Analysis** - Live market data with comprehensive analysis tools
   - **Investment Screener** - Comprehensive screening tool for 7 asset classes

Users can switch between Banking and Investment modes using the sidebar tabs.

## Real-Time Stock Market Analysis

Professional-grade stock market analysis with live data integration. Works immediately with mock data, enhanced with real APIs.

**Key Features**: Real-time search, live market data, multi-provider APIs, technical analysis, sector performance, watchlist management.

**Usage**: Access at `/investment/stocks` - [Quick Start Guide](./docs/STOCK_QUICK_START.md)

## Investment Screener

Advanced multi-asset screening tool for filtering and analyzing investment opportunities across 7 asset classes.

**Supported Assets**: Stocks, Mutual Funds, Cryptocurrency, Bonds, ETFs, IPOs, Commodities

**Key Features**: Advanced filtering, smart search, recent searches, responsive design, export functionality

**Usage**: Access at `/investment/screener` - Select asset class and apply filters based on your criteria.

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your credentials:

   ```env
   # Required - Appwrite Configuration
   NEXT_PUBLIC_APPWRITE_ENDPOINT=your_endpoint
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id

   # Optional - Stock Market APIs (falls back to mock data)
   ALPHA_VANTAGE_API_KEY=your_key_here
   FINNHUB_API_KEY=your_key_here
   POLYGON_API_KEY=your_key_here
   ```

4. Run the development server: `npm run dev`

## Documentation

- [DOCUMENTATION.md](./DOCUMENTATION.md) — Full setup and architecture
- [Stock Market Quick Start](./docs/STOCK_QUICK_START.md) — Get started with real-time stock data
- [Real-Time Stock Implementation](./docs/REAL_TIME_STOCKS_IMPLEMENTATION.md) — Comprehensive technical guide
- [Investment Screener](#investment-screener) — Multi-asset screening tool
- [Validation System](./docs/VALIDATION.md)
- [Validation Examples](./docs/VALIDATION-EXAMPLES.md)
- [Auth Testing Guide](./docs/AUTH-TESTING.md)

## State Management

Uses **Zustand** for business logic (auth, stock data) and **URL State** for navigation (filters, tabs).

**Example:**

```tsx
// Zustand for app state
const { user, logout } = useAuthStore();
const { watchlist, addStock } = useStockStore();

// URL state for filters
const [filters, setFilters] = useFiltersState();
```

## Performance

- **Optimized**: 21.8kB stocks page, TypeScript coverage, intelligent caching
- **Production Ready**: Rate limiting, API fallbacks, offline-capable mock data

## License

MIT License — see LICENSE file.

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Yahoo Finance API](https://rapidapi.com/apidojo/api/yahoo-finance1/)
- [Alpha Vantage API](https://www.alphavantage.co/documentation/)
- [Finnhub API](https://finnhub.io/docs/api)
