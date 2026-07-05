import { Server } from 'socket.io';

let io;
const userSockets = new Map(); // Maps userId -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      // 💎 Ensures that local testing AND your live Netlify frontend domain are both authorized
      origin: [process.env.FRONTEND_URL, "http://localhost:5173"].filter(Boolean),
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    socket.on('register_user', (userId) => {
      if (userId) {
        userSockets.set(userId.toString(), socket.id);
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const sendLiveNotification = (userId, notificationData) => {
  if (io) {
    const socketId = userSockets.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit('new_notification', notificationData);
    }
  }
};