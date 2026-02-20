import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/integrations/supabase/client";
import AdminPanel from "@/components/admin/AdminPanel";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, isValidating, login, logout } = useAdminSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      toast({ variant: "destructive", title: "Please fill in all fields" });
      return;
    }
    if (trimmedUser.length > 100 || password.length > 200) {
      toast({ variant: "destructive", title: "Invalid input length" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { username: trimmedUser, password },
      });

      if (error) throw error;

      if (data?.success && data?.token) {
        login(data.token, data.expiresAt || Date.now() + 24 * 60 * 60 * 1000);
        toast({ title: "Login successful", description: "Welcome back, admin!" });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: data?.error || "Invalid username or password.",
        });
      }
    } catch (err: any) {
      const message = err?.message?.includes("429")
        ? "Too many attempts. Please wait 15 minutes."
        : "Could not connect to server. Please try again.";
      toast({ variant: "destructive", title: "Login failed", description: message });
    }
    setIsLoading(false);
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}>
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AdminPanel onClose={logout} />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-saffron/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Back to site</span>
        </button>

        <motion.div
          className="bg-card rounded-2xl p-8 shadow-2xl border border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={28} />
            </div>
            <h1 className="text-2xl font-heritage font-bold text-card-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Secure access to manage your store
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Username
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  maxLength={100}
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  maxLength={200}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
