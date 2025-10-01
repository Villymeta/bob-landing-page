"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [uniqueWallets, setUniqueWallets] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/orders");
      const { data } = await res.json();

      setOrders(data);

      // Stats
      const total = data.reduce((acc, o) => acc + o.total, 0);
      setTotalSales(total);

      const wallets = new Set(data.map((o) => o.wallet));
      setUniqueWallets(wallets.size);
    };

    fetchOrders();
  }, []);

  return (
    <section className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white text-black p-4 rounded-xl shadow-lg">
          <p className="text-sm text-gray-500">Total Sales</p>
          <h2 className="text-2xl font-bold">${totalSales.toFixed(2)}</h2>
        </div>
        <div className="bg-white text-black p-4 rounded-xl shadow-lg">
          <p className="text-sm text-gray-500">Orders Received</p>
          <h2 className="text-2xl font-bold">{orders.length}</h2>
        </div>
        <div className="bg-white text-black p-4 rounded-xl shadow-lg">
          <p className="text-sm text-gray-500">Unique Wallets</p>
          <h2 className="text-2xl font-bold">{uniqueWallets}</h2>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Recent Orders</h2>
      <div className="overflow-x-auto bg-white text-black rounded-xl shadow-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left px-4 py-2">Order ID</th>
              <th className="text-left px-4 py-2">Customer Wallet</th>
              <th className="text-left px-4 py-2">Total</th>
              <th className="text-left px-4 py-2">Items</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.wallet}</td>
                <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                <td className="px-4 py-2">{order.items.length}</td>
                <td className="px-4 py-2">
                  {new Date(order.timestamp).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}