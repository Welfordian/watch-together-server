class BaseCommand {
    constructor(io, socket, roomid) {
        this.setSockets(io, socket, roomid);
    }
    
    setSockets(io, socket, roomid) {
        this.io = io;
        this.socket = socket;
        this.roomid = roomid;
    }
    
    preventDefault() {
        return {
            preventDefault: true,
            ...arguments
        };
    }
}

exports.BaseCommand = BaseCommand