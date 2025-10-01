"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const defaultProducts = [
  {
    id: "B.O.B Black Tee",
    name: "B.O.B Black Tee",
    price: 30,
    stock: 12,
    image: "/merch/bob-black.png",
    sizes: SIZES,
    status: "new",
    color: "Black",
  },
  {
    id: "B.O.B White Tee",
    name: "B.O.B White Tee",
    price: 30,
    stock: 12,
    image: "/merch/bob-white.png",
    sizes: SIZES,
    status: "new",
    color: "White",
  },
  {
    id: "DD Las Vegas Tee",
    name: "DD Las Vegas Tee",
    price: 35,
    stock: 10,
    image: "/merch/bob-LV.png",
    sizes: SIZES,
    status: "hot",
    color: "Gold on Black",
  },
  {
    id: "DD New York Tee",
    name: "DD New York Tee",
    price: 35,
    stock: 10,
    image: "/merch/bob-nyc.png",
    sizes: SIZES,
    status: "hot",
    color: "White on Black",
  },
  {
    id: "BOB Beanie",
    name: "BOB Beanie",
    price: 25,
    stock: 20,
    image: "/merch/beanie.png",
    sizes: ["OS"], // One Size
    status: "new",
    color: "Black",
  },
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  // Load from localStorage
  useEffect(() => {
    const storedSizes = JSON.parse(localStorage.getItem("bob_sizes")) || {};
    const storedQuantities = JSON.parse(localStorage.getItem("bob_qty")) || {};
    setSelectedSizes(storedSizes);
    setQuantities(storedQuantities);
  }, []);

  // Update localStorage on change
  useEffect(() => {
    localStorage.setItem("bob_sizes", JSON.stringify(selectedSizes));
    localStorage.setItem("bob_qty", JSON.stringify(quantities));
  }, [selectedSizes, quantities]);

  const handleAddToCart = (product) => {
    const size = selectedSizes[product.id];
    const qty = quantities[product.id] || 1;

    if (!size) {
      alert("Please select a size.");
      return;
    }

    addToCart({ ...product, size, qty });
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Shop Live</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {defaultProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white text-black p-6 rounded-xl shadow-lg flex flex-col items-center"
          >
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="rounded-xl mb-4"
            />
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>

            <div className="mt-4 w-full">
              <label className="block text-sm font-bold mb-1">Size</label>
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={selectedSizes[product.id] || ""}
                onChange={(e) =>
                  setSelectedSizes({ ...selectedSizes, [product.id]: e.target.value })
                }
              >
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 w-full">
              <label className="block text-sm font-bold mb-1">Qty</label>
              <input
                type="number"
                min={1}
                max={product.stock}
                className="w-full border px-3 py-2 rounded-lg"
                value={quantities[product.id] || 1}
                onChange={(e) =>
                  setQuantities({
                    ...quantities,
                    [product.id]: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <button
              onClick={() => handleAddToCart(product)}
              className="mt-4 w-full bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold hover:bg-yellow-500 transition"
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}