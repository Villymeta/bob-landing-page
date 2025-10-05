"use client";

import Link from "next/link";
import Image from "next/image";
import { useBag } from "@/context/BagContext";

export default function BagPage() {
  const { bag, removeFromBag, updateBagQty, clearBag, subtotal } = useBag();

  return (
    <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Bag</h1>

      {bag.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-400 mb-4">👜 Your bag is empty.</p>
          <Link
            href="/shop"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-xl hover:bg-yellow-500 transition"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white text-black rounded-2xl shadow-lg p-6 w-full max-w-lg">
          {/* ✅ Item list */}
          {bag.map((item, i) => (
            <div
              key={`${item.id}-${item.size}-${item.color}-${i}`}
              className="flex justify-between items-center mb-5 border-b border-gray-200 pb-4"
            >
              <div className="flex items-center space-x-3">
                {/* Optional image preview */}
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                )}

                <div>
                  <p className="font-semibold">{item.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-sm text-gray-500">
                      {item.color ? `${item.color}` : ""}
                      {item.size ? ` • ${item.size}` : ""}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Quantity + Remove */}
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) =>
                    updateBagQty(
                      item.id,
                      item.size,
                      item.color,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-16 border border-gray-300 rounded text-center"
                />
                <button
                  onClick={() => removeFromBag(item.id, item.size, item.color)}
                  className="text-red-500 hover:text-red-700 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* ✅ Subtotal Section */}
          <div className="flex justify-between items-center border-t pt-4 font-bold text-lg">
            <span>Balance Due:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* ✅ Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
            <button
              onClick={clearBag}
              className="bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition w-full sm:w-auto"
            >
              Clear Bag
            </button>
            <Link
              href="/checkout"
              className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition w-full sm:w-auto text-center"
            >
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}