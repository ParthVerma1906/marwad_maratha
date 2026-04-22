import { useEffect, useRef, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, Image as ImageIcon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DBProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  weight: string | null;
  is_available: boolean;
  is_popular: boolean;
  alt_text: string | null;
  ingredients: string[] | null;
}

const CATEGORY_OPTIONS = ["aachar", "papad", "chatani", "namkeen", "special", "powder"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "aachar",
  weight: "",
  is_available: true,
  is_popular: false,
  image_url: "",
  alt_text: "",
};

const ProductsTab = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DBProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ variant: "destructive", title: "Failed to load products", description: error.message });
    } else {
      setProducts((data ?? []) as DBProduct[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  const openEdit = (p: DBProduct) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: String(p.price),
      category: p.category,
      weight: p.weight ?? "",
      is_available: p.is_available,
      is_popular: p.is_popular,
      image_url: p.image_url ?? "",
      alt_text: p.alt_text ?? "",
    });
    setShowForm(true);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("products")
      .upload(path, file, { contentType: file.type, upsert: false });
    if (upErr) {
      toast({ variant: "destructive", title: "Upload failed", description: upErr.message });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("products").getPublicUrl(path);
    setForm((f) => ({ ...f, image_url: data.publicUrl }));
    setUploading(false);
    toast({ title: "Image uploaded" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) {
      toast({ variant: "destructive", title: "Name and price are required" });
      return;
    }
    const priceNum = Number(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast({ variant: "destructive", title: "Invalid price" });
      return;
    }

    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: priceNum,
      category: form.category,
      weight: form.weight.trim() || null,
      is_available: form.is_available,
      is_popular: form.is_popular,
      image_url: form.image_url || null,
      alt_text: form.alt_text.trim() || null,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) {
        toast({ variant: "destructive", title: "Update failed", description: error.message });
      } else {
        toast({ title: "Product updated" });
        setShowForm(false);
        load();
      }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        toast({ variant: "destructive", title: "Create failed", description: error.message });
      } else {
        toast({ title: "Product created" });
        setShowForm(false);
        load();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (p: DBProduct) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
    } else {
      toast({ title: "Product deleted" });
      setProducts((ps) => ps.filter((x) => x.id !== p.id));
    }
  };

  const toggleField = async (p: DBProduct, field: "is_available" | "is_popular") => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: !p[field] })
      .eq("id", p.id);
    if (error) {
      toast({ variant: "destructive", title: "Update failed", description: error.message });
    } else {
      setProducts((ps) => ps.map((x) => (x.id === p.id ? { ...x, [field]: !p[field] } : x)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-heritage font-bold">Products ({products.length})</h3>
        <button
          onClick={openNew}
          className="px-3 py-2 bg-maroon text-white rounded-lg flex items-center gap-2 text-sm min-h-[44px]"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="animate-spin text-maroon" size={28} />
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-3">Image</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Weight</th>
                  <th className="p-3">Available</th>
                  <th className="p-3">Popular</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-muted hover:bg-muted/30">
                    <td className="p-3">
                      <div className="w-12 h-12 bg-muted/30 rounded overflow-hidden flex items-center justify-center">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={18} className="text-muted-foreground" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3 capitalize">{p.category}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">{p.weight ?? "—"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleField(p, "is_available")}
                        className={`px-2 py-1 rounded text-xs ${
                          p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.is_available ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleField(p, "is_popular")}
                        className={`px-2 py-1 rounded text-xs ${
                          p.is_popular ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {p.is_popular ? "Yes" : "No"}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 hover:bg-muted rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white border border-muted rounded-lg p-3 flex gap-3">
                <div className="w-16 h-16 bg-muted/30 rounded-lg overflow-hidden flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={20} className="text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {p.category} · ₹{p.price} · {p.weight ?? "—"}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => toggleField(p, "is_available")}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        p.is_available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.is_available ? "Live" : "Hidden"}
                    </button>
                    <button
                      onClick={() => toggleField(p, "is_popular")}
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        p.is_popular ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {p.is_popular ? "Popular" : "Regular"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="p-2 hover:bg-muted rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showForm && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <h3 className="text-lg font-heritage font-bold">
                {editing ? "Edit Product" : "Add Product"}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Weight</label>
                  <input
                    placeholder="300g"
                    value={form.weight}
                    onChange={(e) => setForm({ ...form, weight: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-white"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c} className="capitalize">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm"
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Alt text (SEO)</label>
                  <input
                    value={form.alt_text}
                    onChange={(e) => setForm({ ...form, alt_text: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Product image</label>
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      {form.image_url ? (
                        <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon size={20} className="text-muted-foreground" />
                      )}
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleImageUpload(f);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="px-3 py-2 border border-input rounded-lg text-sm flex items-center gap-2 hover:bg-muted min-h-[40px]"
                    >
                      {uploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
                      {uploading ? "Uploading..." : "Upload image"}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2 col-span-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_available}
                    onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                  />
                  Available
                </label>
                <label className="flex items-center gap-2 col-span-1 text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_popular}
                    onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                  />
                  Popular
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-input rounded-lg text-sm min-h-[40px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-maroon text-white rounded-lg text-sm flex items-center gap-2 min-h-[40px]"
                >
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  {editing ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTab;
