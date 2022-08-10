const { BaseCommand } = require('./BaseCommand')
const {State} = require('../State')

class KickCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        
        this.signature = '/kick';
    }

    handle(parts) {
        if (parts.length < 3) {
            State.emitSystemMessage(this.socket, 'A name & message is required')
            
            return this.preventDefault();
        }

        let user = Object.values(State.rooms[this.roomid]['users']).find(function (user) {
            return user.name === parts[1]
        });

        if (user === undefined) {
            State.emitSystemMessage(this.socket, 'User not found');
            
            return this.preventDefault();
        }

        let socketToDisconnect = this.io.sockets.sockets.get(user.socketid);
        
        socketToDisconnect.emit('disconnect_reason', {reason: `You have been kicked! Reason: ${parts.slice(2).join(' ')}`});
        socketToDisconnect.disconnect();

        return {message: `${parts[1]} was kicked`};
    }
}

exports.KickCommand = KickCommand