"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const defaultProducts = [
  {
    id: "DD Las Vegas Tee",
    name: "DD Las Vegas Tee",
    price: 40,
    image: "/merch/bob-LV.png",
    sizes: SIZES,
    status: "hot",
    color: "Gold on Black",
    stockBySize: { S: 8, M: 14, L: 16, XL: 8, XXL: 4 },
  },
  {
    id: "B.O.B Black Tee",
    name: "B.O.B Black Tee",
    price: 30,
    image: "/merch/bob-black.png",
    sizes: SIZES,
    status: "new",
    color: "Black",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "B.O.B White Tee",
    name: "B.O.B White Tee",
    price: 30,
    image: "/merch/bob-white.png",
    sizes: SIZES,
    status: "new",
    color: "White",
    stockBySize: { S: 4, M: 7, L: 8, XL: 4, XXL: 2 },
  },
  {
    id: "BOB Beanie",
    name: "BOB Beanie",
    price: 30,
    image: "/merch/beanie.png",
    status: "new",
    color: "Black",
    stockBySize: { OS: 30 },
  },
  {
    id: "DD New York Tee",
    name: "DD New York Tee",
    price: 40,
    image: "/merch/bob-nyc.png",
    sizes: SIZES,
    status: "sold out",
    color: "White on Black",
    stockBySize: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
  },
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    const storedSizes = JSON.parse(localStorage.getItem("bob_sizes")) || {};
    const storedQuantities = JSON.parse(localStorage.getItem("bob_qty")) || {};
    setSelectedSizes(storedSizes);
    setQuantities(storedQuantities);
  }, []);

  useEffect(() => {
    localStorage.setItem("bob_sizes", JSON.stringify(selectedSizes));
    localStorage.setItem("bob_qty", JSON.stringify(quantities));
  }, [selectedSizes, quantities]);

  const handleAddToCart = (product) => {
    let size = selectedSizes[product.id];
    const qty = quantities[product.id] || 1;

    if (!product.sizes && product.stockBySize?.OS) {
      size = "OS";
    }

    if (!size) {
      alert("Please select a size.");
      return;
    }

    const stock = product.stockBySize[size] || 0;
    if (qty > stock) {
      alert(`Only ${stock} available in size ${size}.`);
      return;
    }

    addToCart({ ...product, size, qty });
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Welcome to the B.O.B Collection!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {defaultProducts.map((product) => {
          const isSoldOut = Object.values(product.stockBySize).every((qty) => qty === 0);

          return (
            <div
              key={product.id}
              className="relative bg-white text-black p-6 rounded-xl shadow-lg flex flex-col items-center"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="rounded-xl mb-4"
                />
                {isSoldOut && (
                  <span className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-md shadow">
                    SOLD OUT
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-gray-600">${product.price}</p>

              {product.sizes && (
  <div className="mt-4 w-full">
    <label className="block text-sm font-bold mb-1">Size</label>
    <select
      className="w-full border px-3 py-2 rounded-lg"
      value={selectedSizes[product.id] || ""}
      onChange={(e) =>
        setSelectedSizes({ ...selectedSizes, [product.id]: e.target.value })
      }
      disabled={isSoldOut}
    >
      <option value="">Select Size</option>
      {product.sizes.map((size) => {
        const available = product.stockBySize[size] || 0;
        return (
          <option key={size} value={size} disabled={available === 0}>
            {size}
          </option>
        );
      })}
    </select>
  </div>
)}

              <div className="mt-3 w-full">
                <label className="block text-sm font-bold mb-1">Qty</label>
                <input
                  type="number"
                  min={1}
                  max={
                    product.id === "BOB Beanie"
                      ? Math.min(2, product.stockBySize.OS)
                      : product.sizes
                      ? product.stockBySize[selectedSizes[product.id]] || 1
                      : product.stockBySize.OS
                  }
                  className="w-full border px-3 py-2 rounded-lg"
                  value={quantities[product.id] || 1}
                  onChange={(e) =>
                    setQuantities({
                      ...quantities,
                      [product.id]: parseInt(e.target.value),
                    })
                  }
                  disabled={isSoldOut}
                />
              </div>

              {product.id === "BOB Beanie" && (
                <p className="text-xs text-red-500 mt-1">* Limit 2 per customer</p>
              )}

              <button
                onClick={() => handleAddToCart(product)}
                disabled={isSoldOut}
                className={`mt-4 w-full ${
                  isSoldOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                } text-black px-4 py-2 rounded-xl font-bold transition`}
              >
                {isSoldOut ? "Sold Out" : "Add to Bag"}
              </button>
            </div>
          );
        })}
      </div>
    </main>
  );
}
