import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only check API routes that need protection
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const apiKey = request.headers.get("x-api-key");

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return new NextResponse(
      JSON.stringify({
        error: "Unauthorized",
        message: "Invalid or missing API key",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": "ApiKey",
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
