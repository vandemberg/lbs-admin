import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get("auth_token");

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/(admin)/:path*", // Apply middleware to admin routes
};
