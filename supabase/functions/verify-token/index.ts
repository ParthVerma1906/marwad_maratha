import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// HMAC token verification (same logic as verify-admin)
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

async function verifySignedToken(token: string): Promise<boolean> {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const payload = atob(parts[0]);
    const providedSig = parts[1];

    const match = payload.match(/^admin:(\d+)$/);
    if (!match) return false;
    const expiresAt = parseInt(match[1], 10);
    if (Date.now() > expiresAt) return false;

    const key = await getSigningKey();
    const encoder = new TextEncoder();
    const expectedSig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const expectedHex = arrayBufferToHex(expectedSig);

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
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token : "";

    if (!token) {
      return new Response(
        JSON.stringify({ valid: false, error: "No token provided" }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const valid = await verifySignedToken(token);

    if (valid) {
      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ valid: false, error: "Invalid or expired token" }),
      { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
