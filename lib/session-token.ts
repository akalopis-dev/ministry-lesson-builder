const SESSION_COOKIE = "workspace_session";

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** HMAC-SHA256(code, secret) as hex, computed with Web Crypto so it works identically
 * in both the Edge runtime (middleware) and Node (route handlers) — no `Buffer`, which
 * doesn't exist on Edge. */
export async function computeSessionToken(code: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(code));
  return bufferToHex(signature);
}

export { SESSION_COOKIE };
