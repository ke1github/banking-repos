import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // In a real app:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store in database
    // 4. Generate proper JWT tokens

    // Mock successful signup
    const mockUser = {
      id: "123456",
      name: name,
      email: email,
    };

    // Set a cookie with the user data
    const response = NextResponse.json({
      user: mockUser,
      message: "Signup successful",
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
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
