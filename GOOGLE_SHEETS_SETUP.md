# Free Automated Setup - Google Sheets

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet named "Trading Ranges"
3. Note the spreadsheet ID from URL:
   `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

## Step 2: Add Apps Script

1. In your sheet: **Extensions → Apps Script**
2. Delete any existing code
3. Copy all code from `google-apps-script.js`
4. Paste into script editor
5. Save (Ctrl+S)
6. Run the `setup()` function once to create headers

## Step 3: Deploy as Web App

1. Click **Deploy → New Deployment**
2. Settings:
   - Type: **Web app**
   - Description: "Trading Ranges Webhook"
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Click **Deploy**
4. **COPY THE WEB APP URL** - This is your webhook endpoint!
   - It looks like: `https://script.google.com/macros/s/{SCRIPT_ID}/exec`

## Step 4: Configure TradingView

For each symbol (MNQ, MES, MYM):

1. Create alert on Daily timeframe
2. Condition: "Once Per Bar Close"  
3. Alert actions: **Webhook URL**
4. Webhook URL: Your Google Apps Script URL
5. Message:
   ```
   {{ticker}}|{{high}}-{{low}}
   ```

## Step 5: Update Go Bridge

```go
func fetchFuturesRanges() (map[string]float64, error) {
    // Your Google Apps Script URL
    url := "https://script.google.com/macros/s/{YOUR_SCRIPT_ID}/exec"
    
    resp, err := http.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    var data map[string]struct {
        Range   float64 `json:"range"`
        Updated string  `json:"updated"`
    }
    
    if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
        return nil, err
    }
    
    ranges := make(map[string]float64)
    for symbol, info := range data {
        ranges[symbol] = info.Range
    }
    
    return ranges, nil
}
```

## Testing

1. Test webhook manually:
   ```bash
   curl -X POST -d "MNQ|125.50" YOUR_WEBHOOK_URL
   ```

2. Check sheet updated

3. Test GET:
   ```bash
   curl YOUR_WEBHOOK_URL
   ```

## Benefits

- ✅ Completely FREE (no credit card)
- ✅ Automated via TradingView webhooks
- ✅ Visual spreadsheet to verify data
- ✅ Can manually edit if needed
- ✅ Reliable Google infrastructure
- ✅ Built-in history tracking

## Alternative: Published Sheet

If webhooks fail, you can also:
1. File → Share → Publish to web
2. Format: CSV
3. Read CSV directly in Go

But the webhook approach is cleaner!