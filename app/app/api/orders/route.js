// app/api/order/route.js
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // service role client
import { randomUUID } from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      reference = randomUUID(),
      signature = "pending",
      deliveryMethod,
      shippingAddress,
      customer,
      items,
      totalAmount,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields (items)" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // --- STEP 1: Decrement stock for each product ---
    for (const item of items) {
      const { id: productId, size, qty } = item;

      // Fetch product stock
      const { data: product, error: fetchError } = await supabaseAdmin
        .from("products")
        .select("stock_by_size")
        .eq("id", productId)
        .single();

      if (fetchError || !product) {
        throw new Error(`Product not found: ${productId}`);
      }

      const currentStock = product.stock_by_size || {};
      const available = currentStock[size] ?? 0;

      if (available < qty) {
        return NextResponse.json(
          { error: `Not enough stock for ${item.name} (size ${size})` },
          { status: 400 }
        );
      }

      // Decrement
      const updatedStock = {
        ...currentStock,
        [size]: available - qty,
      };

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock_by_size: updatedStock })
        .eq("id", productId);

      if (updateError) throw updateError;
    }

    // --- STEP 2: Insert into `orders` table ---
    const { error: orderError } = await supabaseAdmin.from("orders").insert([
      {
        id: reference,
        items,
        total: totalAmount,
        customer_email: customer?.email || "",
        customer_name: customer?.name || "guest",
        wallet_address: customer?.wallet || "",
        created_at: now,
      },
    ]);

    if (orderError) {
      console.error("⚠️ Failed to insert order:", orderError);
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 }
      );
    }

    // --- STEP 3: Insert into `receipts` (for history) ---
    const { error: receiptError } = await supabaseAdmin.from("receipts").insert([
      {
        reference,
        signature,
        customer_name: customer?.name || "guest",
        customer_email: customer?.email || "",
        customer_wallet: customer?.wallet || "",
        street: shippingAddress?.street || "",
        city: shippingAddress?.city || "",
        state: shippingAddress?.state || "",
        zip: shippingAddress?.zip || "",
        country: shippingAddress?.country || "",
        items_json: JSON.stringify(items),
        total_amount: totalAmount,
        delivery_method: deliveryMethod || "unknown",
        timestamp: now,
      },
    ]);

    if (receiptError) {
      console.error("⚠️ Failed to insert receipt:", receiptError);
      return NextResponse.json(
        { error: "Failed to save receipt" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, reference });
  } catch (err) {
    console.error("❌ /api/order error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to log order" },
      { status: 500 }
    );
  }
}