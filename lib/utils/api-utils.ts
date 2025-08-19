import { NextRequest, NextResponse } from "next/server";
import { getServerAccount } from "@/lib/appwrite/server-config";
import { formatErrorResponse } from "@/lib/utils/error-formatter";

/**
 * Helper type for defining handler functions
 */
export type ApiHandler = (
  req: NextRequest,
  context: { params: Record<string, string | string[]> }
) => Promise<NextResponse>;

/**
 * Type for auth required handler functions
 */
export type AuthRequiredHandler = (
  req: NextRequest,
  context: {
    params: Record<string, string | string[]>;
    userId: string;
  }
) => Promise<NextResponse>;

/**
 * Wraps an API route handler with error handling and logging
 */
export function withApiHandler(handler: ApiHandler): ApiHandler {
  return async (req, context) => {
    try {
      // Add request logging here if needed
      const start = Date.now();

      // Execute the handler
      const response = await handler(req, context);

      // Log completion if needed
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.nextUrl.pathname} - ${duration}ms`);

      return response;
    } catch (error) {
      console.error(`API Error: ${req.method} ${req.nextUrl.pathname}`, error);

      // Format the error for response
      const errorResponse = formatErrorResponse(error);

      // Return error response
      return NextResponse.json(errorResponse, {
        status: errorResponse.statusCode,
      });
    }
  };
}

/**
 * Wraps an API route handler with authentication check and error handling
 */
export function withAuthRequired(handler: AuthRequiredHandler): ApiHandler {
  return withApiHandler(async (req, context) => {
    try {
      // Try to get the current user
      const serverAccount = getServerAccount();
      const user = await serverAccount.get();

      // If we get here, user is authenticated
      return handler(req, {
        ...context,
        userId: user.$id,
      });
    } catch {
      // Return authentication error
      return NextResponse.json(
        {
          message: "Authentication required",
          statusCode: 401,
        },
        { status: 401 }
      );
    }
  });
}
