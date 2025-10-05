// ✅ FILE: app/api/checkout/route.js
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  }
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    const reference = uuidv4();

    // 🧍 Create or get customer
    let { data: existing, error: existingErr } = await supabase
      .from("customers")
      .select("id")
      .eq("email", customer.email)
      .maybeSingle();
    if (existingErr) throw existingErr;

    let customerId = existing?.id;
    if (!customerId) {
      const { data: newCust, error: custErr } = await supabase
        .from("customers")
        .insert([
          {
            name: customer.name || "Guest",
            email: customer.email,
            wallet: customer.wallet || null,
          },
        ])
        .select()
        .single();
      if (custErr) throw custErr;
      customerId = newCust.id;
    }

    // ✅ Clean and prepare item data
    const sanitizedItems = items.map((item) => ({
      product_sku: item.id, // treat as text, not uuid
      product_name: item.name,
      size: item.size,
      color: item.color || null,
      qty: item.qty,
      price: item.price,
    }));

    // 🧾 Insert order into "orders" table
    const orderTotal = sanitizedItems.reduce(
      (acc, cur) => acc + cur.price * cur.qty,
      0
    );

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          reference,
          customer_id: customerId,
          total: orderTotal,
          payment_status: "pending",
          items: sanitizedItems,
        },
      ])
      .select()
      .single();
    if (orderErr) throw orderErr;

    return NextResponse.json({
      success: true,
      message: "✅ Order submitted successfully",
      reference,
    });
  } catch (err) {
    console.error("❌ Checkout Error:", err);
    return NextResponse.json(
      { error: err.message || "Order submission failed" },
      { status: 500 }
    );
  }
}
