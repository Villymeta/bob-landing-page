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

    const sheet = doc.sheetsByTitle['Orders'];
    if (!sheet) {
      return NextResponse.json({ error: 'Orders sheet not found' }, { status: 404 });
    }

    const rows = await sheet.getRows();

    const orders = rows.map((row) => ({
      id: row['Order ID'] || '',
      name: row['Customer Name'] || '',
      email: row['Customer Email'] || '',
      product: row['Product'] || '',
      size: row['Size'] || '',
      quantity: row['Quantity'] || '',
      total: row['Total'] || '',
      status: row['Status'] || '',
      date: row['Date'] || '',
    }));

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[ORDERS_ROUTE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load orders' }, { status: 500 });
  }
}