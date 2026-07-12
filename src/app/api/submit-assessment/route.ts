import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { assessmentName, answers, score, level, timestamp } = body;

    // Check for environment variables
    const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
    const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;
    const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;

    if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) {
      console.error("Missing Google Sheets credentials in environment variables.");
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
    const serviceAccountAuth = new JWT({
      email: GOOGLE_CLIENT_EMAIL,
      key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, serviceAccountAuth);

    await doc.loadInfo(); // loads document properties and worksheets
    console.log(`Connected to Google Sheet: ${doc.title}`);

    // Try to find a sheet with the assessment name, or just use the first sheet
    let sheet = doc.sheetsByTitle[assessmentName];
    
    // If the sheet doesn't exist, create it with headers
    if (!sheet) {
      const headerValues = ['Timestamp', 'Assessment', 'TotalScore', 'Level', 'RawAnswers'];
      sheet = await doc.addSheet({ title: assessmentName, headerValues });
    }

    // Prepare row data
    const row = {
      Timestamp: timestamp || new Date().toISOString(),
      Assessment: assessmentName,
      TotalScore: score,
      Level: level,
      RawAnswers: JSON.stringify(answers)
    };

    // Add row
    await sheet.addRow(row);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error submitting assessment to Google Sheets:", error);
    return NextResponse.json({ success: false, error: 'Failed to save data' }, { status: 500 });
  }
}
