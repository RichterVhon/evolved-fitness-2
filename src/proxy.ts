import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { AppSession } from "@/lib/auth";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth as AppSession;

  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    pathname.startsWith("/dashboard/members") &&
    session?.user.role !== "staff"
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
