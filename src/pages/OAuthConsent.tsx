import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type OAuthNamespace = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};

const oauth = () => (supabase.auth as unknown as { oauth: OAuthNamespace }).oauth;

const OAuthConsent = () => {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/admin/login?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) {
        setError(error.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  const decide = async (approve: boolean) => {
    setBusy(true);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  };

  const clientName = details?.client?.name ?? "an app";

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #3b1f12, #1f0f08)" }}
    >
      <div className="w-full max-w-md bg-card rounded-2xl p-8 shadow-2xl border border-border/50">
        {error ? (
          <>
            <h1 className="text-xl font-heritage font-bold text-card-foreground mb-2">
              Could not load this request
            </h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-accent" size={28} />
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-accent" size={26} />
            </div>
            <h1 className="text-xl font-heritage font-bold text-card-foreground text-center">
              Connect {clientName} to Marwad Maratha
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-2 mb-6">
              This lets {clientName} read products, orders and settings, and update order status as you.
            </p>
            <div className="flex gap-3">
              <button
                disabled={busy}
                onClick={() => decide(false)}
                className="flex-1 min-h-[44px] rounded-lg border border-input text-card-foreground disabled:opacity-50"
              >
                Deny
              </button>
              <button
                disabled={busy}
                onClick={() => decide(true)}
                className="flex-1 min-h-[44px] rounded-lg bg-accent text-accent-foreground font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {busy && <Loader2 className="animate-spin" size={16} />}
                Approve
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default OAuthConsent;
