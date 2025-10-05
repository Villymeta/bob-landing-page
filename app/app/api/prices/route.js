import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,usd-coin&vs_currencies=usd"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch from CoinGecko");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Price fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}