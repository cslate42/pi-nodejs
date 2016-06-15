/* global module, global */

var express = require('express');

//FOR FILE UPLOADS
var multer = require('multer');
var upload = multer({dest: './tmp/'});

var router = express.Router();
var sprintf = require('sprintf').sprintf;
var util = require('util');

router.all('/get-data', function (req, res, next) {
    global.preparePageData(req, res, next);
    
    var result = global.dbSelect(
        req.body.table, 
        req.body.columns, 
        req.body.where, 
        req.body.offset, 
        req.body.numOfEntries, 
        req.body.orderCol, 
        req.body.orderDirection
    );
    
    var data = result.rows;

    res.render('ajax/json', {data: data});
});

router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    res.render('projects/table', {
        title: 'Projects',
        options: ['test', 'test2']
    });
    //console.log("REQ.PATH" + req.path);
});

module.exports = router;