// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const SocketContext = createContext();

// export const useSocket = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error('useSocket must be used within a SocketProvider');
//   }
//   return context;
// };

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [connected, setConnected] = useState(false);
//   const [reconnecting, setReconnecting] = useState(false);

//   useEffect(() => {
//     const newSocket = io('http://localhost:3000', {
//       transports: ['websocket', 'polling'],
//       reconnection: true,
//       reconnectionDelay: 1000,
//       reconnectionAttempts: 5,
//       timeout: 20000,
//     });

//     newSocket.on('connect', () => {
//       console.log('Connected to server');
//       setConnected(true);
//       setReconnecting(false);
      
//       // Auto-join rooms if client is logged in
//       const clientId = localStorage.getItem("client_id") || sessionStorage.getItem("client_id");
//       if (clientId) {
//         newSocket.emit('join-client-room', clientId);
//         newSocket.emit('join-projects-room');
//       }
//     });

//     newSocket.on('disconnect', (reason) => {
//       console.log('Disconnected from server:', reason);
//       setConnected(false);
//     });

//     newSocket.on('reconnect_attempt', () => {
//       console.log('Attempting to reconnect...');
//       setReconnecting(true);
//     });

//     newSocket.on('reconnect', () => {
//       console.log('Reconnected to server');
//       setConnected(true);
//       setReconnecting(false);
      
//       // Re-join rooms after reconnection
//       const clientId = localStorage.getItem("client_id") || sessionStorage.getItem("client_id");
//       if (clientId) {
//         newSocket.emit('join-client-room', clientId);
//         newSocket.emit('join-projects-room');
//       }
//     });

//     newSocket.on('reconnect_failed', () => {
//       console.log('Failed to reconnect to server');
//       setReconnecting(false);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   const joinClientRoom = (clientId) => {
//     if (socket && clientId) {
//       socket.emit('join-client-room', clientId);
//       socket.emit('join-projects-room');
//       console.log(`Joined rooms for client: ${clientId}`);
//     }
//   };

//   const leaveClientRoom = (clientId) => {
//     if (socket && clientId) {
//       socket.emit('leave-client-room', clientId);
//       console.log(`Left rooms for client: ${clientId}`);
//     }
//   };

//   const value = {
//     socket,
//     connected,
//     reconnecting,
//     joinClientRoom,
//     leaveClientRoom
//   };

//   return (
//     <SocketContext.Provider value={value}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
