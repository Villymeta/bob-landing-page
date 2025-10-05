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

    const sheet = doc.sheetsByTitle['Customers'];
    if (!sheet) {
      return NextResponse.json({ error: 'Customers sheet not found' }, { status: 404 });
    }

    const rows = await sheet.getRows();

    const customers = rows.map((row) => ({
      name: row['Name'] || '',
      email: row['Email'] || '',
      phone: row['Phone'] || '',
      city: row['City'] || '',
      joined: row['Joined'] || '',
    }));

    return NextResponse.json(customers);
  } catch (error) {
    console.error('[CUSTOMERS_ROUTE_ERROR]', error);
    return NextResponse.json({ error: 'Failed to load customers' }, { status: 500 });
  }
}