const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { eventHandler } = require('./EventHandler');
const { State } = require('./State');
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});

State.setServer(io);

const EventHandler = new eventHandler(io);

io.on('connection', (socket) => {
    let roomid = socket.handshake.query.roomid;
    let name = socket.handshake.query.name;
    
    State.joinRoom(roomid, name, socket);
    
    socket.onAny(function (eventName, args) {
        try {
            EventHandler[eventName](socket, args);
        } catch (e) { console.log(e); }
    });

    socket.on("disconnect", () => {
        State.deleteRoom(roomid, name, socket);
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});