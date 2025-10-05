"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SuccessPage() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleCopyWallet = async () => {
    const wallet = "Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ";
    try {
      await navigator.clipboard.writeText(wallet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy wallet:", err);
    }
  };

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const stored = localStorage.getItem("bob_last_order");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.items?.length > 0) {
            setOrder(parsed);
            localStorage.removeItem("bob_last_order");
            setLoading(false);
            return;
          }
        }

        // ✅ Fallback: fetch from Supabase
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setOrder({
            ...data,
            customerName: data.customer_name || data.name,
            customerEmail: data.customer_email || data.email,
            customerWallet: data.wallet_address || data.wallet,
            items: data.items || data.cart_items || [],
          });
        }
      } catch (err) {
        console.error("❌ Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading your order...</p>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-black text-white flex items-center justify-center text-center px-4">
        <p>
          ⚠️ We couldn’t find your order details. Please check your email or
          return to the{" "}
          <Link href="/shop" className="text-yellow-400 underline">
            Shop
          </Link>.
        </p>
      </section>
    );
  }

  const subtotal = order.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="bg-[#f7e49b] text-black rounded-2xl shadow-lg p-8 max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-lg mb-6">
          Thank you,{" "}
          <span className="font-semibold">
            {order.customerName || order.name || "Valued Customer"}
          </span>
          ! Your order has been processed successfully.
        </p>

        {/* 🧾 Order Summary */}
        <div className="bg-white text-black rounded-xl shadow-md p-6 mb-6 text-left">
          <h2 className="text-xl font-bold mb-4">🧾 Order Summary</h2>
          {order.items.map((item, i) => (
            <div
              key={`${item.id}-${i}`}
              className="flex justify-between items-center mb-3"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.qty} × ${item.price}{" "}
                  {item.size && `| Size: ${item.size}`}{" "}
                  {item.color && `| Color: ${item.color}`}
                </p>
              </div>
              <p className="font-semibold">
                ${(item.price * item.qty).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="flex justify-between border-t pt-3 font-bold">
            <span>Balance Due</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Wallet Section with Copy Button */}
        <div className="flex flex-col items-center mt-4 border-t border-gray-400 pt-4">
          <p className="text-sm text-gray-800 mb-1 font-semibold">
            Send to wallet:
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <p className="bg-black text-[#f7e49b] font-mono text-xs sm:text-sm px-3 py-2 rounded-md break-all w-full max-w-xs sm:max-w-sm">
              Bo9BCBonBbBHYDVJfeepem4jvz1RfVRracFz3jMxuMfZ
            </p>
            <button
              onClick={handleCopyWallet}
              className="bg-black text-[#f7e49b] font-semibold px-3 py-2 rounded hover:bg-gray-900 transition"
            >
              {copied ? " Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>

        {/* Transaction Info */}
        <div className="bg-black text-white rounded-lg p-4 mb-6 text-sm text-left mt-4">
          <p>
            <span className="font-semibold">Reference:</span>{" "}
            {order.reference || "N/A"}
          </p>
        </div>

        {/* Only Continue Shopping button remains */}
        <div className="flex justify-center">
          <Link
            href="/shop"
            className="bg-black text-[#f7e49b] font-bold px-6 py-3 rounded-xl hover:bg-gray-900 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}