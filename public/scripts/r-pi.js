// https://github.com/jaredwolff/nodejs-websocket-example
var socket = io();

socket.on('update-controls-results', function (data) {
    console.log("update controls results", data);
});

function emitUpdatedControls(keysPressed) {
    socket.emit('update-controls', { keysPressed: keysPressed });
}

function piRun() {
    
}

function piStop() {
    
}