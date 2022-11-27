import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const { pathname } = req.nextUrl;

  // Allow the requests if the following is true...
  // 1) Its a request for next-auth sessin & provider fetching
  // 2) the token exists
  if (token) return NextResponse.next();

  // Redirect them to login if they dont have token AND are requesting a protected route
  if (!token && !pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// <root>/middleware.js
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|favicon.ico).*)",
  ],
};
