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

/**
 * Appends silent field blur lead telemetry data to our tracking spreadsheet
 * @param {Array} rowData - Array of values matching [Timestamp, Brand, Model, IssueDescription, PickupZone, Email, Phone, Name]
 */
export const appendTelemetryToSheet = async (rowData) => {
  try {
    // Attempt to append to a 'Telemetry' tab.
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Telemetry!A:H',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });
    console.log('📡 [Sheets Engine] Telemetry row successfully logged to Telemetry tab.');
  } catch (error) {
    // Fallback: If 'Telemetry' tab does not exist, log to 'Sheet1' with custom columns
    console.warn('⚠️ [Sheets Engine] Telemetry tab not found. Writing to Sheet1 fallback range Sheet1!H:O...');
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Sheet1!H:O',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [rowData],
        },
      });
      console.log('📡 [Sheets Engine] Telemetry successfully logged to Sheet1 fallback range.');
    } catch (fallbackError) {
      console.error('❌ [Sheets Engine] Telemetry write failed entirely:', fallbackError);
    }
  }
};