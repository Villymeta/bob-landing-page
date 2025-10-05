import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const data = await req.json();
    const { name, email, phone, wallet, address, delivery, total } = data;

    const { error } = await supabase.from("orders").insert([
      { name, email, phone, wallet, address, delivery, total, payment_status: "pending" },
    ]);

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ API crashed:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}