const express = require('express');
const fs = require('fs').promises;
const app = express();

app.use(express.text()); // Parse raw text body

// Store ranges in memory (resets on restart)
let ranges = {};

// Load ranges from file on startup
async function loadRanges() {
    try {
        const data = await fs.readFile('ranges.json', 'utf8');
        ranges = JSON.parse(data);
        console.log('Loaded ranges from file:', ranges);
    } catch (e) {
        console.log('No existing ranges file, starting fresh');
    }
}

loadRanges();

// POST endpoint for TradingView webhooks
app.post('/webhook', async (req, res) => {
    try {
        console.log('Received webhook:', req.body);
        
        // Expected format: "MNQ|19425.50-19300.00"
        const [symbol, rangeData] = req.body.split('|');
        
        let range;
        if (rangeData.includes('-')) {
            const [high, low] = rangeData.split('-').map(parseFloat);
            range = high - low;
        } else {
            range = parseFloat(rangeData);
        }
        
        ranges[symbol] = {
            range: range,
            updated: new Date().toISOString()
        };
        
        // Write to file for persistence
        await fs.writeFile('ranges.json', JSON.stringify(ranges, null, 2));
        
        console.log(`Updated ${symbol} range: ${range}`);
        res.send('OK');
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send('Error processing webhook');
    }
});

// GET endpoint for Go app
app.get('/ranges', async (req, res) => {
    res.json(ranges);
});

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Range Webhook Server Running');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});