const socketIo = require('socket.io');

let io;

const initSocket = (server) => {
    io = socketIo(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        // Client joins a room with the tracking ID
        socket.on('joinTrack', (trackingId) => {
            socket.join(trackingId);
            console.log(`Socket ${socket.id} joined tracking room ${trackingId}`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initSocket, getIo };
