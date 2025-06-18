import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join client-specific room
    socket.on('join-client-room', (clientId) => {
      socket.join(`client-${clientId}`);
      console.log(`Client ${clientId} joined room: client-${clientId}`);
    });

    // Join general projects room for all users
    socket.on('join-projects-room', () => {
      socket.join('projects');
      console.log('Client joined projects room');
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Emit project events
export const emitProjectEvent = (event, data, clientId = null) => {
  if (!io) return;

  // Emit to specific client room
  if (clientId) {
    io.to(`client-${clientId}`).emit(event, data);
  }

  // Emit to general projects room
  io.to('projects').emit(event, data);
};
