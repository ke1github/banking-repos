import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("auth")?.value;

  // Define auth routes (that don't require authentication)
  const isAuthRoute =
    request.nextUrl.pathname.startsWith("/sign-in") ||
    request.nextUrl.pathname.startsWith("/sign-up") ||
    request.nextUrl.pathname.startsWith("/forgot-password");

  // Redirect logic
  if (!currentUser && !isAuthRoute) {
    // If not logged in and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (currentUser && isAuthRoute) {
    // If logged in and trying to access auth routes, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icons|favicon.ico).*)"],
};
