/* global module, global */

var express = require('express');
var router = express.Router();
/* GET home page. */
router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    var dbRows = global.queryDb('SELECT SQL_CALC_FOUND_ROWS * FROM `test`'); //count num rows
    
    if( req.xhr ) {
        //is ajax
    } else {
        //not ajax
    }
    
    console.log('---------------');
    console.log(dbRows);
    console.log('---------------');
    
    var rowsAll = [];
    for(var i = 0; i < 100; i++ ){
        var row = {
            name: 'row_' + i,
            random: Math.random()
        };
        rowsAll.push(row);
    }
    var paged = typeof req.body.paged === "undefined" ? 1 : parseInt(req.body.paged);
    var start = (paged - 1) * global.ROWS_PER_PAGE;
    var stop = start + global.ROWS_PER_PAGE;
    var rows = rowsAll.slice(start, stop);
    
    res.render('example', {
        title: 'Example',
        asdf: dbRows,
        request: req,
        
        tableColumns: ['name', 'random'],
        tableRows: rows,
        foundRows: rowsAll.length,
        
        BASE_URL: req.get('host')//global.BASE_URL
    });
});

module.exports = router;

