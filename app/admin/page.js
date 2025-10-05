'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AdminNavbar from '../components/AdminNavbar';

import InventoryTable from './InventoryTable';
import OrdersTable from './OrdersTable';
import RevenueCard from '@/components/Cards/RevenueCard';
import OrdersCard from '@/components/Cards/OrdersCard';
import TopProductCard from '@/components/Cards/TopProductCard';
import LatestOrderCard from '@/components/Cards/LatestOrderCard';

const SalesChart = dynamic(() => import('@/components/Charts/SalesChart'), {
  ssr: false,
});

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin-auth');
    if (auth !== 'granted') {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-black">
      <AdminNavbar />

      <h1 className="text-3xl font-bold mb-6">🧠 Admin Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <RevenueCard />
        <OrdersCard />
        <TopProductCard />
        <LatestOrderCard />
      </div>

      {/* Sales Chart */}
      <div className="bg-white shadow rounded-lg p-4 mb-10">
        <h2 className="text-xl font-semibold mb-3">📉 Sales Overview</h2>
        <SalesChart />
      </div>

      {/* Inventory Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">📦 Inventory</h2>
        <InventoryTable />
      </div>

      {/* Orders Section */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-3">🧾 Orders</h2>
        <OrdersTable />
      </div>

      {/* Logout */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 underline hover:text-red-700"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}