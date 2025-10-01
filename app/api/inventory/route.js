import { getInventory } from "@/app/lib/googleSheets";

export async function GET() {
  try {
    const data = await getInventory();

    // Even if Google Sheets fails, `getInventory` will return fallback mock data
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Unexpected error in /api/inventory:", err);

    // Last resort: hardcoded minimal fallback
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

    return new Response(JSON.stringify({ success: true, data: fallback }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}