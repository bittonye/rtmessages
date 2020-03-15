const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const UPDATE_INTERVAL = 100; /* 100 ms interval for client updates */
const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

const users = {};
        
io.on("connection", socket => {
    users[socket.id] = {};
    console.log("New client connected"), setInterval(
        () => {
            io.emit("update locations", users); /* Broadcast message to all clients */
        },
        UPDATE_INTERVAL,
    );
    socket.on("update location", function(msg){
        users[socket.id] = msg;
        console.table(msg);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        users[socket.id] = {};
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
