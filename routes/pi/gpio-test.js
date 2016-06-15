var express = require('express');
var router = express.Router();
var sprintf = require('sprintf').sprintf;

// --------------------------- LIBRARIES --------------------------------
var gpio = require(global.ROOT_PATH + 'lib/pi-interface/file');
/**
 * Flip LED on and off
 * @param {type} param1
 * @param {type} param2
 */
router.post('/', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    gpio.on();
    setTimeout(function(){ gpio.off(); }, 1000);
    
    var data = {
        rows: rows
    };
    res.render('ajax/media/uploaded', data);
});

