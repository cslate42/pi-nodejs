/* global module, global, __dirname */

var sprintf = require('sprintf').sprintf;
var util = require('util');
var dateFormat = require('dateformat');
var fs = require('fs');

/**
 var imageMimeTypes = [
 'image/gif',
 'image/jpeg',
 'image/png',
 'application/x-shockwave-flash',
 'image/psd',
 'image/bmp',
 'image/tiff',
 'application/octet-stream',
 'image/jp2',
 'image/iff',
 'image/vnd.wap.wbmp',
 'image/xbm',
 'image/vnd.microsoft.icon',
 ];
 var audioMimeTypes = [
 'audio/aac',
 'audio/mp4',
 'audio/mpeg',
 'audio/ogg',
 'audio/wav',
 'audio/webm',
 ];
 var videoMimeTypes = [
 'video/mp4',
 'video/ogg',
 'video/webm',
 ];
 **/

/**
 * Returns array of all files inside directory
 * @param {type} dir
 * @returns {Array}
 */
function getAllFilesInDirectory(dir) {
    var fs = require('fs');
    var results = [];
    var list = [];

    if (typeof dir !== 'string') {
        return results;
    }

    try {
        var list = fs.readdirSync(dir);
    } catch (e) {
        //can't read directory don't throw and break error
        console.log("-----------ERROR getAllFilesInDirectory()--------------");
        console.log("dir", dir);
        console.log("Exception", e);
        console.log("-------------------------------------------------------");
    }

    list.forEach(function (file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFilesInDirectory(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

function getFilename(path) {
    var filename = path;
    if (path.indexOf('/') > 0) {
        filename = path.substr(path.lastIndexOf('/') + 1);
    }
    return filename;
}

function getFileBaseName(path) {
    path = getFilename(path);
    return path.substr(0, path.lastIndexOf('.'));
}

function getFileExtention(path) {
    path = getFilename(path);
    return path.substr(-1, path.lastIndexOf('.'));
}

function getFileTypeByExtention(path) {
    var extention = getFileExtention(path);
    var type;
    //TODO support none images
    switch (extention.toLowerCase()) {
        case "tif":
        case "tiff":
        case "gif":
        case "jpeg":
        case "jpg":
        case "jif":
        case "jfif":
        case "jp2":
        case "jpx":
        case "j2k":
        case "j2c":
        case "fpx":
        case "pcd":
        case "png":
        case "pdf":
            type = 'image';
            break;
        default:
            type = null;
            break;
    }
    return type;
}

function getProjectFiles(projectId){
    var project = {};
    var projectResult = global.dbSelect(global.DB_TABLE_PROJECTS, null, [{val: projectId}]);
    if (projectResult.rowCount === 1) {
        project = projectResult.rows[0];
    }
    var mediaWhere = [
        {col: 'resource', val: 'project'}, 
        {col: 'resource_id', val: project.id},
        {col: 'field_id', val: null}
    ];
    return projectFiles = global.dbSelect(global.DB_TABLE_MEDIA, null, mediaWhere).rows;
}

function getProjectDamageReportsFiles(projectId){ 
    var damageReports = {};
    var damageReportResult = global.dbSelect(global.DB_TABLE_DAMAGE_REPORT, null, [{col: 'project_id', val: projectId}]);
    if (damageReportResult.rowCount === 1) {
        var damageReport = damageReportResult.rows[0];
        damageReports[damageReport.id] = damageReport;
    }
    
    //load and prepare phases
    var phases = global.dbSelect(global.DB_TABLE_PHASES).rows;
    for(var i = 0; i < phases.length; i++ ){
        phases[i].damageReports = [];
        phases[i].damageReportIds = [];
        phases[i].damageReportFiles = [];
    }
    
    var distinctDamageReportPhaseIds = [];
    var damageReports = global.dbSelect(global.DB_TABLE_DAMAGE_REPORT, null, [{col: 'project_id', val: projectId}]).rows;
    //console.log("DAMAGE REPORTS", damageReports);
    for (var i = 0; i < damageReports.length; i++) {
        if (distinctDamageReportPhaseIds.indexOf(damageReports[i].phase_id) === -1) {
            distinctDamageReportPhaseIds.push(damageReports[i].phase_id);
        }
        var phaseIndex = null;
        for( var j = 0; j < phases.length; j++){ 
            if( damageReports[i].phase_id === phases[j].id ) {
                phaseIndex = j;
                break;
            }
        }
        if( phaseIndex !== null ) {
            phases[ phaseIndex ].damageReports.push(damageReports[i]);
            phases[ phaseIndex ].damageReportIds.push(damageReports[i].id);
        }
    }
    
    for(var i = 0; i < phases.length; i++ ){
        var ids = phases[i].damageReportIds;
        //TODO debug why if ids = [] then out of memory...
        if( ids.length > 0 ) {
            phases[i].damageReportFiles = global.dbSelect(
                global.DB_TABLE_MEDIA, null,
                [
                    {col: 'resource', val: 'damage-report'},
                    {col: 'resource_id', val: ids}
                ]
            ).rows;
        }
    }
    return phases;
}

function getDamageReportFiles(damageReportId){ 
    return global.dbSelect(global.DB_TABLE_MEDIA, null, [{col: 'resource', val: 'damage-report'}, {col: 'resource_id', val: damageReportId}]).rows;
}

/**
 * 
 * @param {type} uid
 * @param {type} resource
 * @param {type} resourceId
 * @param {type} caption
 * @param {type} fileObjRaw typically req.files.[NAME] {filename: '', mimetype: '', file: [PATH]}
 * @param {type} filename
 * @param {type} savePath
 * @param {type} fieldCategory
 * @param {type} fieldId
 * @param {type} tmpIdentifiers
 * @returns {result.rows.insertId|undefined|uploadFile.fileId}
 */
function uploadFile(uid, resource, resourceId, caption, fileObjRaw, filename, savePath, fieldCategory, fieldId, tmpIdentifiers) {
    var fileId = null;
    if (true) { 
        //TODO FIlter mimetypes?
        var user = {};

        var userResult = global.dbSelect(global.DB_TABLE_USERS, null, [{val: uid}]);
        if (userResult.rowCount === 1) {
            user = userResult.rows[0];
        }
        
        if (typeof filename !== 'string' || filename.length < 1) {
            filename = fileObjRaw.filename;
        }

        if (typeof savePath !== 'string' || savePath.length < 1) {
            var date = new Date();
            var userFolder = sprintf("/%s-%s/", uid, user.email);
            savePath = global.UPLOAD_PATH + dateFormat(date, "yyyy/mm/dd") + userFolder;
        }
        
        if ( typeof fieldCategory !== "number" && fieldCategory === parseInt(fieldCategory) ) {
            fieldCategory = null;
        }
        
        if ( typeof fieldId !== "number" && fieldId === parseInt(fieldId) ) { 
            fieldId = null;
        }
        
        if ( typeof tmpIdentifiers === 'undefined' ) {
            tmpIdentifiers = null;
        }

        //force unique filename
        var timestamp = new Date().getTime().toString();
        var uniqueFilename = sprintf("%s-%s", timestamp, filename);

        var fileObj = {
            //id
            resource: resource,
            resource_id: resourceId,
            type: fileObjRaw.mimetype,
            path: savePath,
            filename: filename,
            unique_filename: uniqueFilename,
            link: (savePath+uniqueFilename).replace(global.ROOT_PATH + 'public/', global.ROOT_URL),
            caption: caption,
            //uploaded timestamp
            uid: uid,
            field_category: fieldCategory,
            field_id: fieldId,
            tmp_identifiers: tmpIdentifiers,
        };
        
        //upload file in database
        fileId = global.dbInsert(global.DB_TABLE_MEDIA, fileObj);
        //upload file to path
        fs.readFile(fileObjRaw.file, function (err, data) {
            var filePath = savePath + uniqueFilename;
            var parts = savePath.replace(global.UPLOAD_PATH, '').split('/');
            var currentPath = global.UPLOAD_PATH;
            for( var i = 0; i < parts.length; i++) {
                if( parts[i].length > 0 ) {
                    currentPath += parts[i] + '/';
                    if (!fs.existsSync(currentPath)){
                        fs.mkdirSync(currentPath);
                    }
                }
            }
            fs.writeFile(filePath, data, function (err) {
                if( err ) {
                    console.log("UPLOAD FILE ERROR", err);
                }
            });
        });
    }
    return fileId;
}

function deleteUploadedFile(mediaId){ 
    var errored = true;
    var result = global.dbSelect(global.DB_TABLE_MEDIA, null, mediaId);
    if( result.rowCount === 1 ) {
        var row = result.rows[0];
        fs.unlinkSync( row.path + row.unique_filename );
        global.dbDelete(global.DB_TABLE_MEDIA, mediaId);
        errored = false;
    }
    return errored;
}

/**
 * return unique id
 * @returns {undefined}
 */
function getTmpFieldMediaIdentifer(uid) {
    return 'add-'+uid;
}

module.exports = {
    getAllFilesInDirectory: function (dir) {
        return getAllFilesInDirectory(dir);
    },
    getFilename: function (path) {
        return getFilename(path);
    },
    getFileBaseName: function (path) {
        return getFileBaseName(path);
    },
    getFileExtention: function (path) {
        return getFileExtention(path);
    },
    getFileTypeByName: function (path) {
        return getFileTypeByExtention(path);
    },
    uploadFile: function (uid, resource, resourceId, caption, fileObjRaw, filename, savePath, fieldCategory, fieldId, tmpIdentifiers) {
        return uploadFile(uid, resource, resourceId, caption, fileObjRaw, filename, savePath, fieldCategory, fieldId, tmpIdentifiers);
    },
    getProjectFiles: function(projectId){
        return getProjectFiles(projectId);
    },
    getProjectDamageReportsFiles: function(projectId){
        return getProjectDamageReportsFiles(projectId);
    },
    getDamageReportFiles: function(damageReportId){
        return getDamageReportFiles(damageReportId);
    },
    deleteUploadedFile: function(mediaId) {
        return deleteUploadedFile(mediaId);
    },
    getTmpFieldMediaIdentifer: function(uid) {
        return getTmpFieldMediaIdentifer(uid);
    }
};