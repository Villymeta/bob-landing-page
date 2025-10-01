"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="bg-white text-black p-8 rounded-xl w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 font-bold py-2 rounded hover:bg-yellow-500"
        >
          Login
        </button>
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
    </section>
  );
}