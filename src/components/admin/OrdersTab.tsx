import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Eye, X, CheckCircle2, Search, ShoppingBag, Clock, IndianRupee, CalendarDays, Bell, BellOff } from "lucide-react";
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

// DB values kept as-is; UI labels mapped below
const ORDER_STATUSES = ["new", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const STATUS_LABEL: Record<string, string> = {
  new: "Pending",
  confirmed: "Confirmed",
  processing: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
const PAYMENT_STATUSES = ["pending", "paid"];

const statusBadge: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const isToday = (iso: string) => {
  const d = new Date(iso);
  const n = new Date();
  return d.getDate() === n.getDate() && d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
};

const OrdersTab = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "today" | "pending" | "delivered" | string>("all");
  const [search, setSearch] = useState("");
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
    // Realtime: new orders appear immediately
    const channel = supabase
      .channel("orders-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setOrders((os) => [payload.new as OrderRow, ...os]);
        } else if (payload.eventType === "UPDATE") {
          setOrders((os) => os.map((o) => (o.id === (payload.new as any).id ? (payload.new as OrderRow) : o)));
        } else if (payload.eventType === "DELETE") {
          setOrders((os) => os.filter((o) => o.id !== (payload.old as any).id));
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
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

  const stats = useMemo(() => {
    const pending = orders.filter((o) => !["delivered", "cancelled"].includes(o.order_status));
    const revenue = orders
      .filter((o) => o.order_status !== "cancelled")
      .reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const today = orders.filter((o) => isToday(o.created_at));
    return { total: orders.length, pending: pending.length, revenue, today: today.length };
  }, [orders]);

  const filtered = useMemo(() => {
    let list = orders;
    if (filter === "today") list = list.filter((o) => isToday(o.created_at));
    else if (filter === "pending") list = list.filter((o) => !["delivered", "cancelled"].includes(o.order_status));
    else if (filter === "delivered") list = list.filter((o) => o.order_status === "delivered");
    else if (filter !== "all") list = list.filter((o) => o.order_status === filter);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.customer_name.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [orders, filter, search]);

  const newCount = orders.filter((o) => o.order_status === "new").length;

  const StatCard = ({ icon: Icon, label, value, tint }: any) => (
    <div className="bg-white border border-muted rounded-xl p-3 sm:p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tint}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] sm:text-xs text-muted-foreground">{label}</p>
        <p className="text-base sm:text-lg font-bold truncate">{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      {/* Dashboard stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.total} tint="bg-blue-50 text-blue-700" />
        <StatCard icon={Clock} label="Pending Orders" value={stats.pending} tint="bg-amber-50 text-amber-700" />
        <StatCard icon={IndianRupee} label="Revenue" value={`₹${stats.revenue.toLocaleString("en-IN")}`} tint="bg-green-50 text-green-700" />
        <StatCard icon={CalendarDays} label="Orders Today" value={stats.today} tint="bg-purple-50 text-purple-700" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-xl font-heritage font-bold">
          Orders ({filtered.length})
          {newCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-red-600 text-white text-xs">
              {newCount} new
            </span>
          )}
        </h3>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, name, or phone"
            className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-white min-h-[44px]"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg text-sm bg-white min-h-[44px]"
        >
          <option value="all">All orders</option>
          <option value="today">Today's orders</option>
          <option value="pending">Pending orders</option>
          <option value="delivered">Delivered orders</option>
          <optgroup label="By status">
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-maroon" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No orders match your filters.</div>
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
                            {STATUS_LABEL[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(o.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {o.payment_method === "UPI" && o.payment_status === "pending" && (
                          <button
                            onClick={() => updateField(o.id, "payment_status", "paid")}
                            title="Mark Paid"
                            className="p-2 rounded bg-green-50 text-green-700 hover:bg-green-100 min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            <CheckCircle2 size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelected(o)}
                          className="p-2 hover:bg-muted rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="md:hidden space-y-3">
            {filtered.map((o) => (
              <div key={o.id} className="bg-white border border-muted rounded-lg p-3" onClick={() => setSelected(o)}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">{o.order_number}</p>
                    <p className="font-medium text-sm">{o.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{o.phone}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${statusBadge[o.order_status] ?? "bg-gray-100"}`}>
                    {STATUS_LABEL[o.order_status] ?? o.order_status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-bold">₹{o.total_amount}</span>
                  <span className="text-xs text-muted-foreground">
                    {o.payment_method} · {o.payment_status}
                  </span>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <select
                    value={o.order_status}
                    onChange={(e) => updateField(o.id, "order_status", e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-white min-h-[44px]"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <select
                    value={o.payment_status}
                    onChange={(e) => updateField(o.id, "payment_status", e.target.value)}
                    className="flex-1 px-2 py-1.5 border border-input rounded text-xs bg-white min-h-[44px]"
                  >
                    {PAYMENT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(selected.created_at).toLocaleString("en-IN")}
                  </p>
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
                <p>
                  <span className="text-muted-foreground">Payment:</span> {selected.payment_method} ·{" "}
                  <span className="capitalize">{selected.payment_status}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <span className={`px-2 py-0.5 rounded text-xs ${statusBadge[selected.order_status] ?? "bg-gray-100"}`}>
                    {STATUS_LABEL[selected.order_status] ?? selected.order_status}
                  </span>
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

              <div className="border-t border-muted pt-3 flex justify-between font-bold mb-4">
                <span>Total</span>
                <span>₹{selected.total_amount}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={selected.order_status}
                  onChange={(e) => updateField(selected.id, "order_status", e.target.value)}
                  className="px-2 py-2 border border-input rounded text-sm bg-white min-h-[44px]"
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <select
                  value={selected.payment_status}
                  onChange={(e) => updateField(selected.id, "payment_status", e.target.value)}
                  className="px-2 py-2 border border-input rounded text-sm bg-white min-h-[44px]"
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
