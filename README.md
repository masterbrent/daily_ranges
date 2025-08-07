# Daily Ranges Webhook

Simple webhook receiver for TradingView to send daily futures ranges.

## Setup

1. Deploy to Digital Ocean App Platform
2. Set TradingView alerts to send to: `https://your-app-name.ondigitalocean.app/webhook`
3. Access ranges at: `https://your-app-name.ondigitalocean.app/ranges`

## TradingView Alert Format

```
MNQ|19425.50-19300.00
```

Or just the range value:
```
MNQ|125.50
```

## API Endpoints

- `POST /webhook` - Receives data from TradingView
- `GET /ranges` - Returns all ranges as JSON
- `GET /` - Health check

## Example Response

```json
{
  "MNQ": {
    "range": 125.50,
    "updated": "2025-08-07T14:30:00.000Z"
  },
  "MES": {
    "range": 32.25,
    "updated": "2025-08-07T14:30:00.000Z"
  },
  "MYM": {
    "range": 98.00,
    "updated": "2025-08-07T14:30:00.000Z"
  }
}
```