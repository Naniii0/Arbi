const { Connection } = require('@solana/web3.js');
const axios = require('axios');
const http = require('http'); // Dummy server kosam
require('dotenv').config();

// 1. Render Free Tier nidra pokunda undadaniki Dummy Server Setup
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Solana Arbitrage Bot is Active and Running! 🚀\n');
});

// Port configuration Render dynamic ga pickup chesthundi
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🌍 Dummy Web View active on port ${PORT}`);
});

// 2. Real Bot Core logic
const connection = new Connection(process.env.HELIUS_RPC_URL || "https://solana.com");
console.log("🚀 Bot Started! Scanning high liquidity pools...");

async function monitorNewPools() {
    try {
        const tokenList = await axios.get('https://jup.ag');
        const tokens = tokenList.data.slice(0, 20); 

        for (let token of tokens) {
            let tokenAddress = token.address;
            
            const rayQuote = await axios.get(`https://jup.ag{tokenAddress}&amount=1000000000&dexes=raydium`);
            const orcaQuote = await axios.get(`https://jup.ag{tokenAddress}&amount=1000000000&dexes=orca`);

            let rayPrice = rayQuote.data.outAmount;
            let orcaPrice = orcaQuote.data.outAmount;
            let priceDiff = Math.abs(rayPrice - orcaPrice) / Math.max(rayPrice, orcaPrice) * 100;

            console.log(`Checking token: ${token.symbol} | Variation: ${priceDiff.toFixed(2)}%`);

            if (priceDiff > 15) {
                console.log(`🚨 OPPORTUNITY DETECTED on ${token.symbol}! Variance: ${priceDiff.toFixed(2)}%`);
            }
        }
    } catch (e) { }
}

setInterval(monitorNewPools, 10000);
