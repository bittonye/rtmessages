const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const UPDATE_INTERVAL = 100; /* 100 ms interval for client updates */
const UPDATE_TIMEOUT = 5 * 60 * 1000; /* 5 minutes interval */
const port = process.env.PORT || 4001;

let users = {};

const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response:  users}).status(200);
});
app.use(router);

const server = http.createServer(app);

const io = socketIo(server); // < Interesting!

/* Set connection interval for broadcast */
setInterval(
    () => {
        io.emit("update locations", users); /* Broadcast message to all clients */
    },
    UPDATE_INTERVAL,
);

io.on("connection", socket => {
    let uid = socket.id;
    console.log('New request from : ' + uid);

    let updateTimeout = setTimeout(() => {
        delete users[uid];
    }, UPDATE_TIMEOUT);

    socket.on("update id", function(id) {
        users[id] = users[uid];
        delete users[uid];
        let uid = id;
    });
    socket.on("update location", function(msg){
        updateTimeout.refresh();
        users[uid] = msg;
        console.table(msg);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        delete users[uid];
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = {
    users
};