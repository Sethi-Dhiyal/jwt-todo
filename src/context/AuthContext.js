"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ loading state
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut) {
        setLoading(false); // user explicitly logged out
        return;
      }

      try {
        const res = await fetch("/api/me", { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.user) {
          setUser(data.user); // ✅ user valid
        } else {
          setUser(null);
        }
      } catch (e) {
        console.log("auth init error", e);
        setUser(null);
      } finally {
        setLoading(false); // ✅ auth check complete
      }
    }
    init();
  }, []);

  async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Server returned invalid response");
  }

  if (!res.ok) throw new Error(data.error || "Login failed");
  setUser(data.user);
  localStorage.removeItem("loggedOut");
}
  async function logout() {
    await fetch("/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
    localStorage.setItem("loggedOut", "true");
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
