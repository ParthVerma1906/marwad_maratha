import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting (per instance)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return false;
  if (Date.now() - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const record = loginAttempts.get(ip);
  if (record && Date.now() - record.lastAttempt < LOCKOUT_MS) {
    record.count++;
    record.lastAttempt = Date.now();
  } else {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  }
}

// Constant-time string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    let result = 1;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ (b.charCodeAt(i % b.length) || 0);
    }
    return false;
  }
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// HMAC-based token signing using Web Crypto API
async function getSigningKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("ADMIN_TOKEN_SECRET") || Deno.env.get("ADMIN_PASSWORD") || "fallback-secret";
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function arrayBufferToHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function createSignedToken(expiresAt: number): Promise<string> {
  const key = await getSigningKey();
  const payload = `admin:${expiresAt}`;
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sig = arrayBufferToHex(signature);
  // Token format: base64(payload):signature
  return btoa(payload) + "." + sig;
}

export async function verifySignedToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const payload = atob(parts[0]);
    const providedSig = parts[1];

    // Check expiry
    const match = payload.match(/^admin:(\d+)$/);
    if (!match) return false;
    const expiresAt = parseInt(match[1], 10);
    if (Date.now() > expiresAt) return false;

    // Verify signature
    const key = await getSigningKey();
    const encoder = new TextEncoder();
    const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedHex = arrayBufferToHex(expectedSig);

    // Constant-time comparison
    if (expectedHex.length !== providedSig.length) return false;
    let diff = 0;
    for (let i = 0; i < expectedHex.length; i++) {
      diff |= expectedHex.charCodeAt(i) ^ providedSig.charCodeAt(i);
    }
    return diff === 0;
  } catch {
    return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many login attempts. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const body = await req.json();
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !password || username.length > 100 || password.length > 200) {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const ADMIN_USERNAME = Deno.env.get("ADMIN_USERNAME");
    const ADMIN_PASSWORD = Deno.env.get("ADMIN_PASSWORD");

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
      console.error("Admin credentials not configured");
      recordAttempt(ip);
      return new Response(
        JSON.stringify({ error: "Invalid credentials" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const usernameMatch = timingSafeEqual(username, ADMIN_USERNAME);
    const passwordMatch = timingSafeEqual(password, ADMIN_PASSWORD);

    if (usernameMatch && passwordMatch) {
      loginAttempts.delete(ip);
      const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
      const token = await createSignedToken(expiresAt);
      return new Response(
        JSON.stringify({ success: true, token, expiresAt }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    recordAttempt(ip);

    return new Response(
      JSON.stringify({ error: "Invalid credentials" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
