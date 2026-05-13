import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, type JWTPayload } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const AUTH_URL =
  process.env.AUTH_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "https://id.samkiel.tech";
const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL ||
  "https://account.samkiel.tech";

const ACCESS_COOKIE = "sk_access_token";
const REFRESH_COOKIE = "sk_refresh_token";

// Cookie attributes mirror the SAMKIEL ID server in production
// (Secure, SameSite=None, Domain=.samkiel.tech) so the cookies we write here
// are interchangeable with the ones the auth server sets on login. In dev
// (http://localhost) Secure+SameSite=None is rejected by browsers and a
// cross-subdomain Domain is meaningless, so flip to host-only Lax cookies.
//
// Auto-detect from NODE_ENV. Override with SK_DEV_COOKIES=1 / =0 if you need
// to force one mode regardless of NODE_ENV (e.g. testing prod build locally).
const DEV_COOKIES = (() => {
  const flag = process.env.SK_DEV_COOKIES;
  if (flag === "1" || flag === "true") return true;
  if (flag === "0" || flag === "false") return false;
  return process.env.NODE_ENV !== "production";
})();

// Empty string is meaningful: "" → no Domain attribute (host-only cookie).
const COOKIE_DOMAIN =
  process.env.SK_COOKIE_DOMAIN ?? (DEV_COOKIES ? "" : ".samkiel.tech");

type RefreshResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

async function verifyAccess(token: string | undefined): Promise<JWTPayload | null> {
  if (!token || !JWT_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

async function refreshTokens(refreshToken: string): Promise<RefreshResult | null> {
  try {
    const res = await fetch(`${AUTH_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<RefreshResult>;
    if (!data.accessToken || !data.refreshToken || !data.expiresIn) return null;
    return data as RefreshResult;
  } catch {
    return null;
  }
}

function applyRefreshedCookies(response: NextResponse, tokens: RefreshResult) {
  const base: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "none" | "lax";
    path: string;
    domain?: string;
  } = {
    httpOnly: true,
    secure: !DEV_COOKIES,
    sameSite: DEV_COOKIES ? "lax" : "none",
    path: "/",
  };
  if (COOKIE_DOMAIN) base.domain = COOKIE_DOMAIN;

  response.cookies.set({
    ...base,
    name: ACCESS_COOKIE,
    value: tokens.accessToken,
    maxAge: tokens.expiresIn,
  });
  response.cookies.set({
    ...base,
    name: REFRESH_COOKIE,
    value: tokens.refreshToken,
    // The refresh cookie's lifetime is owned by the auth server; mirror its
    // 30-day window so the browser keeps it alive between visits.
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function middleware(request: NextRequest) {
  if (!JWT_SECRET && process.env.NODE_ENV === "production") {
    console.error("[MIDDLEWARE] JWT_SECRET is not defined");
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname === "/" || pathname === "/login";
  const isProtectedRoute = pathname.startsWith("/app");

  if (!isAuthRoute && !isProtectedRoute) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  let payload = await verifyAccess(accessToken);
  let refreshed: RefreshResult | null = null;

  // Access token missing or expired — try the refresh cookie before giving up.
  // We attempt this on both auth and protected routes: an authenticated user
  // landing on /login should be bounced to /app even if their access cookie
  // already aged out.
  if (!payload) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
    if (refreshToken) {
      refreshed = await refreshTokens(refreshToken);
      if (refreshed) {
        payload = await verifyAccess(refreshed.accessToken);
        // Rewrite the request's cookie jar so downstream Server Components
        // (e.g. getServerUser in app/app/layout.tsx) read the fresh token.
        if (payload) {
          request.cookies.set(ACCESS_COOKIE, refreshed.accessToken);
          request.cookies.set(REFRESH_COOKIE, refreshed.refreshToken);
        }
      }
    }
  }

  if (isAuthRoute) {
    if (payload) {
      const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
      const redirect = NextResponse.redirect(new URL("/app", appOrigin));
      if (refreshed) applyRefreshedCookies(redirect, refreshed);
      return redirect;
    }
    return NextResponse.next();
  }

  // isProtectedRoute
  if (!payload) {
    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    const loginUrl = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(`${appOrigin}/app`)}`;
    return NextResponse.redirect(loginUrl);
  }

  const requestHeaders = new Headers(request.headers);
  if (payload.userId) requestHeaders.set("x-user-id", String(payload.userId));
  if (payload.email) requestHeaders.set("x-user-email", String(payload.email));
  if (payload.name) requestHeaders.set("x-user-name", String(payload.name));

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  if (refreshed) applyRefreshedCookies(response, refreshed);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|assets|docs).*)",
  ],
};
