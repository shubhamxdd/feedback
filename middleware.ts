import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token && url.pathname.startsWith("/sign-in")) ||
    url.pathname.startsWith("/sign-up") ||
    url.pathname.startsWith("/verify") ||
    url.pathname.startsWith("/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/verify",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};
