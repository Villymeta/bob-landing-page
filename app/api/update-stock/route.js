// app/api/update-stock/route.js
import { NextResponse } from "next/server";
import { google } from "googleapis";

let sheetsClient = null;

function getSheetsClient() {
  if (sheetsClient) return sheetsClient;

  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!clientEmail || !privateKeyRaw || !process.env.GOOGLE_SHEET_ID) {
    throw new Error("Missing required Google Sheets environment variables");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKeyRaw.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheetsClient = google.sheets({ version: "v4", auth });
  return sheetsClient;
}

export async function POST(req) {
  try {
    const { items, reference, signature, customer } = await req.json();

    if (!items || !items.length || !reference) {
      return NextResponse.json(
        { error: "Missing required fields (items, reference)" },
        { status: 400 }
      );
    }

    const sheets = getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // 1️⃣ Update Inventory for each item
    const inventoryRange = "Inventory!A2:F"; // id | name | color | size | price | stock
    const inventoryRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: inventoryRange,
    });

    const rows = inventoryRes.data.values || [];

    for (const item of items) {
      const rowIndex = rows.findIndex((row) => String(row[0]).trim() === String(item.id));
      if (rowIndex === -1) continue;

      const productRow = rows[rowIndex];
      const currentStock = parseInt(productRow[5] ?? "0", 10) || 0;
      const newStock = Math.max(currentStock - item.qty, 0);

      const updateRange = `Inventory!F${rowIndex + 2}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: updateRange,
        valueInputOption: "RAW",
        requestBody: { values: [[newStock]] },
      });
    }

    // 2️⃣ Log sale in Sales sheet (summary)
    const salesRange = "Sales!A:L";
    const now = new Date().toISOString();
    const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.qty, 0);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: salesRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          now,
          "MULTI", // multiple products
          "BOB Order",
          totalQty,
          "-", // size N/A (multi)
          "-", // color N/A (multi)
          totalAmount.toFixed(2),
          reference,
          signature || "confirmed",
          customer?.name || "guest",
          customer?.email || "",
          customer?.wallet || "",
        ]],
      },
    });

    // 3️⃣ Log full receipt (with shipping)
    const receiptsRange = "Receipts!A:M"; 
    const itemsJson = JSON.stringify(items);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: receiptsRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [[
          now,
          reference,
          signature || "pending",
          customer?.name || "guest",
          customer?.email || "",
          customer?.wallet || "",
          customer?.address?.street || "",
          customer?.address?.city || "",
          customer?.address?.state || "",
          customer?.address?.zip || "",
          customer?.address?.country || "",
          itemsJson,
          totalAmount.toFixed(2),
        ]],
      },
    });

    return NextResponse.json({
      success: true,
      reference,
      totalAmount,
    });
  } catch (error) {
    console.error("❌ Error updating stock & logging sale:", error);
    return NextResponse.json(
      { error: "Failed to update stock/log sale" },
      { status: 500 }
    );
  }
}