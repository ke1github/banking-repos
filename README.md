# SP Banking App

A modern banking application built with Next.js and Appwrite.

## Features

- User authentication (sign-up, sign-in, logout)
- Banking account management
- Transaction history
- Fund transfers between accounts
- Responsive dashboard interface

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env.local` with your Appwrite credentials
4. Run the development server: `npm run dev`

## Documentation

- [DOCUMENTATION.md](./DOCUMENTATION.md) — Full setup and architecture
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
