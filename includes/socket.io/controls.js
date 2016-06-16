
var gpio = require(global.ROOT_PATH + 'lib/pi-interface/gpio');

global.socketIoClients['update-controls'] = function (client, data) {
    var keysPressed = data['keysPressed'] ? data['keysPressed'] : [];
    
    
    //------------------CHASSIS CONTROLS---------------------------------
    if( keysPressed['ArrowUp'] && keysPressed['ArrowLeft'] ) {
        chassisForwardLeft();
    } else if( keysPressed['ArrowUp'] && keysPressed['ArrowRight'] ) {
        chassisForwardRight();
    } else if( keysPressed['ArrowDown'] && keysPressed['ArrowLeft'] ) {
        chassisBackwardLeft();
    } else if( keysPressed['ArrowDown'] && keysPressed['ArrowRight'] ) {
        chassisBackwardRight();
    } else if ( (keysPressed['ArrowUp'] && keysPressed['ArrowDown']) || (keysPressed['ArrowLeft'] && keysPressed['ArrowRight']) ) {
        chassisStop();
    } else if ( keysPressed['ArrowUp'] ) {
        chassisForward();
    } else if ( keysPressed['ArrowRight'] ) {
        chassisRight();
    } else if ( keysPressed['ArrowDown'] ) {
        chassisBackward();
    } else if ( keysPressed['ArrowLeft'] ) {
        chassisLeft();
    } else {
        chassisStop();
    }
    
    //-----------------------------LED TEST----------------------------
    if( keysPressed['a'] ) {
        gpio.on();
    } else {
        gpio.off();
    }
    
    console.log("EMITING: update-controls-results", keysPressed);
    client.emit("update-controls-results", data);
};

function chassisForwardLeft() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisForwardRight() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisBackwardLeft() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisBackwardRight() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisForward() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisRight() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisBackward() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisLeft() {
    gpio.pin(gpio.CONST.lMotorBack, 1);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 1);
}

function chassisStop() {
    gpio.pin(gpio.CONST.lMotorBack, 0);
    gpio.pin(gpio.CONST.lMotorFor, 0);
    gpio.pin(gpio.CONST.rMotorBack, 0);
    gpio.pin(gpio.CONST.rMotorFor, 0);
}