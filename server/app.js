const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const connect = require("./dbconnect");
const app = express();
const port = 8080; // default port to listen

const server = http.createServer(app);
const io = new Server(server)
const userRoute = require("./apis/api");
const User = require("./models/User");
connect();

// Middleware to parse JSON request bodies
app.use(express.json());
app.use("/api", userRoute)

io.on('connection', (socket) => {
    // update loacation
    socket.on('updateLocation', async ({ userId, latitude, longitude, heading }) => {
        try {
            // Update location in the database
            const user = await User.findById(userId);
            if (user) {
                const location = { latitude, longitude, heading, timestamp: new Date() };
                user.locations.push(location); // Save location history
                await user.save();

                // Emit the location to all viewers (User B);
                io.emit('locationUpdate', { 'success': true, data: { userId, latitude, longitude, heading } });
            }
        } catch (error) {
            console.error('Error updating location:', error.message);
        }
    });
    // Listen for custom events from the client |
    socket.on('message', (data) => {
        console.log('Received message from client:', data);
        io.emit("hello", data?.text);
    });

    // Disconnect event
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
    setTimeout(() => {
        io.emit("hello", "world");
    }, 3000);
    setTimeout(() => {
        io.emit("hello", "you know ");
    }, 7000);
    setTimeout(() => {
        io.emit("hello", "we are great");
    }, 10000);


});

// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});

server.listen(4001, () => {
    console.log("listening on *:4001");
});