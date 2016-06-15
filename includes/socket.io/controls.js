
var gpio = require(global.ROOT_PATH . 'lib/pi-interface/gpio');

global.socketIoClients['update-controls'] = function (client, data) {
    var keysPressed = data['keysPressed'] ? data['keysPressed'] : [];
    if( keysPressed['a'] ) {
        gpio.on();
    } else {
        gpio.off();
    }
    
    console.log("EMITING: update-controls-results", keysPressed);
    client.emit("update-controls-results", data);
};
