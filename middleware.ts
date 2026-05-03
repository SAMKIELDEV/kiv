import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /app routes
  if (!pathname.startsWith("/app")) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sk_access_token")?.value;

  if (!token || !JWT_SECRET) {
    const accountsUrl = process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const redirectUrl = `${accountsUrl}/login?redirect=${encodeURIComponent(`${appUrl}/app`)}`;
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Attach user info to headers for downstream use
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload.userId as string);
    requestHeaders.set("x-user-email", payload.email as string);
    requestHeaders.set("x-user-name", payload.name as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    // Token invalid or expired — redirect to login
    const accountsUrl = process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const redirectUrl = `${accountsUrl}/login?redirect=${encodeURIComponent(`${appUrl}/app`)}`;
    return NextResponse.redirect(redirectUrl);
  }
}

export const config = {
  matcher: ["/app/:path*"],
};
