"use server";

import { NextRequest, NextResponse } from "next/server";
import { formatErrorResponse } from "@/lib/utils/error-formatter";

/**
 * Error handler middleware
 * This middleware intercepts errors from API routes and provides structured error responses
 */
export async function errorHandlerMiddleware(
  req: NextRequest,
  res: NextResponse,
  next: () => Promise<NextResponse>
) {
  try {
    // Attempt to execute the next middleware/route handler
    return await next();
  } catch (error) {
    console.error("API Error:", error);

    // Format the error response
    const errorResponse = formatErrorResponse(error);

    // Return error response
    return NextResponse.json(errorResponse, {
      status: errorResponse.statusCode,
    });
  }
}
