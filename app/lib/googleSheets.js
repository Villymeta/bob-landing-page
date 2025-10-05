import { google } from "googleapis";

// ✅ fallback if Sheets API fails
const mockInventory = [
  {
    id: "1",
    name: "Test Shirt",
    price: 20,
    stock: 5,
    color: "Black",
    size: "M",
  },
];

// 1️⃣ GET INVENTORY from "Inventory" tab
export async function getInventory() {
  try {
    if (typeof window !== "undefined") {
      console.warn("⚠️ getInventory called on client. Returning mock data.");
      return mockInventory;
    }

    const {
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID,
    } = process.env;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.warn("⚠️ Missing Google Sheets credentials. Returning mock inventory.");
      return mockInventory;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const range = "Inventory!A2:F"; // id, name, color, size, price, stock
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
    });

    const rows = response.data.values || [];

    if (!rows.length) return mockInventory;

    return rows.map((row) => ({
      id: row[0],
      name: row[1],
      color: row[2],
      size: row[3],
      price: parseFloat(row[4] || 0),
      stock: parseInt(row[5] || 0),
    }));
  } catch (err) {
    console.error("❌ Google Sheets API error:", err.message);
    return mockInventory;
  }
}

// 2️⃣ LOG ORDER to "Sales" tab
export async function logOrderToSheet(orderData) {
  try {
    const {
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID,
    } = process.env;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const now = new Date();
    const timestamp = now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" });

    const rows = orderData.items.map((item) => [
      timestamp,
      item.id,
      item.name,
      item.quantity,
      item.size || "",
      item.color || "",
      item.price,
      orderData.reference || "",         // G: optional
      orderData.signature || "",         // H
      orderData.customerName || "",      // I
      orderData.customerEmail || "",     // J
      orderData.customerWallet || "",    // K
    ]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: "Sales!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: rows },
    });

    return response.status === 200 || response.status === 201;
  } catch (err) {
    console.error("❌ Failed to log order:", err.message);
    return false;
  }
}

// 3️⃣ UPDATE STOCK in "Inventory" tab
export async function updateInventory(productId, size, quantitySold) {
  try {
    const {
      GOOGLE_CLIENT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_SHEET_ID,
    } = process.env;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const range = "Inventory!A2:F";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range,
    });

    const rows = response.data.values;
    let updated = false;

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === productId && rows[i][3] === size) {
        const currentStock = parseInt(rows[i][5] || "0", 10);
        const newStock = Math.max(currentStock - quantitySold, 0);

        const updateResponse = await sheets.spreadsheets.values.update({
          spreadsheetId: GOOGLE_SHEET_ID,
          range: `Inventory!F${i + 2}`, // F is stock column
          valueInputOption: "USER_ENTERED",
          resource: {
            values: [[newStock]],
          },
        });

        updated = updateResponse.status === 200;
        break;
      }
    }

    return updated;
  } catch (err) {
    console.error("❌ Failed to update inventory:", err.message);
    return false;
  }
}