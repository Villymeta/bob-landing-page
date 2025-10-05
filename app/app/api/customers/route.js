// app/api/customers/route.js

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ✅ Server-side Supabase client (with Service Role Key)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, customers: data }, { status: 200 });
  } catch (err) {
    console.error("❌ GET /customers error:", err.message);
    return NextResponse.json({ success: false, error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, wallet } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Missing name or email" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("customers")
      .insert([
        {
          name,
          email,
          wallet: wallet || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, customer: data }, { status: 201 });
  } catch (err) {
    console.error("❌ POST /customers error:", err.message);
    return NextResponse.json({ success: false, error: "Failed to create customer" }, { status: 500 });
  }
}