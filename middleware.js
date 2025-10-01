// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  const token = req.cookies.get("admin-token")?.value;
  const isLoggedIn = token === process.env.ADMIN_SECRET;

  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};