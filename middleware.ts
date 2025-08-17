import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isPublicRoute, ROUTES } from "@/constants/route";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("auth")?.value;

  // Define auth routes (that don't require authentication)
  const isAuthRoute = isPublicRoute(request.nextUrl.pathname);

  // Redirect logic
  if (!currentUser && !isAuthRoute) {
    // If not logged in and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url));
  }

  // Note: We do NOT redirect authenticated users away from auth routes based solely on the cookie.
  // This avoids loops when the cookie is stale but the client session expired.

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_next/server-actions|icons|favicon.ico).*)",
  ],
};
