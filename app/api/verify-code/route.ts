import { NextRequest, NextResponse } from "next/server";
import { computeSessionToken, SESSION_COOKIE } from "@/lib/session-token";

const MAX_ATTEMPTS = 10;
const WINDOW_MS = 10 * 60 * 1000;

// In-memory attempt tracker. Resets on cold start / across serverless instances —
// this raises the bar against casual guessing, it is not a hard rate limit guarantee.
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const workspaceCode = process.env.WORKSPACE_CODE;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!workspaceCode || !sessionSecret) {
    return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  if (code !== workspaceCode) {
    return NextResponse.json({ error: "Incorrect code" }, { status: 401 });
  }

  const token = await computeSessionToken(workspaceCode, sessionSecret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
