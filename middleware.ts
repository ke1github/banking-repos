import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicRoute, ROUTES } from "@/constants/route";
import { applySecurityHeaders } from "@/lib/middleware/security-headers";

/**
 * Middleware function for handling authentication and route protection
 *
 * This middleware runs on every request that matches the config.matcher pattern
 * and determines whether to allow access or redirect based on authentication state.
 */
export async function middleware(request: NextRequest) {
  // Get auth cookie (set by server actions and client code)
  const hasAuthCookie = request.cookies.has("auth");
  const currentPath = request.nextUrl.pathname;

  // Check if current route is public (doesn't require authentication)
  const isAuthRoute = isPublicRoute(currentPath);

  // Redirect logic
  if (!hasAuthCookie && !isAuthRoute) {
    // If not logged in and trying to access a protected route, redirect to login
    const signInUrl = new URL(ROUTES.SIGN_IN, request.url);

    // Store the original URL to redirect back after login
    if (currentPath !== "/") {
      signInUrl.searchParams.set("callbackUrl", currentPath);
    }

    const response = NextResponse.redirect(signInUrl);
    // Apply security headers to redirect response
    return applySecurityHeaders(response);
  }

  // Redirect users who are logged in and trying to access login/signup pages
  if (
    hasAuthCookie &&
    isAuthRoute &&
    (currentPath === ROUTES.SIGN_IN || currentPath === ROUTES.SIGN_UP)
  ) {
    const response = NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    // Apply security headers to redirect response
    return applySecurityHeaders(response);
  }

  // For all other cases, proceed with the request but still apply security headers
  const response = NextResponse.next();

  // Handle redirect from old wealth-management route to new AI wealth route
  if (currentPath === "/wealth-management") {
    return NextResponse.redirect(
      new URL(ROUTES.WEALTH_MANAGEMENT, request.url)
    );
  }

  return applySecurityHeaders(response);
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all routes except static assets, API routes, etc.
    "/((?!api|_next/static|_next/image|_next/server-actions|icons|favicon.ico).*)",
  ],
};
