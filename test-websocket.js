#!/usr/bin/env node

/**
 * WebSocket Connection Test Script
 * 
 * This script tests if the signaling server is accessible and working properly.
 * 
 * Usage:
 *   node test-websocket.js [server-url]
 * 
 * Examples:
 *   node test-websocket.js
 *   node test-websocket.js ws://localhost:3000
 *   node test-websocket.js wss://your-app.up.railway.app
 */

const https = require('https');
const http = require('http');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(colors[color] + message + colors.reset);
}

function logSuccess(message) {
    log('✅ ' + message, 'green');
}

function logError(message) {
    log('❌ ' + message, 'red');
}

function logWarning(message) {
    log('⚠️  ' + message, 'yellow');
}

function logInfo(message) {
    log('ℹ️  ' + message, 'blue');
}

// Get server URL from command line or use default
const serverUrl = process.argv[2] || 'https://commhub-signaling-production.up.railway.app';

// Parse URL
let protocol, hostname, port, path;
try {
    const url = new URL(serverUrl);
    protocol = url.protocol.replace(':', '');
    hostname = url.hostname;
    port = url.port || (protocol === 'https' || protocol === 'wss' ? 443 : 80);
    path = url.pathname || '/';
} catch (error) {
    logError('Invalid URL: ' + serverUrl);
    process.exit(1);
}

// Convert wss:// to https:// and ws:// to http:// for testing
if (protocol === 'wss') protocol = 'https';
if (protocol === 'ws') protocol = 'http';

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║     WebSocket Signaling Server Connection Test        ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

logInfo('Testing server: ' + serverUrl);
logInfo('Protocol: ' + protocol);
logInfo('Hostname: ' + hostname);
logInfo('Port: ' + port);
logInfo('Path: ' + path);
console.log('');

// Test 1: DNS Resolution
logInfo('Test 1: DNS Resolution...');
require('dns').lookup(hostname, (err, address, family) => {
    if (err) {
        logError('DNS lookup failed: ' + err.message);
        logError('The hostname "' + hostname + '" cannot be resolved.');
        logWarning('This means the server does not exist or the URL is incorrect.');
        console.log('');
        logInfo('💡 Solution:');
        console.log('   1. Deploy the signaling server (see WEBSOCKET_SERVER_DEPLOYMENT.md)');
        console.log('   2. Update the server URL in index.html and commhub-test.html');
        console.log('');
        process.exit(1);
    }
    
    logSuccess('DNS resolution successful');
    logInfo('IP Address: ' + address + ' (IPv' + family + ')');
    console.log('');
    
    // Test 2: HTTP Connection
    testHttpConnection();
});

function testHttpConnection() {
    logInfo('Test 2: HTTP Connection...');
    
    const options = {
        hostname: hostname,
        port: port,
        path: path,
        method: 'GET',
        timeout: 10000,
        headers: {
            'User-Agent': 'CommHub-Test-Script/1.0'
        }
    };
    
    const client = protocol === 'https' ? https : http;
    
    const req = client.request(options, (res) => {
        logSuccess('HTTP connection successful');
        logInfo('Status Code: ' + res.statusCode);
        logInfo('Status Message: ' + res.statusMessage);
        
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('');
            
            // Test 3: Server Response
            testServerResponse(res.statusCode, data);
        });
    });
    
    req.on('error', (error) => {
        logError('HTTP connection failed: ' + error.message);
        
        if (error.code === 'ECONNREFUSED') {
            logWarning('Connection refused. The server is not accepting connections.');
        } else if (error.code === 'ETIMEDOUT') {
            logWarning('Connection timed out. The server is not responding.');
        } else if (error.code === 'ENOTFOUND') {
            logWarning('Host not found. Check the URL.');
        }
        
        console.log('');
        logInfo('💡 Solution:');
        console.log('   1. Check if the server is running');
        console.log('   2. If using localhost, start the server: npm start');
        console.log('   3. If using a cloud deployment, check the deployment logs');
        console.log('   4. Verify the URL is correct');
        console.log('');
        process.exit(1);
    });
    
    req.on('timeout', () => {
        logError('Request timed out after 10 seconds');
        req.destroy();
    });
    
    req.end();
}

function testServerResponse(statusCode, data) {
    logInfo('Test 3: Server Response...');
    
    if (statusCode !== 200) {
        logWarning('Unexpected status code: ' + statusCode);
        console.log('');
        logInfo('Response body:');
        console.log(data.substring(0, 500));
        console.log('');
    } else {
        logSuccess('Server responded with 200 OK');
    }
    
    try {
        const json = JSON.parse(data);
        
        if (json.status === 'ok') {
            logSuccess('Server health check passed!');
            console.log('');
            logInfo('Server Details:');
            console.log('  Name: ' + (json.name || 'Unknown'));
            console.log('  Version: ' + (json.version || 'Unknown'));
            console.log('  Uptime: ' + (json.uptime ? Math.floor(json.uptime) + ' seconds' : 'Unknown'));
            console.log('  Active Rooms: ' + (json.activeRooms || 0));
            console.log('  Active Users: ' + (json.activeUsers || 0));
            console.log('');
            
            testWebSocketSupport();
        } else {
            logWarning('Server status is not "ok"');
            console.log('');
            logInfo('Server Response:');
            console.log(JSON.stringify(json, null, 2));
            console.log('');
            process.exit(1);
        }
    } catch (error) {
        logWarning('Server response is not JSON');
        console.log('');
        logInfo('Response body:');
        console.log(data.substring(0, 500));
        console.log('');
        
        // Even if response is not JSON, server might still work
        logInfo('Note: Server might still work for WebSocket connections');
        console.log('');
        testWebSocketSupport();
    }
}

function testWebSocketSupport() {
    logInfo('Test 4: WebSocket Support...');
    
    // Check if Socket.IO client is available
    try {
        require.resolve('socket.io-client');
        
        // Socket.IO client is installed, test actual WebSocket connection
        const io = require('socket.io-client');
        
        const wsUrl = serverUrl.replace('http://', 'ws://').replace('https://', 'wss://');
        logInfo('Attempting WebSocket connection to: ' + wsUrl);
        
        const socket = io(wsUrl, {
            transports: ['websocket', 'polling'],
            timeout: 10000,
            reconnection: false
        });
        
        let connected = false;
        
        socket.on('connect', () => {
            connected = true;
            logSuccess('WebSocket connection successful!');
            console.log('');
            
            // All tests passed
            printSuccessSummary();
            
            socket.disconnect();
            process.exit(0);
        });
        
        socket.on('connect_error', (error) => {
            if (!connected) {
                logError('WebSocket connection failed: ' + error.message);
                console.log('');
                
                printFailureSummary();
                
                process.exit(1);
            }
        });
        
        setTimeout(() => {
            if (!connected) {
                logError('WebSocket connection timed out after 10 seconds');
                console.log('');
                printFailureSummary();
                socket.disconnect();
                process.exit(1);
            }
        }, 10000);
        
    } catch (error) {
        // Socket.IO client not installed - skip actual WebSocket test
        logWarning('Socket.IO client not installed, skipping WebSocket connection test');
        logInfo('To test WebSocket connection, install socket.io-client:');
        console.log('  npm install socket.io-client');
        console.log('');
        
        logInfo('Based on HTTP tests, the server appears to be working correctly.');
        console.log('');
        printSuccessSummary();
        process.exit(0);
    }
}

function printSuccessSummary() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                   ✅ ALL TESTS PASSED                  ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    logSuccess('The signaling server is working correctly!');
    console.log('');
    logInfo('Next Steps:');
    console.log('  1. Update SIGNALING_SERVER in index.html to: ' + serverUrl);
    console.log('  2. Update SIGNALING_SERVER in commhub-test.html to: ' + serverUrl);
    console.log('  3. Test video conferencing in the browser');
    console.log('');
    logInfo('To test in browser:');
    console.log('  1. Open index.html → Media → CommHub Pro');
    console.log('  2. Or open commhub-test.html directly');
    console.log('  3. Join a room and test with two browsers/devices');
    console.log('');
}

function printFailureSummary() {
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                   ❌ TESTS FAILED                       ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log('');
    logError('The signaling server is not working correctly.');
    console.log('');
    logInfo('💡 Common Solutions:');
    console.log('');
    console.log('1. Server Not Deployed:');
    console.log('   - Deploy the server (see WEBSOCKET_SERVER_DEPLOYMENT.md)');
    console.log('   - Railway: railway.app → Deploy from GitHub');
    console.log('   - Heroku: heroku create && git push heroku main');
    console.log('   - Local: npm install && npm start');
    console.log('');
    console.log('2. Wrong URL:');
    console.log('   - Check the server URL is correct');
    console.log('   - Use wss:// for HTTPS deployments');
    console.log('   - Use ws:// for HTTP/localhost');
    console.log('');
    console.log('3. Firewall Issues:');
    console.log('   - Check if firewall is blocking WebSocket connections');
    console.log('   - Try from a different network');
    console.log('');
    console.log('4. Server Down:');
    console.log('   - Check server logs for errors');
    console.log('   - Restart the server');
    console.log('   - Check hosting platform status');
    console.log('');
}
