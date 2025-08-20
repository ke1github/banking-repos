import { NextResponse } from "next/server";

/**
 * Apply security headers to NextResponse objects
 *
 * This function adds recommended security headers to all responses
 * to help protect against common web vulnerabilities.
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.api.appwrite.io;"
  );

  // Prevent browsers from incorrectly detecting non-scripts as scripts
  response.headers.set("X-Content-Type-Options", "nosniff");

  // XSS Protection header (although modern browsers use CSP)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Strict Transport Security (use HTTPS only)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Feature Policy / Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  return response;
}
