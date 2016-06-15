/* global module, global */

var express = require('express');
var router = express.Router();
var util = require('util');
var sprintf = require('sprintf').sprintf;

// --------------------------- LIBRARIES --------------------------------
var gpio = require(global.ROOT_PATH + 'lib/pi-interface/gpio.js');

/**
 * Flip LED on and off
 */
router.all('/', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    gpio.on();
    setTimeout(function(){ gpio.off(); }, 1000);
    
    var data = {
        rows: null
    };
    res.render('ajax/media/uploaded', data);
});

module.exports = router;