import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_orders",
  title: "List orders",
  description:
    "List customer orders, newest first. Requires an admin account; other users receive no rows.",
  inputSchema: {
    order_status: z
      .enum(["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"])
      .optional()
      .describe("Filter by fulfilment status."),
    payment_status: z.string().trim().optional().describe("Filter by payment status, e.g. 'paid' or 'pending'."),
    search: z.string().trim().optional().describe("Match order number, customer name, or phone."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_status, payment_status, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("orders")
      .select(
        "id,order_number,customer_name,phone,city,total_amount,payment_method,payment_status,order_status,created_at"
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);

    if (order_status) query = query.eq("order_status", order_status);
    if (payment_status) query = query.eq("payment_status", payment_status);
    if (search) {
      query = query.or(
        `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,phone.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { orders: data ?? [] },
    };
  },
});
