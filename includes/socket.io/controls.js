
global.socketIoClients['update-controls'] = function (client, data) {
    console.log("HERE", data);
    client.emit("HERE1", data);
    //client.broadcast.emit("HERE2", data);
};
