import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminPanel from "@/components/admin/AdminPanel";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAdminAuth();

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

  return <AdminPanel onSignOut={signOut} userEmail={user.email ?? undefined} />;
};

export default Admin;
