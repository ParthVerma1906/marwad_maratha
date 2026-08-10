import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_products",
  title: "List products",
  description:
    "List Marwad Maratha products (pickles, papads, masalas) with optional category or name search.",
  inputSchema: {
    search: z.string().trim().optional().describe("Filter by product name (partial match)."),
    category: z.string().trim().optional().describe("Filter by category, e.g. 'pickles' or 'papad'."),
    only_available: z.boolean().optional().describe("Only return products currently in stock."),
    limit: z.number().int().min(1).max(100).optional().describe("Max rows to return (default 25)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ search, category, only_available, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let query = supabaseForUser(ctx)
      .from("products")
      .select("id,name,category,price,weight,description,is_available,is_popular")
      .order("name")
      .limit(limit ?? 25);

    if (search) query = query.ilike("name", `%${search}%`);
    if (category) query = query.eq("category", category);
    if (only_available) query = query.eq("is_available", true);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { products: data ?? [] },
    };
  },
});
