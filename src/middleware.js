import { NextResponse } from "next/server";
import { getAuthCookie } from "./lib/authCookies";

export function middleware(request) {
  const authCookie = getAuthCookie({ req: request });

  // List of paths that don't require authentication
  const publicPaths = ["/", "/api/"];

  if (
    !authCookie &&
    !publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
