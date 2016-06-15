// https://github.com/jaredwolff/nodejs-websocket-example
var socket = null;

$(document).ready(function() {
    if( window['io'] ) {
        var socket = io.connect( window.hostname );
        
        socket.on('pong', function (data) {
            console.log("pong");
        });
        
        $("#hello").click(function(){
            socket.emit('ping', { duration: 2 });
        });
    }
});

function piRun() {
    
}

function piStop() {
    
}