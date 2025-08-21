# SP Banking App

A modern banking and investment application built with Next.js and Appwrite.

## Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Investment portfolio management
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
   - **Investment Screener** - Comprehensive screening tool for 7 asset classes

Users can switch between Banking and Investment modes using the sidebar tabs.

## Investment Screener

The Investment Screener is a powerful tool that allows users to filter and analyze various investment opportunities across multiple asset classes.

### Supported Asset Classes

1. **Stocks** - Indian equity markets (NSE/BSE ready)
2. **Mutual Funds** - SIP, lump sum, and systematic plans
3. **Cryptocurrency** - Digital assets with real-time tracking
4. **Bonds** - Government and corporate bonds
5. **ETFs** - Exchange-traded funds
6. **IPOs** - Initial public offerings
7. **Commodities** - Gold, silver, oil, and other commodities

### Key Features

- **Advanced Filtering**: Filter by price range, market cap, sector, ratings, and more
- **Smart Search**: Intelligent search with category-specific suggestions
- **Recent Searches**: Quick access to previously searched instruments
- **Responsive Design**: Optimized for desktop and mobile devices
- **Export Functionality**: Export filtered results for analysis
- **Real-time Data Ready**: Structure prepared for Indian market APIs

### Technical Architecture

- **Modular Components**: Separate screener for each asset class
- **TypeScript**: Fully typed interfaces for all data structures
- **Reusable Search**: Common search component across all screeners
- **Performance**: Optimized with Suspense boundaries and lazy loading
- **API Ready**: Prepared for integration with NSE/BSE and other market data providers

### Usage

Access the screener at `/investment/screener` or through the sidebar navigation under "Tools" section. Select your preferred asset class and use the filters to narrow down investment options based on your criteria.

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your Appwrite credentials
4. Run the development server: `npm run dev`

## Documentation

- [DOCUMENTATION.md](./DOCUMENTATION.md) — Full setup and architecture
- [Investment Screener](#investment-screener) — Multi-asset screening tool
- [Validation System](./docs/VALIDATION.md)
- [Validation Examples](./docs/VALIDATION-EXAMPLES.md)
- [Auth Testing Guide](./docs/AUTH-TESTING.md)

## State Management: Zustand vs URL State

Our banking app uses two complementary state management approaches:

| Use Case                    | Zustand | URL State |
| --------------------------- | ------- | --------- |
| Application-wide state      | ✅      |           |
| Complex business logic      | ✅      |           |
| Session-specific data       | ✅      |           |
| Server-synchronized state   | ✅      |           |
| Navigation state            |         | ✅        |
| Filter/search parameters    |         | ✅        |
| Sharable/bookmarkable state |         | ✅        |
| Deep linking                |         | ✅        |

**Zustand** is for business logic, session, and backend-synced state.  
**URL State** is for navigation, filters, and sharable/bookmarkable state.

### Examples

**Zustand:**

```tsx
const { user, login, logout } = useAuthStore();
return user ? (
  <div>
    <h1>Welcome, {user.name}</h1>
    <button onClick={logout}>Logout</button>
  </div>
) : (
  <LoginForm onSubmit={login} />
);
```

**URL State:**

```tsx
const [filters, setFilters] = useTransactionFiltersState();
return (
  <div>
    <select
      value={filters.type}
      onChange={(e) => setFilters({ type: e.target.value })}
    >
      <option value="all">All Transactions</option>
      <option value="deposit">Deposits</option>
      <option value="withdrawal">Withdrawals</option>
    </select>
    <input
      type="date"
      value={filters.dateFrom}
      onChange={(e) => setFilters({ dateFrom: e.target.value })}
    />
  </div>
);
```

## License

MIT License — see LICENSE file.

## References

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Next.js Routing](https://nextjs.org/docs/routing/introduction)
- [Appwrite Documentation](https://appwrite.io/docs)
