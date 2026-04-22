import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SettingsRow {
  id: string;
  business_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string | null;
  upi_id: string | null;
  shipping_charge: number;
  free_shipping_above: number;
  is_accepting_orders: boolean;
}

const SettingsTab = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("settings").select("*").limit(1).maybeSingle();
      if (error) {
        toast({ variant: "destructive", title: "Failed to load settings", description: error.message });
      } else {
        setSettings(data as SettingsRow);
      }
      setLoading(false);
    })();
  }, [toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({
        business_name: settings.business_name,
        phone: settings.phone,
        whatsapp: settings.whatsapp,
        email: settings.email,
        address: settings.address,
        upi_id: settings.upi_id,
        shipping_charge: settings.shipping_charge,
        free_shipping_above: settings.free_shipping_above,
        is_accepting_orders: settings.is_accepting_orders,
      })
      .eq("id", settings.id);
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
    } else {
      toast({ title: "Settings saved" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="animate-spin text-maroon" size={28} />
      </div>
    );
  }
  if (!settings) {
    return <div className="text-center py-10 text-muted-foreground">No settings row found.</div>;
  }

  const set = <K extends keyof SettingsRow>(key: K, value: SettingsRow[K]) =>
    setSettings({ ...settings, [key]: value });

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-xl font-heritage font-bold mb-1">Business Settings</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These values are used across the storefront and checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Business name">
          <input
            value={settings.business_name}
            onChange={(e) => set("business_name", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={settings.email}
            onChange={(e) => set("email", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <Field label="Phone">
          <input
            value={settings.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <Field label="WhatsApp">
          <input
            value={settings.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Address">
            <textarea
              value={settings.address ?? ""}
              onChange={(e) => set("address", e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm"
              rows={2}
            />
          </Field>
        </div>
        <Field label="UPI ID (for payments)">
          <input
            placeholder="yourname@upi"
            value={settings.upi_id ?? ""}
            onChange={(e) => set("upi_id", e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <Field label="Shipping charge (₹)">
          <input
            type="number"
            min="0"
            value={settings.shipping_charge}
            onChange={(e) => set("shipping_charge", Number(e.target.value))}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>
        <Field label="Free shipping above (₹)">
          <input
            type="number"
            min="0"
            value={settings.free_shipping_above}
            onChange={(e) => set("free_shipping_above", Number(e.target.value))}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm"
          />
        </Field>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 p-3 border border-input rounded-lg cursor-pointer hover:bg-muted/30">
            <input
              type="checkbox"
              checked={settings.is_accepting_orders}
              onChange={(e) => set("is_accepting_orders", e.target.checked)}
              className="w-5 h-5"
            />
            <div>
              <p className="text-sm font-medium">Accepting new orders</p>
              <p className="text-xs text-muted-foreground">
                Turn off to temporarily pause checkout (e.g. during holidays).
              </p>
            </div>
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2.5 bg-maroon text-white rounded-lg text-sm flex items-center gap-2 min-h-[44px]"
      >
        {saving && <Loader2 className="animate-spin" size={14} />}
        Save changes
      </button>
    </form>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-medium mb-1">{label}</label>
    {children}
  </div>
);

export default SettingsTab;
