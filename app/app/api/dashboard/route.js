// app/api/dashboard/route.js

import { supabase } from "@/lib/supabase";

export async function GET() {
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: orderData } = await supabase
    .from("orders")
    .select("total");

  const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;

  const { count: inventoryCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  return Response.json({
    totalOrders,
    totalRevenue,
    inventoryCount,
  });
}