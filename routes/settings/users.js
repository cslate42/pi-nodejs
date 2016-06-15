/* global module, global */

var express = require('express');
var router = express.Router();
var sprintf = require('sprintf').sprintf;

/********START MODULES*********/
var users = require( process.cwd() + '/lib/users.js');
var tools = require(global.ROOT_PATH + 'lib/tools.js');
/*********END MODULES*********/
var userPrefix = users.prefix;
//NOTE add user handled by /login/sign-up/

router.all('/edit/:id/get_errors', function (req, res, next) {
    global.preparePageData(req, res, next);
    var msgs = users.getUserErrors(req, 'edit');
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
});

router.all('/edit/:id', function (req, res, next) {
    global.preparePageData(req, res, next);
    var id = parseInt( req.params.id );
    var whereUserArgs = [{val:id}];
    var queryResults = global.dbSelect(global.DB_TABLE_USERS, '*', whereUserArgs);
    if (queryResults.rowCount === 1) {
        var msgs = users.getUserErrors(req, 'edit');
        var user = {};
        if( req.body.submitted && msgs.length === 0 ) {
            //update user data
            var userData = {};
            Object.keys(req.body).forEach(function(key){
                if( key.indexOf(userPrefix) !== -1 ) {
                    var k = key.replace(userPrefix, '');
                    var value = req.body[key];
                    if( k.indexOf('password') === -1 ) {
                        userData[k] = value;
                    }
                }
            });
            
            //already verified w/getUserErrors()
            // if password is set then update it
            if( typeof req.body[userPrefix + 'password'] === 'string' && req.body[userPrefix + 'password'] !== "" )  {
                userData.password = users.encryptPassword( req.body[userPrefix + 'password'] );
            }
            global.dbUpdateRow(global.DB_TABLE_USERS, userData, whereUserArgs);
            
            user = tools.getNiceObject(global.dbSelect(global.DB_TABLE_USERS, '*', whereUserArgs).rows[0], 'users');
        } else {
            user = tools.getNiceObject(queryResults.rows[0], 'users');
        }
        
        
        var data = {
            title: 'User',
            msgs: msgs,
            user: user,
            userPrefix: userPrefix,
        };
        res.render('settings/users/edit', data);
    } else {
        console.log("-------------------------------");
        console.log(sprintf("User %d DOES NOT EXIST", id));
        console.log(queryResults);
        console.log("-------------------------------");

        res.redirect('/settings/users/');
        res.end();
    }
});

router.all('/delete/:id', function (req, res, next) {
    var id = parseInt( req.params.id );
    global.dbDelete(global.DB_TABLE_USERS, [{val: id}]);
    res.redirect('/settings/users/');
    res.end();
});

router.all('/get_list', function (req, res, next) {
    global.preparePageData(req, res, next);
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var queryResults = global.dbSelect(global.DB_TABLE_USERS, '*', null, start, global.ROWS_PER_PAGE);

    res.render('settings/users/ajax/list', {
        request: req,
        rows: tools.getRowsOfNiceObjects(queryResults.rows, 'users'),

        columns: queryResults.columns,
        foundRows: queryResults.rowCount,
        pageNum: paged
    });
});

router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    
    res.render('settings/users/table', {
        title: 'Users',
        request: req
    });
});

module.exports = router;

