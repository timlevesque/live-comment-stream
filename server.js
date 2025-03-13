// message-server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const PORT = process.env.MESSAGE_PORT || 5000;

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('WebSocket client connected to messaging service');

    ws.on('message', (message) => {
        console.log('Received message:', message);
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        console.log('WebSocket client disconnected from messaging service');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Messaging server running on http://localhost:${PORT}`);
});