/* global module, global */

var express = require('express');
var router = express.Router();
var util = require('util');
var sprintf = require('sprintf').sprintf;

// --------------------------- LIBRARIES --------------------------------

/**
 * Flip LED on and off
 */
router.all('/', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    global.gpio.on();
    setTimeout(function(){ global.gpio.off(); }, 1000);
    
    var data = { data: {} };
    res.render('ajax/json', data);
});

module.exports = router;