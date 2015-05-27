"use strict";

var conf     = require("./confLoader");
var fs       = require("fs");
var winston  = require("winston");
var _        = require("underscore");
var normalize = require("path").normalize;
var join      = require("path").join;

var pubDir;
var privDir;
var base = conf.pnsPath;
if (base[base.length-1]!='/') base+='/';
pubDir  = base+"public/";
privDir = base+"private/";

// create directories
try{fs.mkdirSync(base)    }catch(e){}
try{fs.mkdirSync(pubDir)  }catch(e){}
try{fs.mkdirSync(privDir) }catch(e){}

function getDirListing(phys, cbk) {
    var ret = {};
    fs.readdir(phys, function(err, files) {
        if (err) {
            if (err.code=='EAGAIN') 
                getDirListing(phys, cbk);
            else
                cbk(err, {});
            return;
        }
        var cnt = 0;
        function getStat(f) {
            fs.stat(phys+f, function(err, stat) {
                if (err && err.code=='EAGAIN') {
                    getStat(f);
                    return;
                }
                cnt++;
                if (!err) {
                    var fn = stat.isDirectory()?f+'/':f;
                    ret[fn] = {
                        mtime: stat.mtime.getTime(),
                        atime: stat.atime.getTime(),
                        cTime: stat.ctime.getTime(),
                        size:  stat.isDirectory()?0:stat.size
                    };
                }
                if (cnt==files.length) {
                    cbk(null, ret);
                    return;
                }
            });
        }
        files.forEach(getStat);
        if (files.length==0) cbk(null, ret);
    });
}

/* path: virtual path
 * callback: function(err, list)
 *    err:  'ENOENT', 'EACCESS'
 *    list: [
 *       name:    file/directory name
 *       size:    file_size
 *       mtime:   modify time, js epoch
 *       overlay: true / false
 *    ]
 * overlay: return private overlay
 */ 
function overlayDirListing(path, overlay, callback) {
    if (path[path.length-1]!='/') path+='/';
    path = normalize(path);
    var pubLsDir  = join(pubDir,  path);
    var privLsDir = join(privDir, path);
    var ls  = {};
    var epub, epriv;
    var fpub, fpriv;
    function overlayFile() {
        var ret = _.mapObject(fpub, function(v){v.overlay=false;return v;});
        var err = epub;
        if (overlay) {
            fpriv = _.mapObject(fpriv, function(v){v.overlay=true;return v;});
            ret = _.defaults(fpriv, fpub);
            err = (!epub || !epriv)?null:epriv;
        }
        callback(err, ret);
    }
    getDirListing(pubLsDir,  function(err, files){
        epub = err;
        fpub = files;
        if (fpub!==undefined && fpriv!==undefined) overlayFile();
    });
    getDirListing(privLsDir, function(err, files) {
        epriv = err;
        fpriv = files;
        if (fpub!==undefined && fpriv!==undefined) overlayFile();
    });
}

module.exports = overlayDirListing;
