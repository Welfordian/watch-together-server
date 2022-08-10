class State {
    constructor() {
        this.io = null;
        this.rooms = {};
    }
    
    setServer(io) {
        this.io = io;
    }
    
    joinRoom(roomid, name, socket) {
        socket.join(roomid);
        
        if (! (roomid in this.rooms)) {
            this.rooms[roomid] = {
                owner: socket.id,
                videoId: false,
                time: 0,
                users: {[socket.id]: {
                    socketid: socket.id,
                    name
                }}
            }
        } else {
            this.rooms[roomid]['users'][socket.id] = {
                socketid: socket.id,
                name
            };
        }

        socket.emit('initial_response', {socketId: socket.id, ...this.rooms[roomid]});
        socket.to([roomid]).emit('system_message', {message: `${name} joined the chat`});
        socket.to([roomid]).emit('presence_update_join', {socketId: socket.id, ...this.rooms[roomid]});
    }
    
    deleteRoom(roomid, name, socket) {
        socket.leave(roomid);
        
        if (roomid in this.rooms && Object.keys(this.rooms[roomid].users).length === 1) {
            delete this.rooms[roomid];
        } else {
            this.io.to([roomid]).emit('system_message', {message: `${this.rooms[roomid]['users'][socket.id]['name']} left the chat`});
            delete this.rooms[roomid]['users'][socket.id];
            
            if (this.rooms[roomid].owner === socket.id) {
                this.rooms[roomid].owner = this.rooms[roomid]['users'][Object.keys(this.rooms[roomid]['users'])[0]];
            }
        }

        this.io.to([roomid]).emit('presence_update_leave', this.rooms[roomid]);
    }
    
    emitSystemMessage(socket, message) {
        socket.emit('chat_message', {isSystemMessage: true, message});
    }
    
    broadcastSystemMessage(socket, message) {
        let roomid = [Array.from(socket.rooms)[1]];
        
        this.io.to(roomid).emit('chat_message', {isSystemMessage: true, message});
    }
    
    broadcastToRoom(socket, message, args = {}) {
        let roomid = [Array.from(socket.rooms)[1]];

        this.io.to(roomid).emit(message, args);
    }
}

exports.State = new State();