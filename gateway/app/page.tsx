"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const users: Record<string, { password: string; role: string; redirect: string }> = {
    "admin@hansonium.com": {
      password: "admin123",
      role: "admin",
      redirect: "/admin",
    },
    "employee@hansonium.com": {
      password: "employee123",
      role: "employee",
      redirect: "/employee/dashboard",
    },
    "family@hansonium.com": {
      password: "family123",
      role: "family",
      redirect: "/family",
    },
  };

  const handleLogin = () => {
    const user = users[email];
    if (user && user.password === password) {
      setLoading(true);
      localStorage.setItem("hs_role", user.role);
      localStorage.setItem("hs_email", email);
      router.push(user.redirect);
    } else {
      setError("Invalid email or password");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-black to-green-950 px-4">

      <div className="absolute top-6 left-8 text-white text-2xl font-bold tracking-widest">
        HANSONIUM
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 transition-all">

        <h1 className="text-3xl font-bold text-center mb-2">
          Welcome to Hansonium
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Secure access to your portal
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>

        <div className="mt-6 text-sm text-gray-500 text-center space-y-1">
          <p className="font-semibold">Demo Credentials:</p>
          <p>admin@hansonium.com / admin123</p>
          <p>employee@hansonium.com / employee123</p>
          <p>family@hansonium.com / family123</p>
        </div>
      </div>
    </div>
  );
}
