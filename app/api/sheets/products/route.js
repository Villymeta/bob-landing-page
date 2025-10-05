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

    const sheet = doc.sheetsByTitle['Products'];
    if (!sheet) {
      return NextResponse.json({ error: 'Products sheet not found' }, { status: 404 });
    }

    const rows = await sheet.getRows();

    const products = rows.map((row) => ({
      id: row['ID'] || '',
      name: row['Name'] || '',
      price: parseFloat(row['Price']) || 0,
      stock: parseInt(row['Stock']) || 0,
      image: row['Image'] || '',
      color: row['Color'] || '',
      sizes: (row['Sizes'] || '').split(',').map((s) => s.trim()),
      status: row['Status'] || '',
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('[PRODUCTS_ROUTE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 });
  }
}