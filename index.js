const { Connection } = require('@solana/web3.js');
const axios = require('axios');
const http = require('http');
require('dotenv').config();

// 1. Dummy Web View code layout
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Solana Arbitrage Bot is Active and Running! 🚀\n');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`🌍 Dummy Web View active on port ${PORT}`);
});

// 2. Continuous Safe Loop Logic (Interval freeze bypass cheyadaniki)
async function startBot() {
    console.log("🚀 Bot Core Triggered! Starting scan pipeline...");
    
    while (true) { // Infinite live loop setup
        try {
            console.log(`⏱️ [${new Date().toLocaleTimeString()}] Fetching token metrics from Jupiter...`);
            
            const tokenList = await axios.get('https://jup.ag');
            const tokens = tokenList.data.slice(0, 5); // Start with top 5 tokens for smooth rate limits

            for (let token of tokens) {
                let tokenAddress = token.address;
                
                // Fetching quotes safely
                const rayQuote = await axios.get(`https://jup.ag{tokenAddress}&amount=100000000&dexes=raydium`).catch(() => null);
                const orcaQuote = await axios.get(`https://jup.ag{tokenAddress}&amount=100000000&dexes=orca`).catch(() => null);

                if (rayQuote && orcaQuote) {
                    let rayPrice = parseInt(rayQuote.data.outAmount);
                    let orcaPrice = parseInt(orcaQuote.data.outAmount);
                    let priceDiff = Math.abs(rayPrice - orcaPrice) / Math.max(rayPrice, orcaPrice) * 100;

                    console.log(`🔍 [${token.symbol}] Variance: ${priceDiff.toFixed(2)}% | R: ${rayPrice} | O: ${orcaPrice}`);
                }
            }
        } catch (error) {
            console.log(`⚠️ Network glitch caught: ${error.message}. Cool down for retry...`);
        }
        
        // 5 seconds gatti gap for next block scan
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

// Initial start hit
startBot();
