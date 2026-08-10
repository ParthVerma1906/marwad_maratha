import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import listOrders from "./tools/list-orders";
import getOrder from "./tools/get-order";
import updateOrderStatus from "./tools/update-order-status";
import getBusinessSettings from "./tools/get-business-settings";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "marwad-maratha",
  title: "Marwad Maratha",
  version: "0.1.0",
  instructions:
    "Tools for the Marwad Maratha homemade pickle & papad store. Use `list_products` to browse the catalogue, `list_orders` and `get_order` to review customer orders, `update_order_status` to move an order along or confirm payment, and `get_business_settings` for contact and shipping configuration. Order tools require an admin account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, listOrders, getOrder, updateOrderStatus, getBusinessSettings],
});
