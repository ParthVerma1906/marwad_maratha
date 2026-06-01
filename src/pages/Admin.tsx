import { useEffect } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminPanel from "@/components/admin/AdminPanel";
import { supabase } from "@/integrations/supabase/client";

const IDLE_TIMEOUT_MS = 8 * 60 * 60 * 1000; // 8 hours

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialTab = location.pathname.startsWith("/admin/orders") ? "orders" : "products";

  // Idle-timeout: sign out after 8h with no activity, redirect to home
  useEffect(() => {
    if (!user || !isAdmin) return;

    const bump = () => {
      localStorage.setItem("adminLastActivity", String(Date.now()));
    };
    bump();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));

    const id = setInterval(async () => {
      const last = Number(localStorage.getItem("adminLastActivity") || 0);
      if (last && Date.now() - last > IDLE_TIMEOUT_MS) {
        await supabase.auth.signOut();
        localStorage.removeItem("adminLastActivity");
        navigate("/", { replace: true });
      }
    }, 60_000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(id);
    };
  }, [user, isAdmin, navigate]);

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem("adminLastActivity");
    // Redirect to homepage so back button can't return to admin
    window.location.replace("/");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}
      >
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminPanel onSignOut={handleSignOut} userEmail={user.email ?? undefined} initialTab={initialTab} />;
};

export default Admin;
