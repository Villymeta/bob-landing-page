"use client";
import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        className="border rounded px-4 py-2 w-full"
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        type="email"
        className="border rounded px-4 py-2 w-full"
        required
      />
      <textarea
        name="message"
        placeholder="Your message"
        value={form.message}
        onChange={handleChange}
        className="border rounded px-4 py-2 w-full"
        rows={4}
        required
      />
      <button
        type="submit"
        className="bg-black text-white px-6 py-2 rounded hover:bg-yellow-500"
      >
        Send
      </button>
      {sent && <p className="text-green-600 mt-2">Message sent!</p>}
    </form>
  );
}