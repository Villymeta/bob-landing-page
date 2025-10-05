import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function GET() {
  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo(); // loads document properties and worksheets

    const sheetTitles = Object.values(doc.sheetsByTitle).map(sheet => sheet.title);

    return NextResponse.json({
      message: '🟢 Google Sheets connected successfully.',
      sheets: sheetTitles,
    });
  } catch (error) {
    console.error('[SHEETS_ROUTE_ERROR]', error);
    return NextResponse.json({ error: '❌ Failed to connect to Google Sheets' }, { status: 500 });
  }
}