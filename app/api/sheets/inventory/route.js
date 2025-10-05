import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function GET() {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['Inventory'];
    if (!sheet) {
      return NextResponse.json({ error: 'Inventory sheet not found' }, { status: 404 });
    }

    const rows = await sheet.getRows();

    const inventory = rows.map((row) => ({
      product: row['Product'] || '',
      sku: row['SKU'] || '',
      color: row['Color'] || '',
      size: row['Size'] || '',
      price: row['Price'] || '',
      stock: row['Stock'] || '',
    }));

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('[INVENTORY_ROUTE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 });
  }
}