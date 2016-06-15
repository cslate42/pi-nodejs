/* global module, global */

var express = require('express');

//FOR FILE UPLOADS
var multer = require('multer');
var upload = multer({dest: './tmp/'});

var router = express.Router();
var sprintf = require('sprintf').sprintf;
var util = require('util');

var tools = require(global.ROOT_PATH + 'lib/tools.js');
var file = require(global.ROOT_PATH + 'lib/file.js');

router.all('/field-get-all-media/', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    var fieldId = parseInt(req.body.fieldId);
    var fieldCategory = parseInt(req.body.fieldCategory);
    var results = global.dbSelect(global.DB_TABLE_MEDIA, null, [{col:'field_category', val:fieldCategory}, {col:'field_id', val:fieldId}]);
    
    var rows = [];
    for ( var index in results.rows ) {
        var media = results.rows[index];
        var mediaAttrs = {};
        var keys = Object.keys(media);
        for( var i in keys ) {
            var key = keys[i];
            mediaAttrs['data-' + key] = media[key];
        }
        rows.push({
            media: media,
            mediaAttrs: mediaAttrs,
        });
    }
    
    var data = {
        rows: rows
    };
    res.render('ajax/media/uploaded', data);
});

router.all('/delete/:id', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    var errored = true;
    
    var mediaId = req.params.id;
    if( typeof mediaId !== 'undefined' && ! isNaN(mediaId) ) {
        mediaId = parseInt(mediaId);
        errored = file.deleteUploadedFile(mediaId);
    }
    var data = {
        errored: errored,
        mediaId: mediaId,
    };
    res.render('ajax/json', {data:data});
});

router.all('/field-get-single-media/:id', function(req, res, next) {
    global.preparePageData(req, res, next);
    
    var mediaId = parseInt(req.params.id);
    var results = global.dbSelect(global.DB_TABLE_MEDIA, null, [{col:'id', val:mediaId}]);
    
    var media = {};
    if ( results.rowCount === 1 ) {
        media = results.rows[0];
    }
    
    var mediaAttrs = {};
    var keys = Object.keys(media);
    for( var i in keys ) {
        var key = keys[i];
        mediaAttrs['data-' + key] = media[key];
    }
    
    var rows = [{
        media: media,
        mediaAttrs: mediaAttrs
    }];
    
    var data = {
        rows: rows,
    };
    res.render('ajax/media/uploaded', data);
});

router.all('/field-uploads/', function(req, res, next) {
    global.preparePageData(req, res, next);
    //console.log("BODY", req.body)
    //console.log("FILES", req.files);
    var data = {
        successfullyUploaded: [],
        errored: [],
        errorMsgs: [],
    };
    
    var resource = req.body.resource;
    var resourceId = req.body.resourceId;
    var fieldCategory = req.body.fieldCategory;
    var fieldId = req.body.fieldId;
    var tmpIdentifiers = req.body.tmpIdentifiers;
    
    if ( ! tmpIdentifiers && resourceId == -1 ) {
        tmpIdentifiers = file.getTmpFieldMediaIdentifer(req.session.uid);
    }
    
    for(var key in req.files) {
        var media = req.files[key];
        fieldId = req.body.fieldId;
        
        var caption = null;
        console.log("MEDIA UPLOAD", req.session.uid, resource, resourceId, caption, 
            key, media, fieldCategory, fieldId, tmpIdentifiers);
        
        var fileId = file.uploadFile(req.session.uid, resource, resourceId, 
            caption, media, null, null, fieldCategory, fieldId, tmpIdentifiers);
        data.successfullyUploaded.push(fileId);
    }
    //console.log(data);
    
    res.render('ajax/json', {
        data: data
    });
});

router.all('/', function (req, res, next) {
    global.preparePageData(req, res, next);
    res.render('ajax/json', {
        data: null
    });
});

module.exports = router;