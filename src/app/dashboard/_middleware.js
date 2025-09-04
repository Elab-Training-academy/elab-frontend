// middleware.js (in project root)
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token") || req.headers.get("authorization");

  // If not logged in and trying to access dashboard, redirect
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
