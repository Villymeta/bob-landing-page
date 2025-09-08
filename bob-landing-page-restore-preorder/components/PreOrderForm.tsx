"use client";

import { useState } from "react";

export default function PreOrderForm() {
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setStatus("SUCCESS");
      form.reset();
    } else {
      setStatus("ERROR");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">Pre-Order a Beanie</h2>

      <div>
        <label className="block mb-1 text-sm font-medium">Name</label>
        <input
          type="text"
          name="name"
          required
          className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Beanie Color</label>
        <select
          name="color"
          required
          className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">Select a color</option>
          <option value="black">Black</option>
          <option value="yellow">BOB Yellow</option>
          <option value="pink">Bow Mafia Pink</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium">Quantity</label>
        <input
          type="number"
          name="quantity"
          min="1"
          defaultValue="1"
          className="w-full rounded-xl border p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-xl hover:bg-yellow-500 transition"
      >
        Submit Pre-Order
      </button>

      {status === "SUCCESS" && (
        <p className="text-green-600 text-center">Thanks! Your pre-order was submitted.</p>
      )}
      {status === "ERROR" && (
        <p className="text-red-600 text-center">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
