// Centralized route constants and helpers to avoid hard-coded strings

export const ROUTES = {
  EXPENSE_MANAGEMENT: "/banking/expense-management",
  CASH_MANAGEMENT: "/banking/cash-management",
  HOME: "/",
  BANKING_HOME: "/banking",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  OAUTH_CALLBACK: "/auth/callback",
  TRANSACTIONS: "/banking/transactions",
  TRANSFERS: "/banking/transfers",
  CARDS_ACCOUNTS: "/banking/cards-accounts",
  MY_BANKS: "/banking/my-banks",
  CONNECT_BANK: "/banking/connect-bank",
  SEND_MONEY: "/banking/send-money",
  DEPOSITS: "/banking/deposits",
  PROFILE: "/banking/profile",
  SETTINGS: "/banking/settings",
  LOGOUT: "/logout",
  ACCOUNTS: "/banking/accounts",
  ADD_CARD: "/banking/add-card",
  CARDS: "/banking/cards",

  // Investment routes
  INVESTMENTS: "/investment",
  PORTFOLIO: "/investment/portfolio",
  STOCKS: "/investment/stocks",
  MUTUAL_FUNDS: "/investment/mutual-funds",
  BONDS: "/investment/bonds",
  CRYPTO: "/investment/crypto",
  INVESTMENT_PERFORMANCE: "/investment/performance",
  INVESTMENT_PLANNER: "/investment/planner",
  INVESTMENT_CALCULATORS: "/investment/calculators",
} as const;

// Public (unauthenticated) routes
export const PUBLIC_ROUTES: readonly string[] = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
  ROUTES.OAUTH_CALLBACK,
];

// Dynamic path builders
export const accountDetailsPath = (id: string) => `${ROUTES.ACCOUNTS}/${id}`;
export const cardDetailsPath = (id: string) => `${ROUTES.CARDS}/${id}`;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// Type guard for route paths
export const isRoutePath = (href: string): href is RoutePath =>
  (Object.values(ROUTES) as string[]).includes(href);

// Public-route check helper
export const isPublicRoute = (pathname: string): boolean =>
  PUBLIC_ROUTES.some((path) => pathname.startsWith(path));

