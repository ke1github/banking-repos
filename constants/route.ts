// Centralized route constants and helpers to avoid hard-coded strings

export const ROUTES = {
  EXPENSE_MANAGEMENT: "/expense-management",
  CASH_MANAGEMENT: "/cash-management",
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  OAUTH_CALLBACK: "/auth/callback",
  TRANSACTIONS: "/transactions",
  TRANSFERS: "/transfers",
  CARDS_ACCOUNTS: "/cards-accounts",
  MY_BANKS: "/my-banks",
  CONNECT_BANK: "/connect-bank",
  SEND_MONEY: "/send-money",
  DEPOSITS: "/deposits",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  LOGOUT: "/logout",
  ACCOUNTS: "/accounts",
  ADD_CARD: "/add-card",
  CARDS: "/cards",
  STATE_MANAGEMENT_DEMO: "/state-management-demo",
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
