import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, Mail, ArrowLeft, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const RATE_KEY = "adminLoginAttempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptState {
  count: number;
  lockedUntil: number; // epoch ms; 0 if not locked
}

const readAttempts = (): AttemptState => {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (!raw) return { count: 0, lockedUntil: 0 };
    const parsed = JSON.parse(raw) as AttemptState;
    if (parsed.lockedUntil && Date.now() > parsed.lockedUntil) {
      return { count: 0, lockedUntil: 0 };
    }
    return parsed;
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
};

const writeAttempts = (s: AttemptState) => {
  localStorage.setItem(RATE_KEY, JSON.stringify(s));
};

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [attempts, setAttempts] = useState<AttemptState>(() => readAttempts());
  const [now, setNow] = useState<number>(Date.now());
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAdminAuth();

  // Set noindex meta tag for this page
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  // Tick every second while locked to show countdown / re-enable button
  useEffect(() => {
    if (!attempts.lockedUntil) return;
    const id = setInterval(() => {
      setNow(Date.now());
      if (Date.now() > attempts.lockedUntil) {
        const cleared = { count: 0, lockedUntil: 0 };
        writeAttempts(cleared);
        setAttempts(cleared);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [attempts.lockedUntil]);

  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const isLocked = attempts.lockedUntil > now;
  const remainingMs = isLocked ? attempts.lockedUntil - now : 0;
  const remainingMin = Math.ceil(remainingMs / 60000);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setBusy(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      // Verify admin role
      const { data: userData } = await supabase.auth.getUser();
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user!.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleRow) {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin privileges.");
      }

      // Success — clear attempts
      writeAttempts({ count: 0, lockedUntil: 0 });
      setAttempts({ count: 0, lockedUntil: 0 });

      // Record last activity for 8h idle timeout
      localStorage.setItem("adminLastActivity", String(Date.now()));

      toast({ title: "Welcome back, admin!" });
      navigate("/admin", { replace: true });
    } catch (err: any) {
      const next: AttemptState = {
        count: attempts.count + 1,
        lockedUntil: 0,
      };
      if (next.count >= MAX_ATTEMPTS) {
        next.lockedUntil = Date.now() + LOCKOUT_MS;
      }
      writeAttempts(next);
      setAttempts(next);
      setNow(Date.now());

      toast({
        variant: "destructive",
        title: "Sign in failed",
        description:
          next.lockedUntil > 0
            ? "Too many attempts. Please try again later."
            : err?.message ?? "Invalid email or password.",
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
              Marwad Maratha Admin
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Authorized personnel only
            </p>
          </div>

          {isLocked && (
            <div className="mb-5 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-2 text-sm text-destructive">
              <ShieldAlert size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                Too many attempts. Please try again in{" "}
                <strong>{remainingMin}</strong> minute
                {remainingMin === 1 ? "" : "s"}.
              </div>
            </div>
          )}

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
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  required
                  autoComplete="email"
                  disabled={isLocked || busy}
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
                  className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  disabled={isLocked || busy}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg py-2.5 font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!isLocked && !busy ? { scale: 1.01 } : {}}
              whileTap={!isLocked && !busy ? { scale: 0.99 } : {}}
              disabled={busy || isLocked}
            >
              {busy ? <Loader2 className="animate-spin" size={20} /> : "Login"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
