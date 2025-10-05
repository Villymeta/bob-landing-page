import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // service role key

export async function POST(req) {
  try {
    const { productId, size, quantity, reference = null } = await req.json();

    if (!productId || !size || !quantity) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1️⃣ Fetch current stock
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("stock_by_size")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: fetchError?.message || "Product not found" },
        { status: 404 }
      );
    }

    const currentStock = product.stock_by_size || {};
    const available = currentStock[size] ?? 0;

    if (available < quantity) {
      return NextResponse.json(
        { error: `Not enough stock for size ${size}` },
        { status: 400 }
      );
    }

    // 2️⃣ Update stock atomically
    const updatedStock = {
      ...currentStock,
      [size]: available - quantity,
    };

    const { error: updateError } = await supabaseAdmin
      .from("products")
      .update({ stock_by_size: updatedStock })
      .eq("id", productId);

    if (updateError) {
      console.error("⚠️ Failed to update stock:", updateError);
      return NextResponse.json({ error: "Stock update failed" }, { status: 500 });
    }

    // 3️⃣ Log stock movement
    const { error: logError } = await supabaseAdmin.from("inventory_logs").insert([
      {
        product_id: productId,
        size,
        change: -quantity, // decrement
        new_stock: updatedStock[size],
        reason: "order",
        reference, // optional order reference
      },
    ]);

    if (logError) {
      console.error("⚠️ Failed to insert inventory log:", logError);
    }

    return NextResponse.json({ success: true, updatedStock });
  } catch (err) {
    console.error("❌ update-stock error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}