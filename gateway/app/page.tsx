"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const users: Record<string, { password: string; redirect: string }> = {
  "admin@hansonium.com": {
    password: "admin123",
    redirect: "https://admin-web-ashy.vercel.app",
  },
  "employee@hansonium.com": {
    password: "employee123",
    redirect: "https://employee-ops-n96v.vercel.app",
  },
  "family@hansonium.com": {
    password: "family123",
    redirect: "https://family-portal-sigma.vercel.app",
  },
};

  const handleLogin = () => {
    const user = users[email];

    if (user && user.password === password) {
      window.location.href = user.redirect;
    } else {
      setError("Invalid email or password");
    }
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
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl transition-all duration-200 active:scale-95"
        >
          Login
        </button>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p className="font-semibold">Demo Credentials:</p>
          <p>admin@hansonium.com / admin123</p>
          <p>employee@hansonium.com / employee123</p>
          <p>family@hansonium.com / family123</p>
        </div>
      </div>
    </div>
  );
}