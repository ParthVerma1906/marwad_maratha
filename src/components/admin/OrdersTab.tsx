import { useEffect, useState } from "react";
import { Loader2, Eye, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp: string | null;
  address: string;
  city: string | null;
  pincode: string | null;
  items: any;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes: string | null;
  created_at: string;
}

const ORDER_STATUSES = ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid"];

const statusBadge: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const OrdersTab = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<OrderRow | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Failed to load orders", description: error.message });
    } else {
      setOrders((data ?? []) as OrderRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateField = async (id: string, field: "order_status" | "payment_status", value: string) => {
    const { error } = await supabase.from("orders").update({ [field]: value }).eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      setOrders((os) => os.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
      if (selected?.id === id) setSelected({ ...selected, [field]: value } as OrderRow);
      toast({ title: "Order updated" });
    }
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.order_status === filter);
  const newCount = orders.filter((o) => o.order_status === "new").length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-xl font-heritage font-bold">
          Orders ({orders.length})
          {newCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-600 text-white text-xs">
              {newCount} new
            </span>
          )}
        </h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg text-sm bg-white min-h-[40px]"
        >
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-maroon" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No orders here yet.</div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id} className="border-b border-muted hover:bg-muted/30">
                    <td className="p-3 font-mono text-xs">{o.order_number}</td>
                    <td className="p-3 font-medium">{o.customer_name}</td>
                    <td className="p-3">{o.phone}</td>
                    <td className="p-3">₹{o.total_amount}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">{o.payment_method}</span>
                        <select
                          value={o.payment_status}
                          onChange={(e) => updateField(o.id, "payment_status", e.target.value)}
                          className="px-2 py-1 border border-input rounded text-xs bg-white"
                        >
                          {PAYMENT_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="p-3">
                      <select
                        value={o.order_status}
                        onChange={(e) => updateField(o.id, "order_status", e.target.value)}
                        className={`px-2 py-1 rounded text-xs border-0 ${statusBadge[o.order_status] ?? "bg-gray-100"}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {new Date(o.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => setSelected(o)}
                        className="p-2 hover:bg-muted rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map((o) => (
              <div key={o.id} className="bg-white border border-muted rounded-lg p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{o.order_number}</p>
                    <p className="font-medium text-sm">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] capitalize ${statusBadge[o.order_status] ?? "bg-gray-100"}`}>
                    {o.order_status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold">₹{o.total_amount}</span>
                  <span className="text-xs text-muted-foreground">
                    {o.payment_method} · {o.payment_status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={o.order_status}
                    onChange={(e) => updateField(o.id, "order_status", e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-white min-h-[36px]"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <select
                    value={o.payment_status}
                    onChange={(e) => updateField(o.id, "payment_status", e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-white min-h-[36px]"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelected(o)}
                    className="px-3 py-1.5 border border-input rounded text-xs min-h-[36px]"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Detail dialog */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{selected.order_number}</p>
                  <h3 className="text-lg font-heritage font-bold">{selected.customer_name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-muted rounded">
                  <X size={18} />
                </button>
              </div>

              <div className="text-sm space-y-2 mb-4">
                <p>
                  <span className="text-muted-foreground">Phone:</span> {selected.phone}
                </p>
                {selected.whatsapp && (
                  <p>
                    <span className="text-muted-foreground">WhatsApp:</span> {selected.whatsapp}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Address:</span> {selected.address}
                  {selected.city && `, ${selected.city}`}
                  {selected.pincode && ` - ${selected.pincode}`}
                </p>
                {selected.notes && (
                  <p>
                    <span className="text-muted-foreground">Notes:</span> {selected.notes}
                  </p>
                )}
              </div>

              <div className="border-t border-muted pt-3 mb-3">
                <p className="text-sm font-medium mb-2">Items</p>
                <div className="space-y-1">
                  {Array.isArray(selected.items) &&
                    selected.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>
                          {it.name} {it.weight && `(${it.weight})`} × {it.quantity}
                        </span>
                        <span className="font-medium">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="border-t border-muted pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>₹{selected.total_amount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
