// Google Apps Script Code for Cash Counter
// Create a new Google Sheet, go to Extensions > Apps Script, and paste this code.
// Publish > Deploy as web app > Execute as: Me > Who has access: Anyone.

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = 'CashCounter'; // Ensure this matches your sheet name
    var sheet = doc.getSheetByName(sheetName);

    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      // Add headers including the new fields
      sheet.appendRow(['Date', '500', '200', '100', '50', '20', '10', '5', '2', '1', 'Total', 'Week Expenses', 'Adjust Amount', 'A/C Paid', 'Remarks', ]);
      sheet.getRange(1, 1, 1, 15).setFontWeight('bold').setBackground('#e0f2f1'); // Light teal background
    }

    var data = JSON.parse(e.postData.contents);

    // Prepare the row data
    var row = [
      data.date,
      data.weekExpenses || 0,   // New Field: Week Expenses
      data.adjustAmount || 0,   // New Field: Adjust Amount
      data.acPaid || 0,         // New Field: A/C Paid
      data.remarks || '',       // New Field: Remarks
      data.d500 || 0,
      data.d200 || 0,
      data.d100 || 0,
      data.d50 || 0,
      data.d20 || 0,
      data.d10 || 0,
      data.d5 || 0,
      data.d2 || 0,
      data.d1 || 0,
      data.total || 0
    ];

    // Append the row
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success', 'row': row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
