// Send a Telegram notification to the owner with inline confirm/reject buttons.
// Public (no JWT). Re-fetches the order using service role so customers can't fake data.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

// Hardcoded chat IDs per user request
const CHAT_IDS = ["8652382916", "6371890047"];

function escapeHtml(s: string) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { order_number } = await req.json();
    if (!order_number || typeof order_number !== "string") {
      return new Response(JSON.stringify({ error: "order_number required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");

    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY) {
      console.error("Telegram credentials missing");
      return new Response(JSON.stringify({ ok: false, error: "telegram not configured" }), {
        status: 200, // don't break checkout
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: order, error } = await admin
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .maybeSingle();

    if (error || !order) {
      console.error("Order not found", order_number, error);
      return new Response(JSON.stringify({ ok: false, error: "order not found" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const itemLines = items
      .map((i: any) => `• ${escapeHtml(i.name)} × ${i.quantity} — ₹${i.price * i.quantity}`)
      .join("\n");

    const paymentLabel =
      order.payment_method === "COD"
        ? "Cash on Delivery"
        : `UPI (${order.payment_status === "paid" ? "Paid" : "Pending verification"})`;

    const text =
      `🛒 <b>NEW ORDER — ${escapeHtml(order.order_number)}</b>\n\n` +
      `👤 <b>${escapeHtml(order.customer_name)}</b>\n` +
      `📞 ${escapeHtml(order.phone)}${order.whatsapp ? ` (WA: ${escapeHtml(order.whatsapp)})` : ""}\n` +
      `📍 ${escapeHtml(order.address)}${order.city ? `, ${escapeHtml(order.city)}` : ""}${order.pincode ? ` - ${escapeHtml(order.pincode)}` : ""}\n\n` +
      `${itemLines}\n\n` +
      `<b>Total: ₹${order.total_amount}</b>\n` +
      `💳 ${paymentLabel}`;

    // Inline keyboard for one-click confirm / reject (only for UPI pending)
    const reply_markup =
      order.payment_method === "UPI" && order.payment_status !== "paid"
        ? {
            inline_keyboard: [
              [
                { text: "✅ Mark Paid", callback_data: `paid:${order.order_number}` },
                { text: "❌ Reject", callback_data: `reject:${order.order_number}` },
              ],
            ],
          }
        : undefined;

    const results: Array<{ chat_id: string; ok: boolean; error?: string }> = [];

    for (const chat_id of CHAT_IDS) {
      try {
        const res = await fetch(`${GATEWAY_URL}/sendMessage`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": TELEGRAM_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id,
            text,
            parse_mode: "HTML",
            reply_markup,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.error(`Telegram send failed for ${chat_id}:`, res.status, data);
          results.push({ chat_id, ok: false, error: `${res.status}: ${JSON.stringify(data)}` });
        } else {
          results.push({ chat_id, ok: true });
        }
      } catch (e) {
        console.error(`Telegram send threw for ${chat_id}:`, e);
        results.push({ chat_id, ok: false, error: String(e) });
      }
    }

    return new Response(JSON.stringify({ ok: true, results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("notify-owner-order error:", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 200, // never break checkout
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
