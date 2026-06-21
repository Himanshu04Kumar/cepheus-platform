import { appendTelemetryToSheet } from '../utils/sheets.js';

/**
 * Captures half-filled lead details on input field blur and logs them to Google Sheets.
 * ROUTE: POST /api/sheets/log-blur
 */
export const logBlurTelemetry = async (req, res) => {
  try {
    const { brand, model, issueDescription, pickupZone, email, phone, name } = req.body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const rowData = [
      timestamp,
      brand || 'Unknown Brand',
      model || 'Unknown Model',
      issueDescription || 'Initial Field Blur Check',
      pickupZone || 'Central Delhi',
      email || 'Not Provided Yet',
      phone || 'Not Provided Yet',
      name || 'Not Provided Yet'
    ];

    // Log telemetry to Google Sheets
    await appendTelemetryToSheet(rowData);

    return res.status(200).json({
      success: true,
      message: 'Telemetry logged successfully.'
    });
  } catch (error) {
    console.error('❌ [Sheets Telemetry Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process telemetry logs.'
    });
  }
};
