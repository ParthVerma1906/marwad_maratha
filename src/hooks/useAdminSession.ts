import { useState, useCallback, useEffect } from "react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredSession());

  useEffect(() => {
    // Check expiry periodically
    const interval = setInterval(() => {
      if (!getStoredSession()) {
        setIsAuthenticated(false);
      }
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((token: string, expiresAt: number) => {
    const session: AdminSession = { token, expiresAt };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    // Also clean up legacy localStorage
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
