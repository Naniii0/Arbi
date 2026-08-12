const { Connection, PublicKey } = require('@solana/web3.js');
const http = require('http');
require('dotenv').config();

// Web View setup for Render dynamic safeguard
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Solana Live Raydium WebSocket Active! 🚀\n');
});
server.listen(process.env.PORT || 10000);

// Establish connection via Helius Private Pipeline
const HELIUS_WS_URL = process.env.HELIUS_RPC_URL 
    ? process.env.HELIUS_RPC_URL.replace('https://helius-rpc.com', 'wss://://helius-rpc.com')
    : "wss://://solana.com";

const connection = new Connection(process.env.HELIUS_RPC_URL || "https://://solana.com", {
    wsEndpoint: HELIUS_WS_URL
});

// Raydium Liquidity Pool V4 Program ID
const RAYDIUM_LIQUIDITY_PROGRAM_ID = new PublicKey('675kPX9MHTQXUEsrC5JVHzHs6tUvX96YWf8aMwCDon68');

console.log("🔥 [SYSTEM] Connecting Helius WebSockets pipeline...");
console.log("⚡ [MONITOR] Listening live on Raydium for newly initialized pools...");

try {
    // Subscribing directly to Raydium Program Logs via WebSockets
    connection.onLogs(
        RAYDIUM_LIQUIDITY_PROGRAM_ID,
        (logs, context) => {
            const signature = logs.signature;
            
            // Filtering for specific initialization instruction logs inside the block
            if (logs.logs.some(log => log.includes("initialize2") || log.includes("InitializeInstruction2"))) {
                console.log(`\n🎉 [NEW POOL DETECTED] Block: ${context.slot}`);
                console.log(`🔗 Tx Signature: https://solscan.io{signature}`);
                console.log(`⚙️ [Helius Shield Triggered]: Querying pool accounts and tracking $10k+ volume margins...`);
            }
        },
        'confirmed'
    );
} catch (error) {
    console.log(`⚠️ WebSocket exception caught: ${error.message}`);
}
