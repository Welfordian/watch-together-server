const { KickCommand } = require('./commands/KickCommand');
const { AlertCommand } = require('./commands/AlertCommand');
const { ClearCommand } = require('./commands/ClearCommand');

class Commands {
    constructor() {
        this.io = null;
        this.socket = null;
        this.roomid = null;
        
        this.commands = [
            KickCommand,
            AlertCommand,
            ClearCommand
        ];
        
        this.registerCommands();
    }
    
    registerCommands() {
        this.commands = this.commands.map((command) => {
            return new command(this.io, this.socket, this.roomid);
        });
    }
    
    detect(io, socket, message) {
        this.io = io;
        this.socket = socket;
        this.roomid = [Array.from(this.socket.rooms)[1]];
        let parts = message.split(' ');
        
        let foundCommand = this.commands.find(command => {
            return command.signature === parts[0];
        });
        
        if (foundCommand !== undefined) {
            foundCommand.setSockets(this.io, this.socket, this.roomid);
            return {isCommand: true, ...foundCommand.handle(parts)};
        }
        
        return {isCommand: false, message};
    }
}

exports.Commands = new Commands()