import { io } from 'socket.io-client';

const SOCKET_URL = 'https://drivertracker.createdinam.com'; // Replace with your server's URL

// Create and export the socket instance
const socket = io(SOCKET_URL, {
    // autoConnect: false, // Optionally disable auto-connect to control when the connection starts
    secure: true,
    transports: ['websocket']
});

export default socket;
