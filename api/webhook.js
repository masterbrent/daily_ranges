let ranges = {};

export default function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const body = req.body;
            console.log('Received webhook:', body);
            
            // Expected format: "MNQ|19425.50-19300.00"
            const [symbol, rangeData] = body.split('|');
            
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
            
            console.log(`Updated ${symbol} range: ${range}`);
            res.status(200).send('OK');
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(400).send('Error processing webhook');
        }
    } else if (req.method === 'GET') {
        res.status(200).json(ranges);
    } else {
        res.status(405).send('Method not allowed');
    }
}