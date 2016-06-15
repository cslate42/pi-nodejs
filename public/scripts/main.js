//TODO install https://api.jqueryui.com/jQuery.ui.keyCode/

var isListenToKeyboard = true;
var keysPressed = {};


$( document ).ready(function() {
    keyboardInterface();
});

function keyboardInterface() {
    if( $("#pi-controls").size() === 1 && $("#pi-controls").data('activate-pi-controls') === 'true' ) {
        return; //if not supposed to listen to controls don't
    }
    
    $(document).keydown( function( event ){
        if ( ! isListenToKeyboard ) return;
        //save key to keys pressed object
        var key = event.key;
        var keyCode = event.which;
        keysPressed[ key ] = keyCode;

        //dispatcher for what to do on key press
        try {
            emitUpdatedControls( keysPressed );
        } catch( error ) {
            console.log("Caught piRun error", error);
        } finally {
            piStop();
        }
    });
    $(document).keyup(function(event){
        if( ! isListenToKeyboard ) return;
        
        delete keysPressed[ event.key ];
    });
}

function isKeyPressed(keyCode) {
    return keysPressed.indexOf(keyCode) === -1 ? false : true;
}

function getKeyIndex(keyCode) {
    return isKeyPressed(keyCode) ? keysPressed.indexOf(keyCode) : false;
}
