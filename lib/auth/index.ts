import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { TokenPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Verify JWT from cookies and return payload.
 * Returns null if invalid or missing.
 */
export function verifyToken(request: NextRequest): TokenPayload | null {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token || !JWT_SECRET) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return payload;
  } catch {
    return null;
  }
}

/**
 * Helper for API route handlers — extracts userId from JWT.
 * Returns a 401 response if not authenticated.
 */
export function requireAuth(
  request: NextRequest
): { userId: string; email: string; name: string } | NextResponse {
  const payload = verifyToken(request);

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
  result: ReturnType<typeof requireAuth>
): result is NextResponse {
  return result instanceof NextResponse;
}
