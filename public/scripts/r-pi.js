// https://github.com/jaredwolff/nodejs-websocket-example
var socket = io();

socket.on('update-controls-results', function (data) {
    console.log("update controls results", data);
});

function emitUpdatedControls(keysPressed) {
    try {
        socket.emit('update-controls', { keysPressed: keysPressed });
    } catch( error ) {
        console.log("Caught piRun error", error);
    } finally {
        piStop();
    }
}

function piRun() {
    
}

function piStop() {
    
}