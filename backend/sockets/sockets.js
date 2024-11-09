const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const cors = require("cors");
const logger = require("../utils/loggerUtil");

const app = express();

// Configure CORS for Express
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // { userId: socketId }
const activeRooms = new Map(); // Store active video call rooms

io.on("connection", (socket) => {
    logger.info("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // Emit online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle video call room creation
    socket.on("room:create", ({ roomId, userId }) => {
        activeRooms.set(roomId, {
            creator: userId,
            participants: [userId]
        });
        socket.join(roomId);
        logger.info(`Room created: ${roomId} by user: ${userId}`);
    });

    // Handle call request
    socket.on("call:request", ({ from, to, roomId }) => {
        const toSocketId = userSocketMap[to];
        if (toSocketId) {
            io.to(toSocketId).emit("call:incoming", {
                from,
                roomId
            });
        }
    });

    // Handle call acceptance
    socket.on("call:accept", ({ roomId, userId }) => {
        const room = activeRooms.get(roomId);
        if (room) {
            room.participants.push(userId);
            socket.join(roomId);
            io.to(roomId).emit("call:accepted", { userId });
        }
    });

    // Handle call rejection
    socket.on("call:reject", ({ roomId, userId }) => {
        const toSocketId = userSocketMap[room.creator];
        if (toSocketId) {
            io.to(toSocketId).emit("call:rejected", { userId });
        }
    });

    // Handle call end
    socket.on("call:end", ({ roomId }) => {
        if (activeRooms.has(roomId)) {
            io.to(roomId).emit("call:ended");
            activeRooms.delete(roomId);
        }
    });

    socket.on("disconnect", () => {
        logger.info("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server };
