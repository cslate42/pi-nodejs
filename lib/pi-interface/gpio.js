// https://www.npmjs.com/package/rpi-gpio

var gpio = require('rpi-gpio');
//var async = require('async');


function on() {
    if (count >= max) {
        gpio.destroy(function () {
            console.log('Closed pins, now exit');
        });
        return;
    }

    setTimeout(function () {
        gpio.write(pin, 1, off);
        count += 1;
    }, delay);
}

function off() {
    setTimeout(function () {
        gpio.write(pin, 0, on);
    }, delay);
}


var pin = 3;
var delay = 2000;
var count = 0;
var max = 3;

gpio.setup(pin, gpio.DIR_OUT, on);

gpio.on('change', function (channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
});
gpio.setup(pin, gpio.DIR_IN, gpio.EDGE_BOTH);

/**
async.parallel([
    function(callback) {
        gpio.setup(7, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(15, gpio.DIR_OUT, callback)
    },
    function(callback) {
        gpio.setup(16, gpio.DIR_OUT, callback)
    },
], function(err, results) {
    console.log('Pins set up');
    write();
});
**/

module.exports = {
    on: on,
    off: off,
};