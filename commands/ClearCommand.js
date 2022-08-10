const { BaseCommand } = require('./BaseCommand')
const { State } = require('../State')

class ClearCommand extends BaseCommand {
    constructor() {
        super(...arguments);

        this.signature = '/clear';
    }
    
    handle(args) {
        State.broadcastToRoom(this.socket, 'cmd_clear_chat');
        State.broadcastSystemMessage(this.socket, 'Chat was cleared!');
        
        return this.preventDefault();
    }
}

exports.ClearCommand = ClearCommand