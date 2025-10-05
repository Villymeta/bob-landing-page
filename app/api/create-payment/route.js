import { NextResponse } from "next/server";
import { Keypair, PublicKey } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { encodeURL } from "@solana/pay";
import { google } from "googleapis";

// ✅ Load merchant wallet from environment
const RECEIVING_WALLET = (() => {
  try {
    return new PublicKey(process.env.SOLANA_WALLET);
  } catch {
    console.warn("⚠️ Invalid or missing SOLANA_WALLET env var. Using fallback.");
    return new PublicKey("11111111111111111111111111111111");
  }
})();

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
    console.log("💰 Using merchant wallet:", RECEIVING_WALLET.toBase58());

    // ✅ Parse request body
    const body = await req.json();
    const { productName, priceUsd, items, customer, deliveryOption } = body;

    if (!productName || !priceUsd) {
      return NextResponse.json(
        { error: "Missing productName or priceUsd" },
        { status: 400 }
      );
    }

    // 🔑 Generate unique reference (to track payment)
    const reference = Keypair.generate().publicKey;

    // 💲 Convert USD → BigNumber
    const amount = new BigNumber(priceUsd);

    // 🧾 Build Solana Pay URL
    const url = encodeURL({
      recipient: RECEIVING_WALLET,
      amount,
      reference,
      label: productName,
      message: `TEST MODE (USD = SOL) Payment for ${productName}`,
    });

    // 📝 Log pending order to Google Sheets "Sales" sheet
    try {
      const sheets = getSheetsClient();
      const spreadsheetId = process.env.GOOGLE_SHEET_ID;
      const salesRange = "Sales!A:O"; // extended to include delivery info
      const now = new Date().toISOString();

      // Build address fields if shipping
      const addr =
        deliveryOption === "shipping" && customer?.address
          ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}, ${customer.address.country}`
          : "PICKUP @ DD Las Vegas";

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: salesRange,
        valueInputOption: "RAW",
        requestBody: {
          values: [
            [
              now,
              "PENDING", // productId not tied to 1 row, since multiple items
              productName,
              items.reduce((sum, i) => sum + i.qty, 0), // total qty
              items[0]?.size || "",
              items[0]?.color || "",
              priceUsd,
              reference.toBase58(),
              "pending", // no signature yet
              customer?.name || "guest",
              customer?.email || "",
              customer?.wallet || "",
              deliveryOption || "shipping", // new field
              addr, // full address or pickup note
            ],
          ],
        },
      });
    } catch (logErr) {
      console.warn("⚠️ Failed to log pending order to Google Sheets:", logErr);
    }

    // ✅ Respond with payment session info
    return NextResponse.json({
      success: true,
      url: url.toString(),
      reference: reference.toBase58(),
    });
  } catch (err) {
    console.error("❌ create-payment error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}