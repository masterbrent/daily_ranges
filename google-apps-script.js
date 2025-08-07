// Google Apps Script - Paste this in Google Sheets Script Editor
// This creates a free webhook endpoint that TradingView can send to

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSheet();
    var data = e.postData.contents;
    
    // Parse "MNQ|19425.50-19300.00" or "MNQ|125.50"
    var parts = data.split('|');
    var symbol = parts[0];
    var rangeData = parts[1];
    
    var range;
    if (rangeData.includes('-')) {
      var prices = rangeData.split('-').map(parseFloat);
      range = Math.abs(prices[0] - prices[1]);
    } else {
      range = parseFloat(rangeData);
    }
    
    // Headers in row 1: Symbol | Range | Updated
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var found = false;
    
    // Update existing symbol
    for (var i = 1; i < values.length; i++) {
      if (values[i][0] === symbol) {
        sheet.getRange(i + 1, 2).setValue(range);
        sheet.getRange(i + 1, 3).setValue(new Date());
        found = true;
        break;
      }
    }
    
    // Add new symbol
    if (!found) {
      sheet.appendRow([symbol, range, new Date()]);
    }
    
    return ContentService.createTextOutput('OK');
    
  } catch(error) {
    console.error(error);
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  
  var result = {};
  
  // Skip header row
  for (var i = 1; i < values.length; i++) {
    if (values[i][0]) {
      result[values[i][0]] = {
        range: values[i][1],
        updated: values[i][2].toISOString()
      };
    }
  }
  
  var output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Allow cross-origin requests
  return output;
}

// Setup function - run once to create headers
function setup() {
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.clear();
  sheet.getRange(1, 1, 1, 3).setValues([['Symbol', 'Range', 'Updated']]);
  sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
}