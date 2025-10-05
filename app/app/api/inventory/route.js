import { getInventory } from "@/lib/supabase";

export async function GET() {
  try {
    const data = await getInventory();

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Unexpected error in /api/inventory:", err);

    const fallback = [
      {
        id: "0",
        name: "Fallback Tee",
        price: 20,
        stock: 0,
        status: "new",
        image: "/placeholder.png",
        color: "Black",
        sizes: ["M", "L"],
      },
    ];

    return new Response(JSON.stringify({ success: false, data: fallback }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}