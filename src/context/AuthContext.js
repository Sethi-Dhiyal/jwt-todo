"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    async function init() {
      const loggedOut = localStorage.getItem("loggedOut");
      if (loggedOut) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/me`, { credentials: "include" });
        const data = await res.json();
        if (res.ok && data.user) setUser(data.user);
        else setUser(null);
      } catch (e) {
        console.log("auth init error", e);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [API_BASE]);

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    setUser(data.user);
    localStorage.removeItem("loggedOut");
  }

  async function signup(email, password) {
    const res = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    setUser(data.user);
    localStorage.removeItem("loggedOut");
  }

  async function logout() {
    await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    localStorage.setItem("loggedOut", "true");
    router.push("/auth");
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
