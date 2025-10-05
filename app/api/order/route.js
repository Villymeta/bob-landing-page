import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const order = await req.json();

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name: order.customer.name,
          customer_email: order.customer.email,
          delivery_option: order.deliveryOption,
          address: order.address,
          subtotal: order.subtotal,
          total: order.total,
          wallet: order.customer.wallet || null,
          items: order.items,
        },
      ])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("❌ Order insert failed:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}