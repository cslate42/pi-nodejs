// https://www.npmjs.com/package/rpi-gpio
var gpio = require('rpi-gpio');
//https://www.npmjs.com/package/node-gpio
//var PWM = require('node-gpio').PWM;
//var async = require('async');

var constants = {
    LED: 3,
    lMotorBack: 35, 
    lMotorFor: 36,
    rMotorBack: 37,
    rMotorFor: 38,
    
};

var testPin = 3;
var delay = 2000;
var count = 0;
var max = 3;

function pwmTest() {
//    var led = new PWM("28");
    
//    led.open();
//    led.setMode(gpio.OUT);
//    led.frequency = 100;
//    led.dutyCycle = 50;
//    led.start();
//    led.stop();
}

function setup() {
    gpio.setup(testPin, gpio.DIR_OUT, on);

    gpio.on('change', function (channel, value) {
        console.log('Channel ' + channel + ' value is now ' + value);
    });
    gpio.setup(testPin, gpio.DIR_IN, gpio.EDGE_BOTH);
    
    //gpio.setup(constants.lMotorBack, gpio.DIR_OUT, gpio.EDGE_NONE, callback);
    gpio.setup(constants.lMotorBack);
    gpio.setup(constants.lMotorFor);
    gpio.setup(constants.rMotorBack);
    gpio.setup(constants.rMotorFor);
}
setup();

function on() {
    gpio.output(testPin, 1);
}

function off() {
    gpio.output(testPin, 0);
}

function pin(pin, state) {
    var boolState = state === 1 || state === true ? true : false;
    gpio.output(pin, boolState);
}

/**
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
**/

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
    CONST: constants,
    on: on,
    off: off,
    pin: pin,
};