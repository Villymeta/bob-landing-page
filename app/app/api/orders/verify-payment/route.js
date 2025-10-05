// app/api/orders/verify-payment/route.js
import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { findReference, validateTransfer } from "@solana/pay";
import { supabaseAdmin } from "@/lib/supabaseClient";

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";

const RECEIVING_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_MERCHANT_WALLET || "11111111111111111111111111111111"
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { reference, items, customer } = body;

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const connection = new Connection(RPC_URL, "confirmed");
    const referencePubkey = new PublicKey(reference);

    // 1️⃣ Check blockchain for transaction
    const tx = await findReference(connection, referencePubkey);

    // 2️⃣ Validate it went to your wallet
    await validateTransfer(connection, tx.signature, {
      recipient: RECEIVING_WALLET,
    });

    console.log("✅ Payment verified:", tx.signature);

    // 3️⃣ Update order status in both tables
    await supabaseAdmin
      .from("sales_transactions")
      .update({ status: "paid", signature: tx.signature })
      .eq("reference", reference);

    await supabaseAdmin
      .from("receipts_records")
      .update({ status: "paid", signature: tx.signature })
      .eq("reference", reference);

    // 4️⃣ Reduce inventory stock
    if (items && Array.isArray(items)) {
      for (const item of items) {
        try {
          // Assume you have `inventory` table with product_id, size, stock
          const { data: currentStock, error: fetchError } = await supabaseAdmin
            .from("inventory")
            .select("stock")
            .eq("product_id", item.id)
            .eq("size", item.size || "OS")
            .single();

          if (fetchError) {
            console.error("⚠️ Fetch inventory error:", fetchError);
            continue;
          }

          const newStock = Math.max(
            0,
            (currentStock?.stock || 0) - (item.qty || 0)
          );

          const { error: updateError } = await supabaseAdmin
            .from("inventory")
            .update({ stock: newStock })
            .eq("product_id", item.id)
            .eq("size", item.size || "OS");

          if (updateError) {
            console.error("⚠️ Inventory update error:", updateError);
          }
        } catch (updateErr) {
          console.error("❌ Inventory update failed:", updateErr);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      signature: tx.signature,
      status: "paid",
    });
  } catch (err) {
    if (err.message?.includes("not found")) {
      return NextResponse.json({ ok: false }); // still waiting for payment
    }

    console.error("❌ verify-payment error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}