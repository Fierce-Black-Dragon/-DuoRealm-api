// socketHandler.js

import { Socket, Server } from "socket.io";
const connectedUsers = new Set();

// socketHandler.ts


interface UserData {
  _id: string;
}

function handleSocket(io: Server, socket: Socket) {
  console.log("Connected to socket.io");

  socket.on("setup", (userData: UserData) => {
    if (connectedUsers.has(userData._id)) {
      console.log("User already connected:", userData);
      return;
    }

    connectedUsers.add(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room: string) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on("new message", (newMessageReceived: any) => {
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

export default handleSocket;
