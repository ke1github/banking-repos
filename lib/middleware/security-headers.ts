/**
 * Security headers configuration for Next.js
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * List of security headers to be applied to all responses
 */
const securityHeaders = [
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Prevent embedding of site in iframe (clickjacking protection)
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Enable browser cross-site scripting protection
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Prevent all browsers from storing this page in cache
  {
    key: "Cache-Control",
    value: "no-store, max-age=0",
  },
  // Prevent the browser from sending the Referer header when navigating from https to http
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: buildCSP(),
  },
];

/**
 * Build Content Security Policy based on environment
 */
function buildCSP(): string {
  // Base CSP directives
  const directives = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://cdn.jsdelivr.net",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": [
      "'self'",
      "data:",
      "https://cloud.appwrite.io",
      "https://*.appwrite.io",
    ],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": [
      "'self'",
      "https://cloud.appwrite.io",
      "https://*.appwrite.io",
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "",
    ],
    "frame-src": ["'self'"],
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
  };

  // Convert directives object to CSP string
  return Object.entries(directives)
    .map(([key, values]) => {
      const nonEmptyValues = values.filter(Boolean);
      return nonEmptyValues.length > 0
        ? `${key} ${nonEmptyValues.join(" ")}`
        : "";
    })
    .filter(Boolean)
    .join("; ");
}

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  // Apply all defined security headers
  for (const { key, value } of securityHeaders) {
    response.headers.set(key, value);
  }

  return response;
}

/**
 * Middleware function to apply security headers to all responses
 * Can be used as a standalone middleware or composed with other middleware functions
 */
export function securityHeadersMiddleware(
  request: NextRequest,
  response: NextResponse
): NextResponse {
  return applySecurityHeaders(response);
}
