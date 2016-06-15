
global.socketIoClients['update-controls'] = function (client, data) {
    client.emit("HERE", data);
    client.broadcast.emit("HERE", data);
};