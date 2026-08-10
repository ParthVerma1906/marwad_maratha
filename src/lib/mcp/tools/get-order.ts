import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_order",
  title: "Get order details",
  description:
    "Fetch one order by its order number (e.g. MM-2025-0042), including items, address and payment details. Admin only.",
  inputSchema: {
    order_number: z.string().trim().min(3).describe("The order number, e.g. MM-2025-0042."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_number }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("orders")
      .select("*")
      .eq("order_number", order_number)
      .maybeSingle();

    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) {
      return {
        content: [{ type: "text", text: `No order found for ${order_number}.` }],
        isError: true,
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { order: data },
    };
  },
});
