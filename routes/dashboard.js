/* global global, module */

var express = require('express');
var router = express.Router();


/* GET home page. */

//http://localhost:3000/dashboard/2
//router.get('/index/2', function (req, res, next) {
//    global.preparePageData(req, res, next);
//    res.render('index', {
//        title: 'Expres2asdfas',
//        BASE_URL: req.get('host')//global.BASE_URL
//    });
//});

// http://localhost:3000/ http://localhost:3000/dashboard/
router.get('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    res.render('index', {
        title: 'Dashboard',
        BASE_URL: req.get('host')//global.BASE_URL
    });
});

module.exports = router;
module.exports.isIndexPage = true;


