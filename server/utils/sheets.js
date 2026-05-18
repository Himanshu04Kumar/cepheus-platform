import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

// Format the private key cleanly to handle accidental string newline escapes
const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY
  ? process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

// Configure the Google JWT client for machine-to-machine authentication
const auth = new google.auth.JWT(
  process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  null,
  privateKey,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

/**
 * Appends a verified transaction record row to our tracking spreadsheet audit trail
 * @param {Array} rowData - Array of values matching [Timestamp, OrderID, Receipt, Amount, Currency, Status]
 */
export const appendTransactionToSheet = async (rowData) => {
  try {
    // Target 'Sheet1' using a standard spreadsheet append operational directive
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });
    console.log('📡 [Sheets Engine] Row audit trail successfully appended to Google Cloud.');
  } catch (error) {
    console.error('❌ [Sheets Engine] Error writing row entry to spreadsheet matrix:', error);
    // Silent fail mitigation so payment processing isn't blocked by reporting hiccups
  }
};