# Sample test file for local testing
# Run with: node test-webhook.js

const http = require('http');

// Test data
const testData = 'MNQ|19425.50-19300.00';

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/webhook',
    method: 'POST',
    headers: {
        'Content-Type': 'text/plain',
        'Content-Length': testData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`Status: ${res.statusCode}`);
    
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.write(testData);
req.end();

console.log('Sent test webhook:', testData);