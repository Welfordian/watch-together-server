const { BaseCommand } = require('./BaseCommand')
const { State } = require("../State");

class AlertCommand extends BaseCommand {
    constructor() {
        super(...arguments);
        
        this.signature = '/alert';
    }

    handle(parts) {
        if (parts.length < 3) {
            State.emitSystemMessage(this.socket, 'A name is required')

            return this.preventDefault();
        }

        let user = Object.values(State.rooms[this.roomid]['users']).find(function (user) {
            return user.name === parts[1]
        });

        if (user === undefined) {
            State.emitSystemMessage(this.socket, 'User not found');
            
            return this.preventDefault();
        }

        State.emitSystemMessage(this.io.sockets.sockets.get(user.socketid), `ALERT: ${parts.slice(2).join(' ')}`);
        
        return this.preventDefault();
    }
}

exports.AlertCommand = AlertCommand