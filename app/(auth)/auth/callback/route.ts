import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const remember = searchParams.get("remember") === "1";

  const response = NextResponse.redirect(new URL("/", origin));
  // Set lightweight auth cookie for middleware gating
  response.cookies.set("auth", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
  });

  return response;
}
