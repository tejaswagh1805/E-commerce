// Keep Render backend awake by pinging every 5 minutes
const https = require('https');

const BACKEND_URL = 'https://ecommerce-shop-1osw.onrender.com/health';
const INTERVAL = 5 * 60 * 1000; // 5 minutes

function pingBackend() {
    https.get(BACKEND_URL, (res) => {
        console.log(`✅ Ping successful - Status: ${res.statusCode} - ${new Date().toLocaleTimeString()}`);
    }).on('error', (err) => {
        console.error(`❌ Ping failed: ${err.message}`);
    });
}

// Ping immediately on start
pingBackend();

// Then ping every 5 minutes
setInterval(pingBackend, INTERVAL);

console.log('🚀 Keep-alive service started. Pinging backend every 5 minutes...');
