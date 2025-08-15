import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get("auth");

  // If no auth cookie exists, return unauthorized
  if (!authCookie) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // In a real app, you would:
    // 1. Verify the token with your auth provider
    // 2. Fetch actual user data from your database

    // For this demo, we'll just parse the cookie and return the user data
    const userData = JSON.parse(authCookie.value);

    return NextResponse.json({
      user: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);

    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
