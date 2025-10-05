'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrdersTable from '@/app/admin/components/OrdersTable';

export default function OrdersPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('admin-auth');
    if (auth !== 'granted') {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">🧾 Orders</h1>
      <OrdersTable />
    </div>
  );
}