// app/api/verify-payment/route.js
import { NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import { findReference, validateTransfer } from "@solana/pay";

// ✅ Load environment variables
const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com";
const RECEIVING_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_MERCHANT_WALLET ||
    "11111111111111111111111111111111"
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { reference, items, customer } = body; 
    // 🟡 items = cart array from frontend
    // 🟡 customer = { name, email, wallet }

    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const connection = new Connection(RPC_URL, "confirmed");
    const referencePubkey = new PublicKey(reference);

    // 🔍 Look for transactions tagged with this reference
    const tx = await findReference(connection, referencePubkey);

    // ✅ Validate the transaction sent funds to the correct wallet
    await validateTransfer(connection, tx.signature, {
      recipient: RECEIVING_WALLET,
    });

    console.log("✅ Payment verified:", tx.signature);

    // 🟡 Call update-stock for each purchased item
    if (items && Array.isArray(items)) {
      for (const item of items) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/update-stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.qty,
              size: item.size,
              color: item.color,
              reference,
              signature: tx.signature,
              customer,
            }),
          });
        } catch (updateErr) {
          console.error("⚠️ Failed to update stock for item:", item.id, updateErr);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      signature: tx.signature,
    });
  } catch (err) {
    if (err.message?.includes("not found")) {
      // Payment hasn’t arrived yet
      return NextResponse.json({ ok: false });
    }

    console.error("❌ verify-payment error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}