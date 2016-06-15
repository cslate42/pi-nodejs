
/**
 * Iterate over all elements in global.socketIoClients
 * Setup socket.io listeners
 * @param {type} client
 * @returns {undefined}
 */
global.socketIoDispatcher = function(client) {
    console.log("CLIENT CONNECTIED");
    
    for( var key in global.socketIoClients ) {
        client.on(key, function(data){
            global.socketIoClients[key](client, data);
        });
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
//        client.emit("pong", data);
//        client.broadcast.emit('pong', data);
//    });
};