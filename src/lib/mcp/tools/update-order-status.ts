import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_order_status",
  title: "Update order status",
  description:
    "Update the fulfilment status (and optionally the payment status) of an order. Admin only.",
  inputSchema: {
    order_number: z.string().trim().min(3).describe("The order number, e.g. MM-2025-0042."),
    order_status: z
      .enum(["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"])
      .optional()
      .describe("New fulfilment status."),
    payment_status: z
      .enum(["pending", "awaiting_verification", "paid", "failed", "refunded"])
      .optional()
      .describe("New payment status."),
  },
  annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_number, order_status, payment_status }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!order_status && !payment_status) {
      return {
        content: [{ type: "text", text: "Provide order_status and/or payment_status." }],
        isError: true,
      };
    }

    const patch: Record<string, string> = {};
    if (order_status) patch.order_status = order_status;
    if (payment_status) {
      patch.payment_status = payment_status;
      if (payment_status === "paid") {
        patch.verified_at = new Date().toISOString();
        patch.verified_by = ctx.getUserEmail() ?? ctx.getUserId() ?? "mcp";
      }
    }

    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .update(patch)
      .eq("order_number", order_number)
      .select("order_number,order_status,payment_status")
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return {
        content: [{ type: "text", text: `No order updated — ${order_number} not found or not permitted.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { order: data },
    };
  },
});
