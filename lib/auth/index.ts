import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { TokenPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify JWT from cookies and return payload.
 * Returns null if invalid or missing.
 */
export async function verifyToken(request: NextRequest): Promise<TokenPayload | null> {
  const token =
    request.cookies.get("sk_access_token")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token || !JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper for Server Components to get user from cookies.
 */
export async function getServerUser(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("sk_access_token")?.value;

  if (!token || !JWT_SECRET) return null;

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Helper for API route handlers — extracts userId from JWT.
 * Returns a 401 response if not authenticated.
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ userId: string; email: string; name: string } | NextResponse> {
  const payload = await verifyToken(request);

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
  };
}

/**
 * Check if a requireAuth result is an error response.
 */
export function isAuthError(
  result: any
): result is NextResponse {
  return result instanceof NextResponse;
}
