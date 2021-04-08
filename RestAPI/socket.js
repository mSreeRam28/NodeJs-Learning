const _ = require('lodash');

let io;

module.exports = {
    init: httpServer => {
        io = require('socket.io')(httpServer, {
            cors: {
                origin: "*"
            }
        });
        return io;
    },
    getIO: () => {
        if(_.isNil(io)){
            throw new Error('Socket not Created');
        }
        return io;
    }
}