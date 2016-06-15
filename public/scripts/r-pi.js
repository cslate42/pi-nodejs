// https://github.com/jaredwolff/nodejs-websocket-example
var socket = null;

$(document).ready(function() {
    if( window['io'] ) {
        socket = io.connect( window.location.hostname );
        /**
        var socket = io.connect( window.location.hostname );
        socket.on('pong', function(data) { console.log("PONG", data); });
        socket.emit('ping', {duration: 2});
        **/
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