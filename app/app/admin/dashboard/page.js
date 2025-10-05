"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchDashboardData() {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      setData(json);
    }
    fetchDashboardData();
  }, []);

  if (!data) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl">{data.totalOrders}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-2xl">${data.totalRevenue}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold">Inventory Items</h2>
          <p className="text-2xl">{data.inventoryCount}</p>
        </div>
      </div>
    </div>
  );
}