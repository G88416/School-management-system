#!/usr/bin/env node

/**
 * CommHub Pro Signaling Server
 * 
 * This is a simple WebSocket signaling server for WebRTC connections.
 * It handles peer discovery and ICE candidate exchange for video conferencing.
 * 
 * Usage:
 *   node signaling-server.js [port]
 * 
 * Example:
 *   node signaling-server.js 3000
 * 
 * Deploy:
 *   - Railway: Connect GitHub repo and deploy
 *   - Heroku: heroku create && git push heroku main
 *   - Local: node signaling-server.js
 */

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

// Configuration
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['*']; // Allow all origins in development

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Configure CORS
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));

// Configure Socket.IO with CORS
const io = socketIO(server, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// Store active rooms and users
const rooms = new Map(); // roomId -> Set of socket IDs
const users = new Map(); // socket.id -> { roomId, username }

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        name: 'CommHub Pro Signaling Server',
        version: '1.0.0',
        uptime: process.uptime(),
        activeRooms: rooms.size,
        activeUsers: users.size,
        timestamp: new Date().toISOString()
    });
});

// Health check for monitoring
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    console.log(`[${new Date().toISOString()}] Client connected: ${socket.id}`);
    
    // Handle room join
    socket.on('join-room', (roomId, username) => {
        try {
            // Validate inputs
            if (!roomId || typeof roomId !== 'string' || roomId.length > 100) {
                socket.emit('error', { message: 'Invalid room ID' });
                return;
            }
            
            if (!username || typeof username !== 'string' || username.length > 50) {
                username = 'Anonymous';
            }
            
            // Sanitize inputs
            roomId = roomId.replace(/[^a-zA-Z0-9-_]/g, '').substring(0, 50);
            username = username.substring(0, 50);
            
            console.log(`[${new Date().toISOString()}] User ${username} (${socket.id}) joining room: ${roomId}`);
            
            // Leave previous room if any
            const prevData = users.get(socket.id);
            if (prevData && prevData.roomId) {
                socket.leave(prevData.roomId);
                const prevRoom = rooms.get(prevData.roomId);
                if (prevRoom) {
                    prevRoom.delete(socket.id);
                    if (prevRoom.size === 0) {
                        rooms.delete(prevData.roomId);
                    }
                }
            }
            
            // Join new room
            socket.join(roomId);
            
            // Update room data
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }
            rooms.get(roomId).add(socket.id);
            
            // Update user data
            users.set(socket.id, { roomId, username });
            
            // Notify existing users in room
            socket.to(roomId).emit('user-connected', socket.id, username);
            
            // Send confirmation to joining user
            socket.emit('joined-room', roomId, Array.from(rooms.get(roomId)).filter(id => id !== socket.id));
            
            console.log(`[${new Date().toISOString()}] Room ${roomId} now has ${rooms.get(roomId).size} users`);
            
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in join-room:`, error);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });
    
    // Handle WebRTC offer
    socket.on('offer', (targetUserId, description) => {
        try {
            console.log(`[${new Date().toISOString()}] Forwarding offer from ${socket.id} to ${targetUserId}`);
            io.to(targetUserId).emit('offer', socket.id, description);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in offer:`, error);
        }
    });
    
    // Handle WebRTC answer
    socket.on('answer', (targetUserId, description) => {
        try {
            console.log(`[${new Date().toISOString()}] Forwarding answer from ${socket.id} to ${targetUserId}`);
            io.to(targetUserId).emit('answer', socket.id, description);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in answer:`, error);
        }
    });
    
    // Handle ICE candidate
    socket.on('candidate', (targetUserId, candidate) => {
        try {
            io.to(targetUserId).emit('candidate', socket.id, candidate);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in candidate:`, error);
        }
    });
    
    // Handle chat message
    socket.on('chat', (message) => {
        try {
            const userData = users.get(socket.id);
            if (userData && userData.roomId) {
                socket.to(userData.roomId).emit('chat', userData.username, message);
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in chat:`, error);
        }
    });
    
    // Handle reaction
    socket.on('reaction', (emoji) => {
        try {
            const userData = users.get(socket.id);
            if (userData && userData.roomId) {
                socket.to(userData.roomId).emit('reaction', emoji);
            }
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in reaction:`, error);
        }
    });
    
    // Handle incoming call request
    socket.on('call-user', (targetUserId, callData) => {
        try {
            console.log(`[${new Date().toISOString()}] Call request from ${socket.id} to ${targetUserId}`);
            io.to(targetUserId).emit('incoming-call', {
                ...callData,
                callerId: socket.id
            });
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in call-user:`, error);
        }
    });
    
    // Handle call declined
    socket.on('call-declined', (callerId) => {
        try {
            io.to(callerId).emit('call-declined', socket.id);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] Error in call-declined:`, error);
        }
    });
    
    // Handle leave room
    socket.on('leave-room', () => {
        handleDisconnect(socket);
    });
    
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log(`[${new Date().toISOString()}] Client disconnected: ${socket.id}`);
        handleDisconnect(socket);
    });
    
    // Helper function to handle disconnect
    function handleDisconnect(socket) {
        const userData = users.get(socket.id);
        if (userData && userData.roomId) {
            const room = rooms.get(userData.roomId);
            if (room) {
                room.delete(socket.id);
                
                // Notify others in room
                socket.to(userData.roomId).emit('user-disconnected', socket.id, userData.username);
                
                // Clean up empty room
                if (room.size === 0) {
                    rooms.delete(userData.roomId);
                    console.log(`[${new Date().toISOString()}] Room ${userData.roomId} is now empty and removed`);
                }
            }
        }
        users.delete(socket.id);
    }
});

// Start server
server.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║   CommHub Pro Signaling Server                       ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}`);
    console.log(`🌐 HTTP endpoint: http://localhost:${PORT}`);
    console.log('');
    console.log('Health check: http://localhost:${PORT}/health');
    console.log('');
    console.log('Ready to accept connections...');
    console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

// Error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
