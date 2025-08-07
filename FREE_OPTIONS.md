# Daily Ranges - Free Options

Since most "free" services now require credit cards, here are truly free alternatives:

## Option 1: Google Sheets + Apps Script (RECOMMENDED)

1. Create a Google Sheet
2. Go to Extensions → Apps Script
3. Paste this code:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = e.postData.contents;
  
  // Parse "MNQ|125.50"
  var parts = data.split('|');
  var symbol = parts[0];
  var range = parts[1];
  
  // If range has high-low format
  if (range.includes('-')) {
    var prices = range.split('-');
    range = parseFloat(prices[0]) - parseFloat(prices[1]);
  }
  
  // Find or create row for symbol
  var lastRow = sheet.getLastRow();
  var found = false;
  
  for (var i = 1; i <= lastRow; i++) {
    if (sheet.getRange(i, 1).getValue() == symbol) {
      sheet.getRange(i, 2).setValue(range);
      sheet.getRange(i, 3).setValue(new Date());
      found = true;
      break;
    }
  }
  
  if (!found) {
    sheet.appendRow([symbol, range, new Date()]);
  }
  
  return ContentService.createTextOutput('OK');
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  var result = {};
  for (var i = 0; i < data.length; i++) {
    if (data[i][0]) {
      result[data[i][0]] = {
        range: data[i][1],
        updated: data[i][2]
      };
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Deploy → New Deployment → Web App
5. Execute as: Me
6. Who has access: Anyone
7. Get the URL - this is your webhook!

## Option 2: Use a Simple JSON File on GitHub

1. Create `ranges.json` in your repo
2. TradingView can't directly update it, but you can:
   - Update manually once per day
   - Use IFTTT (free tier) to update via email
   - Use Zapier free tier

## Option 3: Glitch.com (Free, No Card)

Glitch keeps apps awake when pinged. Create free project there.

## Option 4: Replit (Free Tier Available)

Has a free tier for simple apps.

## My Recommendation

Use Google Sheets! It's:
- Completely free
- No credit card
- Always available
- Easy to update manually if webhooks fail
- Your Go app can read it via the published URL