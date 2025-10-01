import { NextResponse } from "next/server";

export async function POST(req) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_SECRET) {
    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin-token", password, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}