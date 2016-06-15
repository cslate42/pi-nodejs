
/**
 * Iterate over all elements in global.socketIoClients
 * Setup socket.io listeners
 * @param {type} client
 * @returns {undefined}
 */
function socketIoDispatcher(client) {
    console.log("CLIENT CONNECTIED");
    
    for( var key in global.socketIoClients ) {
        client.on(key, global.socketIoClients[key]);
    }
    
//    client.on('join', function(data) {
//        console.log(data);
//    });
//    
//    client.on('messages', function(data) {
//        client.emit('broad', data);
//        client.broadcast.emit('broad',data);
//    });
//    
//    // If we recieved a command from a client to start watering lets do so
//    client.on('ping', function (data) {
//        console.log("ping");
//
//        delay = data["duration"];
//        client.emit("pong", data);
//        client.broadcast.emit('pong', data);
//    });
}

module.exports = {
    socketIoDispatcher: socketIoDispatcher,
};