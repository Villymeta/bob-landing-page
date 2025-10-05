import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase"; // service role key

export async function POST(req) {
  try {
    const { productId, size, quantity, reason = "restock" } = await req.json();

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
    const currentQty = currentStock[size] ?? 0;

    // 2️⃣ Add stock
    const updatedStock = {
      ...currentStock,
      [size]: currentQty + quantity,
    };

    const { error: updateError } = await supabaseAdmin
      .from("products")
      .update({ stock_by_size: updatedStock })
      .eq("id", productId);

    if (updateError) {
      console.error("⚠️ Failed to restock:", updateError);
      return NextResponse.json({ error: "Restock failed" }, { status: 500 });
    }

    // 3️⃣ Log restock
    const { error: logError } = await supabaseAdmin.from("inventory_logs").insert([
      {
        product_id: productId,
        size,
        change: quantity, // positive for restock
        new_stock: updatedStock[size],
        reason,
      },
    ]);

    if (logError) {
      console.error("⚠️ Failed to insert restock log:", logError);
    }

    return NextResponse.json({
      success: true,
      message: `Restocked ${quantity} units of size ${size}.`,
      updatedStock,
    });
  } catch (err) {
    console.error("❌ restock-product error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}