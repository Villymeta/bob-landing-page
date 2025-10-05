// app/api/auth/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password } = await request.json();

  const isValid =
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD;

  if (!isValid) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_auth", "true", {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });

  return response;
}