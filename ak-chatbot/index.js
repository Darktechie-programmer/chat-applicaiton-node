const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 3000;

// http request handle by app : express
// middle ware
app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
    res.sendFile("public/index.html");
});
// all not valid path handled
app.get("*", (req, res) => {
    res.redirect("/");
});

const users = {};

// websocket request handle by Socket.io
io.on("connection", (socket) => {
    // new user join event
    socket.on("new-user-joined", (name) => {
        users[socket.id] = name;
        socket.broadcast.emit("user-joined", name);
    });

    socket.on("send", (message) => {
        socket.broadcast.emit("receive", {
            message: message,
            name: users[socket.id],
        });
    });
});

server.listen(port, () => console.log(`listening on http://localhost:${port}`));
