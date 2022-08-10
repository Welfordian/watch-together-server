const { State } = require('./State');
const { Commands } = require('./Commands');

class EventHandler {
    constructor(io) {
        this.io = io;
    }
    
    set_video_id(socket, {id}) {
        let roomid = [Array.from(socket.rooms)[1]];
        
        State.rooms[roomid].videoId = id;
        socket.to(roomid).emit('set_video_id', {id});
    }
    
    send_chat(socket, {message}) {
        let roomid = [Array.from(socket.rooms)[1]];
        let name = State.rooms[roomid]['users'][socket.id]['name'];
        let messageData = {sender: socket.id, name, self: false};
        
        message = Commands.detect(this.io, socket, message);
        
        if ('preventDefault' in message) return;
        
        if (message.isCommand) {
            messageData.message = message.message;
            messageData.isSystemMessage = true;
        } else {
            messageData.message = message.message;
        }

        this.io.to(roomid).emit('chat_message', messageData);
    }
    
    set_video_time(socket, {time, emit}) {
        let roomid = [Array.from(socket.rooms)[1]];

        State.rooms[roomid].time = time;
        
        if (emit) {
            socket.to(roomid).emit('set_video_time', time);
        }
    }
}

exports.eventHandler = EventHandler;