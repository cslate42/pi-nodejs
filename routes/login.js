/* global module, global, users */

var express = require('express');
var router = express.Router();
var sprintf = require('sprintf').sprintf;

/********START MODULES*********/
var users = require(process.cwd() + '/lib/users.js');
var tools = require(global.ROOT_PATH + 'lib/tools.js');
/*********END MODULES*********/

function loginUser(req, uid) {
    req.session.reset();
    req.session.isLoggedIn = true;
    req.session.uid = uid;
}

router.all('/sign-up/get_errors', function (req, res, next) {
    global.preparePageData(req, res, next);
    var msgs = users.getUserErrors(req, 'sign-up');
    var html = '';
    for( var i = 0; i < msgs.length; i++ ){
        html += sprintf('<p class="alert alert-danger" role="alert">%s</p>', msgs[i]);
    }
    
    var data = {
        req: req.body,
        html: html,
        msgs: msgs,
        submit: msgs.length === 0,
    };
    res.render('ajax/json', {data: data});
});-

router.all('/sign-in', function (req, res, next) {
    global.preparePageData(req, res, next);
    if (global.isRedirecting !== false) {
        var email = req.body.email;
        var password = req.body.password;
        var loginResponse = users.isValidLogin(email, password);
        console.log("loginResponse", loginResponse);
        if (loginResponse.isValid === true) {
            loginUser(req, loginResponse.uid);
        }

        res.render('ajax/json', {
            data: loginResponse.isValid
                    //data: loginResponse
        });
    }
});

router.all('/sign-up', function (req, res, next) {
    global.preparePageData(req, res, next);
    if (global.isRedirecting !== false) {
        var msgs = users.getUserErrors(req, 'sign-up');
        var user = {};
        var redirect = false;
        if (req.body.submitted && msgs.length === 0) {
            //update user data
            var userData = {};
            Object.keys(req.body).forEach(function (key) {
                if (key.indexOf(users.prefix) !== -1) {
                    var k = key.replace(users.prefix, '');
                    var value = req.body[key];
                    if (k.indexOf('password') === -1) {
                        userData[k] = value;
                    }
                }
            });

            //already verified w/getUserErrors()
            // if password is set then update it
            if (typeof req.body[users.prefix + 'password'] === 'string' && req.body[users.prefix + 'password'] !== "") {
                userData.password = users.encryptPassword(req.body[users.prefix + 'password']);
            }
            var uid = global.dbInsert(global.DB_TABLE_USERS, userData);
            loginUser(req, uid);
            redirect = true;
        }

        if( redirect ) {
            res.redirect('/');
            res.end();
        } else {
            var data = {
                title: 'User',
                msgs: msgs,
                user: user,
                userPrefix: users.prefix,
            };
            res.render('login/sign-up', data);
        }
    }
});

router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    if (global.isRedirecting !== false) {
        res.render('login/login', {
            title: 'Login'
        });
    }
});

module.exports = router;
