"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQty, clearCart } = useCart();

  // 💰 subtotal calculation
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">🛒 Your cart is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg">
          {cart.map((item, i) => (
            <div
              key={`${item.id}-${item.size}-${item.color}-${i}`}
              className="flex justify-between items-center mb-4"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                {/* ✅ show size & color if available */}
                {(item.size || item.color) && (
                  <p className="text-sm text-gray-500">
                    {item.color ? `${item.color}` : ""}{" "}
                    {item.size ? `• ${item.size}` : ""}
                  </p>
                )}
                <p className="text-sm text-gray-500">${item.price}</p>
              </div>

              <div className="flex items-center space-x-2">
                {/* ✅ qty input */}
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    updateQty(item.id, item.size, item.color, parseInt(e.target.value) || 1)
                  }
                  className="w-16 border rounded text-center"
                />
                {/* remove button */}
                <button
                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* subtotal */}
          <div className="flex justify-between items-center border-t pt-4 font-bold">
            <span>Total</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* actions */}
          <div className="mt-6 flex justify-between space-x-3">
            <button
              onClick={clearCart}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400"
            >
              Clear Cart
            </button>
            <Link
              href={`/checkout?product=Cart&price=${subtotal}`}
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}