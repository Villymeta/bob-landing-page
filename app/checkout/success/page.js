"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SuccessPage() {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("bob_last_order");
    if (stored) setOrder(JSON.parse(stored));
  }, []);

  if (!order)
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>No recent order found.</p>
      </section>
    );

  const subtotal = order.subtotal;
  const total = order.total;

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-green-600 text-white rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">✅ Order Confirmed!</h1>
        <p className="mb-6">
          Thank you, <span className="font-semibold">{order.customer.name}</span>!
        </p>

        <div className="bg-white text-black rounded-xl p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4">🧾 Order Summary</h2>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>
                {item.qty}× {item.name} {item.size && `(${item.size})`}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-3 font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="text-sm pt-2 italic">
            {order.deliveryOption === "pickup"
              ? "Pickup at DD Las Vegas"
              : `Shipping to: ${order.address.street}, ${order.address.city}, ${order.address.state}`}
          </p>
        </div>

        <Link
          href="/shop"
          className="bg-bobyellow text-black font-bold px-6 py-3 rounded-xl hover:brightness-110"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}