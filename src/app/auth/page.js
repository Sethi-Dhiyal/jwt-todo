"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/todos");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 shadow-xl rounded-3xl p-10 w-full max-w-md text-white">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          {isLogin ? "Welcome Back 👋" : "Create Account 🚀"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            required
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-semibold tracking-wide transition-all duration-300"
          >
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Switch */}
        <p
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-sm text-center text-pink-200 hover:text-white cursor-pointer transition"
        >
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </p>
      </div>
    </main>
  );
}
