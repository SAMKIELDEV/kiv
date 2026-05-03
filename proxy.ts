import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function proxy(request: NextRequest) {
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
      console.error("[PROXY] JWT verification failed:", error);
      isValid = false;
    }
  }

  if (isAuthRoute) {
    if (isValid) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      return NextResponse.redirect(`${appUrl}/app`);
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!isValid) {
      console.log("[PROXY] Missing or invalid token for protected route");
      const accountsUrl = process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const redirectUrl = `${accountsUrl}/login?redirect=${encodeURIComponent(`${appUrl}/app`)}`;
      return NextResponse.redirect(redirectUrl);
    }

    console.log("[PROXY] JWT verification succeeded for user:", payload?.userId);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", payload?.userId as string);
    requestHeaders.set("x-user-email", payload?.email as string);
    requestHeaders.set("x-user-name", payload?.name as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/app/:path*"],
};

export default proxy;

