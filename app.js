/* global __dirname, process, module, global */

var debug = require('debug')('my-app:server');
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
var files = require('./lib/file');
var sprintf = require('sprintf').sprintf;
//var vsprintf = require('sprintf').vsprintf;
var session = require('client-sessions');

//include everything in /includes/
console.log("CWD:", process.cwd());
files.getAllFilesInDirectory("./includes").forEach(function (file) {
    console.log("Requiring: " + file);
    require(file);
});

global.dbDebug = false;

/************************************ START SETUP SERVER *********************************************************/
var app = express();

// create http server
var server = http.Server(app);
var PORT = 80;
// Listen on provided port, on all network interfaces.
server.listen(PORT, function(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
});
server.on('error', function(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof PORT === 'string'
            ? 'Pipe ' + PORT
            : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
server.on('listening', function() {
    var addr = server.address();
    var bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
    debug('Listening on ' + bind);
});

app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;',
    duration: 2 * 7 * 24 * 60 * 60 * 1000, //2wks in millisecs
    activeDuration: 2 * 7 * 24 * 60 * 60 * 1000, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
        //path: '/api', // cookie will only be sent to requests under '/api'
        //maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
        //ephemeral: false, // when true, cookie expires when the browser closes
        httpOnly: true, // when true, cookie is not accessible from javascript
        //secure: false // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    }
}));
//return all files as static from /public/
app.use(express.static(path.join(__dirname, 'public')));
app.locals.sprintf = sprintf;

// view engine setup
app.set('port', process.env.PORT || 80);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: false}));
//use instead of previous 2... for file uploads
require('express-busboy').extend(app, {
    upload: true,
    //path: './tmp/'
});

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//define all views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    global.preparePageData(req, res, next);
    if (app.get('env') === 'development') {
        //production/dev template is same
    }
    var template = (req.xhr === true) ? 'error_ajax' : 'error';
    res.render(template, {
        message: err.message,
        error: err,
        req: req,
        res: res
                //next: next
    });
});
/*************************************** END SERVER SETUP ***************************************************/

/**************************************** START ROUTES SETUP *******************************************************/
var routesPath = "./routes";
var routes = files.getAllFilesInDirectory(routesPath);
console.log("--------PREPARING ROUTES----------");
routes.forEach(function (route, index, array) {
    if (route.indexOf('.js') > -1) { //is nodejs file
        var routePath = files.getFileBaseName(route.replace(routesPath, ''));
        var routeObj = require(route);
        console.log("Route:", route, "RoutesPath:", routesPath, "RoutePath:", routePath);
        //console.log("RouteObj:", routeObj);

        if (routeObj.isIndexPage === true) { //if is root of domain set default page handler to routeObj
            app.use('/', routeObj);
            app.use('/index', routeObj);
            console.log("INDEX PAGE = " + route);
        }
        app.use(routePath, routeObj);
    }
});
console.log("------------END ROUTES-----------------");
/**************************************** END ROUTES SETUP *******************************************************/

/**************************************** START JADE FILE SETUP SETUP *******************************************************/
//all styles to be included in headers
var stylesheetsPath = "./public/css/";
files.getAllFilesInDirectory(stylesheetsPath).forEach(function (file, index, array) {
    global.LAYOUT.INCLUDES.STYLESHEETS.push("/css" + file.replace(stylesheetsPath, ''));
});

//all scripts to be included in headers
var scriptsPath = "./public/scripts/";
files.getAllFilesInDirectory(scriptsPath).forEach(function (file, index, array) {
    global.LAYOUT.INCLUDES.SCRIPTS.push("/scripts" + file.replace(scriptsPath, ''));
});
/**************************************** END JADE FILE SETUP SETUP *******************************************************/

//export stuff
global.app = app;
module.exports = app;



