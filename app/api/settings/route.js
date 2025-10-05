import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function POST(req) {
  try {
    const { storeName, contactEmail, walletAddress } = await req.json();

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    // Authenticate
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Settings'];

    if (!sheet) {
      return NextResponse.json({ error: 'Settings sheet not found' }, { status: 404 });
    }

    // Clear previous rows (optional: you can comment this out if you want to keep history)
    const rows = await sheet.getRows();
    for (const row of rows) {
      await row.delete();
    }

    // Add new settings
    await sheet.addRow({
      'Store Name': storeName,
      'Contact Email': contactEmail,
      'Wallet Address': walletAddress,
      'Updated': new Date().toLocaleString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[SETTINGS ERROR]', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}