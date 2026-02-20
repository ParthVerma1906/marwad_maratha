import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "adminSession";

interface AdminSession {
  token: string;
  expiresAt: number;
}

function getStoredSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function useAdminSession() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  // Validate token server-side
  const validateToken = useCallback(async (token: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("verify-token", {
        body: { token },
      });
      if (error) return false;
      return data?.valid === true;
    } catch {
      return false;
    }
  }, []);

  // On mount, validate stored session server-side
  useEffect(() => {
    const session = getStoredSession();
    if (!session) {
      setIsAuthenticated(false);
      setIsValidating(false);
      return;
    }

    validateToken(session.token).then((valid) => {
      if (!valid) {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminToken");
      }
      setIsAuthenticated(valid);
      setIsValidating(false);
    });
  }, [validateToken]);

  // Periodic re-validation
  useEffect(() => {
    const interval = setInterval(async () => {
      const session = getStoredSession();
      if (!session) {
        setIsAuthenticated(false);
        return;
      }
      const valid = await validateToken(session.token);
      if (!valid) {
        sessionStorage.removeItem(SESSION_KEY);
        setIsAuthenticated(false);
      }
    }, 5 * 60_000); // every 5 minutes
    return () => clearInterval(interval);
  }, [validateToken]);

  const login = useCallback((token: string, expiresAt: number) => {
    const session: AdminSession = { token, expiresAt };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    // Clean up legacy storage
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, isValidating, login, logout };
}
