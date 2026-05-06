import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function proxy(request: NextRequest) {
  // Fail loudly if JWT_SECRET is missing in production
  if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    console.error("[CRITICAL] JWT_SECRET is not defined");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname === "/" || pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/app");

  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("sk_access_token")?.value;
  let isValid = false;
  let payload: any = null;

  if (token && JWT_SECRET) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const verified = await jwtVerify(token, secret);
      payload = verified.payload;
      isValid = true;
    } catch (error) {
      // Don't log full error in prod to avoid noise, but keep for debugging
      if (process.env.NODE_ENV !== "production") {
        console.error("[PROXY] JWT verification failed:", error);
      }
      isValid = false;
    }
  }

  if (isAuthRoute) {
    if (isValid) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(new URL("/app", appUrl));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!isValid) {
      const accountsUrl = process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const redirectUrl = `${accountsUrl}/login?redirect=${encodeURIComponent(`${appUrl}/app`)}`;
      return NextResponse.redirect(redirectUrl);
    }

    const requestHeaders = new Headers(request.headers);
    if (payload?.userId) requestHeaders.set("x-user-id", payload.userId as string);
    if (payload?.email) requestHeaders.set("x-user-email", payload.email as string);
    if (payload?.name) requestHeaders.set("x-user-name", payload.name as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|docs).*)',
  ],
};

export default proxy;

