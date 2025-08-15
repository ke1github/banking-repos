import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// In a real app, you would validate with a database
// This is just for demonstration
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // In a real app:
    // 1. Check credentials against database
    // 2. Generate proper JWT tokens

    // Mock successful login
    const mockUser = {
      id: "123456",
      name: "Demo User",
      email: email,
    };

    // Set a cookie with the user data
    const response = NextResponse.json({
      user: mockUser,
      message: "Login successful",
    });

    // Set a simple auth cookie (insecure, just for demo)
    // In production, use proper secure, httpOnly cookies with JWT
    response.cookies.set({
      name: "auth",
      value: JSON.stringify(mockUser),
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      // secure: true, // Uncomment in production
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
