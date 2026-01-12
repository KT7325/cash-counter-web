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
      sheet.appendRow(['Date', '500', '200', '100', '50', '20', '10', '5', '2', '1', 'Total', 'Week Expenses', 'Adjust Amount', 'ATM Withdrawal', 'A/C Paid', 'Remarks']);
      sheet.getRange(1, 1, 1, 16).setFontWeight('bold').setBackground('#e0f2f1'); // Light teal background
    }

    var data = JSON.parse(e.postData.contents);

    // Prepare the row data
    var row = [
      data.date,
      data.d500 || 0,
      data.d200 || 0,
      data.d100 || 0,
      data.d50 || 0,
      data.d20 || 0,
      data.d10 || 0,
      data.d5 || 0,
      data.d2 || 0,
      data.d1 || 0,
      data.total || 0,
      data.weekExpenses || 0,   // New Field: Week Expenses
      data.adjustAmount || 0,   // New Field: Adjust Amount
      data.atmWithdrawal || 0,  // New Field: ATM Withdrawal
      data.acPaid || 0,         // New Field: A/C Paid
      data.remarks || ''        // New Field: Remarks
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
function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();

    // 1. Get Data from Main Sheet (CashCounter)
    var sheetName = 'CashCounter';
    var sheet = doc.getSheetByName(sheetName);
    var result = [];

    if (sheet) {
      var data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        var headers = data[0];
        var rows = data.slice(1);

        // Convert to array of objects
        result = rows.map(function(row) {
          var obj = {};
          headers.forEach(function(header, index) {
            obj[header] = row[index];
          });
          return obj;
        });

        // Reverse to show latest first
        result.reverse();
      }
    }

    // 2. Get Data from Sheet2 (Example: Reading Cell A1)
    var sheet2 = doc.getSheetByName('Sheet2');
    var sheet2Data = null;
    if (sheet2) {
      // Change "A1" to whichever cell you want to read
      sheet2Data = sheet2.getRange("A1").getValue();
    }

    // 3. Return both sets of data
    var responsePayload = {
      reports: result,
      sheet2Data: sheet2Data
    };

    return ContentService.createTextOutput(JSON.stringify(responsePayload))
        .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
