import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminLogin = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;

        // Try to bootstrap as first admin
        const { data: bootstrap, error: bootErr } = await supabase.functions.invoke(
          "bootstrap-admin",
          {},
        );
        if (bootErr || (bootstrap as any)?.error) {
          toast({
            title: "Account created",
            description:
              "An admin already exists. Ask them to grant you the admin role.",
          });
        } else {
          toast({
            title: "Welcome, admin!",
            description: "You are now the first administrator.",
          });
          navigate("/admin", { replace: true });
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;

        // Verify role
        const { data: userData } = await supabase.auth.getUser();
        const { data: roleRow } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userData.user!.id)
          .eq("role", "admin")
          .maybeSingle();

        if (!roleRow) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "This account does not have admin privileges.",
          });
          return;
        }

        toast({ title: "Welcome back, admin!" });
        navigate("/admin", { replace: true });
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: mode === "signup" ? "Sign up failed" : "Sign in failed",
        description: err?.message ?? "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}
    >
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Lock className="text-accent" size={28} />
            </div>
            <h1 className="text-2xl font-heritage font-bold text-card-foreground">
              {mode === "signup" ? "Create Admin Account" : "Admin Login"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {mode === "signup"
                ? "First-time setup for the store owner"
                : "Sign in to manage your store"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                  autoComplete="email"
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
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </div>
              {mode === "signup" && (
                <p className="text-xs text-muted-foreground mt-1.5">
                  Minimum 8 characters. Avoid common/leaked passwords.
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={busy}
            >
              {busy ? (
                <Loader2 className="animate-spin" size={20} />
              ) : mode === "signup" ? (
                "Create account"
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          <div className="text-center mt-6 text-sm text-muted-foreground">
            {mode === "signin" ? (
              <>
                First-time setup?{" "}
                <button
                  type="button"
                  className="text-accent hover:underline font-medium"
                  onClick={() => setMode("signup")}
                >
                  Create the admin account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-accent hover:underline font-medium"
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
