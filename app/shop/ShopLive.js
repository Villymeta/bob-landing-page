"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useBag } from "../../context/BagContext"; // ✅ Correct relative path
import { motion } from "framer-motion";

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
  const { addToBag } = useBag();
  const [selectedSizes, setSelectedSizes] = useState({});
  const [quantities, setQuantities] = useState({});
  const [added, setAdded] = useState(null);

  // ✅ Persist selected sizes and quantities
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

  // ✅ Add to bag logic
  const handleAddToBag = (product) => {
    let size = selectedSizes[product.id];
    const qty = quantities[product.id] || 1;

    if (!product.sizes && product.stockBySize?.OS) size = "OS";
    if (!size) return alert("Please select a size before adding to your bag.");

    const stock = product.stockBySize[size] || 0;
    if (qty > stock) return alert(`Only ${stock} left in size ${size}.`);

    addToBag({ ...product, size, qty });
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1200);
  };

  // ✅ Quantity updater helper
  const updateQty = (productId, value, max) => {
    const current = quantities[productId] || 1;
    const newQty = Math.min(Math.max(1, current + value), max);
    setQuantities({ ...quantities, [productId]: newQty });
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="font-graffiti text-5xl text-center text-bobyellow mb-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
        Welcome to the B.O.B Collection!
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {defaultProducts.map((product) => {
          const isSoldOut = Object.values(product.stockBySize).every(
            (qty) => qty === 0
          );

          const maxQty =
            product.id === "BOB Beanie"
              ? Math.min(2, product.stockBySize.OS)
              : product.sizes
              ? product.stockBySize[selectedSizes[product.id]] ||
                Math.max(...Object.values(product.stockBySize))
              : product.stockBySize.OS;

          return (
            <motion.div
              key={product.id}
              className="relative bg-bobyellow text-black p-6 rounded-xl shadow-lg flex flex-col items-center"
              whileHover={{ scale: 1.02 }}
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

              {/* ✅ Size Selector */}
              {product.sizes && (
                <div className="mt-4 w-full">
                  <label className="block text-sm font-bold mb-1">Size</label>
                  <select
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-white text-black"
                    value={selectedSizes[product.id] || ""}
                    onChange={(e) =>
                      setSelectedSizes({
                        ...selectedSizes,
                        [product.id]: e.target.value,
                      })
                    }
                    disabled={isSoldOut}
                  >
                    <option value="">Select Size</option>
                    {product.sizes.map((size) => {
                      const available = product.stockBySize[size] || 0;
                      return (
                        <option key={size} value={size} disabled={available === 0}>
                          {size} {available === 0 ? "(Sold Out)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              {/* ✅ Fixed Quantity Section */}
              <div className="mt-3 w-full">
                <label className="block text-sm font-bold mb-1">Qty</label>
                <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, -1, maxQty)}
                    disabled={isSoldOut}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 font-bold text-lg disabled:opacity-50"
                  >
                    –
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQty}
                    className="w-full text-center text-lg font-semibold border-0 focus:ring-0 text-black appearance-none"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities({
                        ...quantities,
                        [product.id]: parseInt(e.target.value) || 1,
                      })
                    }
                    disabled={isSoldOut}
                  />
                  <button
                    type="button"
                    onClick={() => updateQty(product.id, +1, maxQty)}
                    disabled={isSoldOut}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 font-bold text-lg disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {product.id === "BOB Beanie" && (
                <p className="text-xs text-red-500 mt-1">* Limit 2 per customer</p>
              )}

              {/* ✅ Add to Bag button */}
              <button
                onClick={() => handleAddToBag(product)}
                disabled={isSoldOut}
                className={`mt-4 w-full ${
                  isSoldOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#F5C518] hover:bg-[#ffdb4d]"
                } text-black px-4 py-2 rounded-xl font-bold transition`}
              >
                {isSoldOut
                  ? "Sold Out"
                  : added === product.id
                  ? "✅ Added!"
                  : "Add to Bag"}
              </button>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
