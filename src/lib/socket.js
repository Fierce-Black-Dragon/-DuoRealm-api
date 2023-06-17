"use strict";
// socketHandler.js
Object.defineProperty(exports, "__esModule", { value: true });
const connectedUsers = new Set();
function handleSocket(io, socket) {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        if (connectedUsers.has(userData._id)) {
            console.log("User already connected:", userData);
            return;
        }
        connectedUsers.add(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("new message", (newMessageReceived) => {
        console.log("test00");
        socket.in(newMessageReceived.chatId).emit("message test", newMessageReceived);
    });
    socket.on("disconnect", () => {
        console.log("Socket disconnected");
        for (const [userId, socketId] of io.sockets.adapter.rooms.entries()) {
            if (socketId.has(socket.id)) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
}
exports.default = handleSocket;
