import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Keypair, PublicKey } from "@solana/web3.js";
import { encodeURL } from "@solana/pay";
import BigNumber from "bignumber.js";   // ✅ import

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const solReceiver = process.env.NEXT_PUBLIC_SOL_RECEIVER;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("📦 Incoming payment body:", body);

    const { amountUSD, itemName = "Bag Order" } = body;
    if (!amountUSD || isNaN(amountUSD)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // ✅ FIX: use BigNumber with 6 decimals for USDC
    const amount = new BigNumber(amountUSD).decimalPlaces(6);

    // Generate payment reference
    const reference = Keypair.generate().publicKey.toBase58();

    // Build Solana Pay URL (USDC direct)
    const recipient = new PublicKey(solReceiver);
    const url = encodeURL({
      recipient,
      amount, // ✅ BigNumber now
      reference: new PublicKey(reference),
      label: "BOB Shop",
      message: `Payment for ${itemName}`,
    });

    // Save order in Supabase
    const { error } = await supabase.from("orders").insert([
      {
        items: [{ name: itemName, qty: 1, price: amountUSD }],
        total: amountUSD,
        reference,
        payment_status: "pending",
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      paymentURL: url.toString(),
      reference,
    });
  } catch (err) {
    console.error("❌ Payment API crashed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
