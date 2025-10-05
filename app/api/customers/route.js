import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Customers!A2:E"; // Assuming headers are in A1:E1

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json([]);
    }

    const customers = rows.map((row) => ({
      name: row[0] || "",
      email: row[1] || "",
      phone: row[2] || "",
      orders: row[3] || "",
      notes: row[4] || "",
    }));

    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers from Google Sheets:", error);
    return NextResponse.json({ error: "Failed to fetch customer data" }, { status: 500 });
  }
}