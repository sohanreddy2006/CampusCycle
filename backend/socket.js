const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('./config/config');

let io = null;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Not authorized, no token'));
      }
      const decoded = jwt.verify(token, config.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Not authorized, token failed'));
    }
  });

  io.on('connection', (socket) => {
    socket.join(`user:${socket.userId}`);
  });

  return io;
};

const emitToUser = (userId, event, payload) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, payload);
  }
};

module.exports = { initSocket, emitToUser };
