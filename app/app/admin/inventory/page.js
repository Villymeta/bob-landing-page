"use client";

import { useState, useEffect } from "react";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  // 🔄 Fetch products + logs
  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/inventory-logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchLogs();
    const interval = setInterval(() => {
      fetchProducts();
      fetchLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🟢 Handle restock
  const handleRestock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/restock-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size, quantity }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setQuantity(0);
        fetchProducts(); // refresh live data
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Restock error:", err);
      setMessage("❌ Failed to restock product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧺 Inventory Dashboard</h1>

        {/* 🔹 Live Stock Overview */}
        <div className="bg-white text-black rounded-2xl p-8 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">📦 Current Stock Levels</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Size</th>
                  <th className="p-3 border-b">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-6 text-gray-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.flatMap((p) =>
                    Object.entries(p.stock_by_size || {}).map(([size, qty]) => (
                      <tr key={`${p.id}-${size}`} className="hover:bg-gray-100">
                        <td className="p-3 border-b font-semibold">{p.name}</td>
                        <td className="p-3 border-b">{size}</td>
                        <td
                          className={`p-3 border-b ${
                            qty <= 2 ? "text-red-600 font-bold" : ""
                          }`}
                        >
                          {qty}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 🔸 Restock Form */}
        <div className="bg-white text-black rounded-2xl p-8 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">➕ Restock Product</h2>
          <form onSubmit={handleRestock} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold mb-1">Product</label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Size</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                required
              >
                <option value="">Select Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="OS">OS</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                required
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold mt-4 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-400 hover:bg-yellow-500"
                }`}
              >
                {loading ? "Restocking..." : "Restock Product"}
              </button>
            </div>
          </form>

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>

        {/* 🔹 Inventory Logs */}
        <div className="bg-white text-black rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-bold mb-4">🧾 Inventory Activity Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 border-b">Product ID</th>
                  <th className="p-3 border-b">Size</th>
                  <th className="p-3 border-b">Change</th>
                  <th className="p-3 border-b">New Stock</th>
                  <th className="p-3 border-b">Reason</th>
                  <th className="p-3 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6 text-gray-500">
                      No recent inventory activity
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-100">
                      <td className="p-3 border-b">{log.product_id}</td>
                      <td className="p-3 border-b">{log.size}</td>
                      <td
                        className={`p-3 border-b font-semibold ${
                          log.change < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {log.change}
                      </td>
                      <td className="p-3 border-b">{log.new_stock}</td>
                      <td className="p-3 border-b">{log.reason}</td>
                      <td className="p-3 border-b">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}