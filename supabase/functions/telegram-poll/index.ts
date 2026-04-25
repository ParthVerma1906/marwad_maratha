// Long-polls Telegram getUpdates and processes inline-button callback queries.
// On "paid:<order_number>" → marks order paid. On "reject:<order_number>" → marks payment failed.
// Triggered by pg_cron every minute.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const MAX_RUNTIME_MS = 55_000;
const MIN_REMAINING_MS = 5_000;

// Authorized chat IDs that can trigger payment confirmations
const AUTHORIZED_CHAT_IDS = new Set(["8652382916", "6371890047"]);

Deno.serve(async () => {
  const startTime = Date.now();

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "missing env" }), { status: 500 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  let totalProcessed = 0;

  const { data: state, error: stateErr } = await supabase
    .from("telegram_bot_state")
    .select("update_offset")
    .eq("id", 1)
    .single();

  if (stateErr) {
    return new Response(JSON.stringify({ error: stateErr.message }), { status: 500 });
  }
  let currentOffset: number = state.update_offset;

  async function answerCallback(callback_id: string, text: string) {
    try {
      await fetch(`${GATEWAY_URL}/answerCallbackQuery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ callback_query_id: callback_id, text, show_alert: false }),
      });
    } catch (e) {
      console.error("answerCallback failed", e);
    }
  }

  async function editMessage(chat_id: number | string, message_id: number, text: string) {
    try {
      await fetch(`${GATEWAY_URL}/editMessageText`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": TELEGRAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id,
          message_id,
          text,
          parse_mode: "HTML",
        }),
      });
    } catch (e) {
      console.error("editMessage failed", e);
    }
  }

  while (true) {
    const remainingMs = MAX_RUNTIME_MS - (Date.now() - startTime);
    if (remainingMs < MIN_REMAINING_MS) break;
    const timeout = Math.min(50, Math.floor(remainingMs / 1000) - 5);
    if (timeout < 1) break;

    const res = await fetch(`${GATEWAY_URL}/getUpdates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offset: currentOffset,
        timeout,
        allowed_updates: ["callback_query"],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("getUpdates failed", res.status, data);
      return new Response(JSON.stringify({ error: data }), { status: 502 });
    }

    const updates = data.result ?? [];
    if (updates.length === 0) continue;

    for (const update of updates) {
      const cb = update.callback_query;
      if (!cb) continue;

      const callback_id = String(cb.id);
      const from_chat = String(cb.from?.id ?? "");
      const message = cb.message;
      const dataStr = String(cb.data ?? "");

      // Authorization: ignore any clicks from unknown users
      if (!AUTHORIZED_CHAT_IDS.has(from_chat)) {
        await answerCallback(callback_id, "Not authorized");
        continue;
      }

      // Idempotency: skip if already processed
      const { data: existing } = await supabase
        .from("telegram_processed_callbacks")
        .select("callback_id")
        .eq("callback_id", callback_id)
        .maybeSingle();

      if (existing) {
        await answerCallback(callback_id, "Already processed");
        continue;
      }

      const [action, order_number] = dataStr.split(":");
      if (!order_number || (action !== "paid" && action !== "reject")) {
        await answerCallback(callback_id, "Invalid action");
        continue;
      }

      const newPaymentStatus = action === "paid" ? "paid" : "failed";
      const newOrderStatus = action === "paid" ? "confirmed" : "cancelled";

      const { data: updated, error: updErr } = await supabase
        .from("orders")
        .update({
          payment_status: newPaymentStatus,
          order_status: newOrderStatus,
        })
        .eq("order_number", order_number)
        .select("order_number, customer_name, total_amount")
        .maybeSingle();

      if (updErr || !updated) {
        console.error("Order update failed", order_number, updErr);
        await answerCallback(callback_id, "Order not found");
        continue;
      }

      // Mark callback as processed
      await supabase
        .from("telegram_processed_callbacks")
        .insert({ callback_id, order_number, action });

      // Update the original Telegram message
      if (message?.message_id && message?.chat?.id) {
        const statusEmoji = action === "paid" ? "✅" : "❌";
        const statusLabel = action === "paid" ? "PAYMENT CONFIRMED" : "PAYMENT REJECTED";
        const newText =
          `${statusEmoji} <b>${statusLabel}</b>\n\n` +
          `Order <b>${order_number}</b>\n` +
          `${updated.customer_name} — ₹${updated.total_amount}`;
        await editMessage(message.chat.id, message.message_id, newText);
      }

      await answerCallback(callback_id, action === "paid" ? "Marked paid ✅" : "Rejected ❌");
      totalProcessed++;
    }

    const newOffset = Math.max(...updates.map((u: any) => u.update_id)) + 1;
    const { error: offsetErr } = await supabase
      .from("telegram_bot_state")
      .update({ update_offset: newOffset, updated_at: new Date().toISOString() })
      .eq("id", 1);

    if (offsetErr) {
      console.error("offset update failed", offsetErr);
      return new Response(JSON.stringify({ error: offsetErr.message }), { status: 500 });
    }
    currentOffset = newOffset;
  }

  return new Response(
    JSON.stringify({ ok: true, processed: totalProcessed, finalOffset: currentOffset }),
    { headers: { "Content-Type": "application/json" } },
  );
});
