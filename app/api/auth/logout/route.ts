import { NextResponse } from "next/server";

export async function GET() {
  // Create a response that clears the auth cookie
  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  // Remove the auth cookie
  response.cookies.set({
    name: "auth",
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    expires: new Date(0), // Expire immediately
  });

  return response;
}
