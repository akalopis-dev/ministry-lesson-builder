import { NextRequest, NextResponse } from "next/server";
import { computeSessionToken, SESSION_COOKIE } from "@/lib/session-token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  const workspaceCode = process.env.WORKSPACE_CODE;
  const sessionSecret = process.env.SESSION_SECRET;

  if (!workspaceCode || !sessionSecret) {
    return isApi
      ? NextResponse.json({ error: "Server is not configured" }, { status: 500 })
      : NextResponse.next();
  }

  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value;
  const expectedToken = await computeSessionToken(workspaceCode, sessionSecret);

  if (cookieValue === expectedToken) {
    return NextResponse.next();
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = request.nextUrl.clone();
  url.pathname = "/enter-code";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!enter-code|api/verify-code|_next/static|_next/image|favicon.ico).*)"],
};
