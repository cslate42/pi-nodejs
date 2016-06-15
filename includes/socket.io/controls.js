
global.socketIoClients['update-controls'] = function (client, data) {
    console.log("HERE", data);
    client.emit("HERE", data);
    client.broadcast.emit("HERE", data);
};