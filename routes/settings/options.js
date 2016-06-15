/* global module, global, users */

var express = require('express');
var router = express.Router();
var sprintf = require('sprintf').sprintf;

/********START MODULES*********/
var users = require( process.cwd() + '/lib/users.js');
var tools = require(global.ROOT_PATH + 'lib/tools.js');
/*********END MODULES*********/

router.all('/get_list', function (req, res, next) {
    global.preparePageData(req, res, next);
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var queryResults = global.queryDbCountRows('SELECT SQL_CALC_FOUND_ROWS * FROM `phases` LIMIT '+start+', '+global.ROWS_PER_PAGE);
    
    var data = {
        columns: queryResults.columns,
        
        rows: queryResults.rows,
        
        foundRows: queryResults.rowCount,
        pageNum: paged
    };
//    console.log(data);
    res.render('settings/phases/ajax/list', data);
});

router.all('/edit/:id', function (req, res, next) {
    global.preparePageData(req, res, next);
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var queryResults = global.queryDbCountRows('SELECT SQL_CALC_FOUND_ROWS * FROM `phases` LIMIT '+start+', '+global.ROWS_PER_PAGE);
    
    var data = {
        columns: queryResults.columns,
        
        rows: queryResults.rows,
        
        foundRows: queryResults.rowCount,
        pageNum: paged
    };
//    console.log(data);
    res.render('settings/phases/edit', data);
});

router.all('/view/:id', function (req, res, next) {
    global.preparePageData(req, res, next);
    var id = req.params.id;
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var queryResults = global.queryDbCountRows('SELECT SQL_CALC_FOUND_ROWS * FROM `phases` LIMIT '+start+', '+global.ROWS_PER_PAGE);
    
    var phase = {};
    var phaseResults = global.queryDbCountRows('SELECT * FROM `phases` WHERE `id` = ' + id);
    if( phaseResults.rowCount === 1 ) {
        phase = phaseResults.rows[0];
    }
    
    var data = {
        columns: queryResults.columns,
        
        phase: phase,
        rows: queryResults.rows,
        
        foundRows: queryResults.rowCount,
        pageNum: paged
    };
//    console.log(data);
    res.render('settings/phases/view', data);
});

router.all('/view/:id/get_list', function (req, res, next) {
    global.preparePageData(req, res, next);
    var id = req.params.id;
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var queryResults = global.queryDbCountRows('SELECT SQL_CALC_FOUND_ROWS * FROM `phases` LIMIT '+start+', '+global.ROWS_PER_PAGE);
    
    var data = {
        columns: queryResults.columns,
        
        rows: queryResults.rows,
        
        foundRows: queryResults.rowCount,
        pageNum: paged
    };
//    console.log(data);
    res.render('settings/phases/ajax/list', data);
});

router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    if( global.isRedirecting !== false ) {
        var data = {
            title: 'Phases'
        };
        res.render('settings/phases/table', data);
    }
});

module.exports = router;
