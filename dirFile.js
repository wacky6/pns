"use strict";

var conf     = require("./confLoader");
var fs       = require("fs");
var normalize = require("path").normalize;
var join      = require("path").join;
var basename  = require("path").basename;
var mime      = require("mime");

var pubDir;
var privDir;
var base = conf.pnsPath;
if (base[base.length-1]!='/') base+='/';
pubDir  = base+"public/";
privDir = base+"private/";


function byteSizeToReadable(size) {
    var unit = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    var step = 1024;
    var cnt  = 0;
    if (size===undefined) return "";
    for (cnt=0; size>=step; ++cnt, size/=step);
    return Math.round(size*10)/10 + " " + unit[cnt];
}

function epochToReadable(epoch) {
    if (epoch===undefined) return "";
    var d = new Date(epoch);
    var ret = "";
    ret += d.getFullYear()+"/"+d.getMonth()+"/"+d.getDay();
    ret += " ";
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    if (h<10) h="0"+h;
    if (m<10) m="0"+m;
    if (s<10) s="0"+s;
    ret += h+":"+m+":"+s;
    return ret;
}

function getStat(phys, callback) {
    fs.stat(phys, function(err, stat){
        if (err && err.code=='EAGAIN') {
            getStat(phys, callback);
            return;
        }
        if (stat) stat.phys=phys;
        callback(err, stat);
    });
}

/* path:     virtual path
 * callback: function(public, private)
 *    public / private: {
 *        name:   file name
 *        size:   file size
 *        mtime:  mtime, js epoch
 *        mime:   predicted MIME 
 *        phys:   absolute path on harddisk
 *    }
 */ 
function getDirFile(path, callback) {
    var sPub, sPriv;
    path = normalize(path);
    var pubFile  = join(pubDir,  path);
    var privFile = join(privDir, path);
    function processFiles() {
        function sTransform(s) {
            return !s||!s.isFile()?null:{
                name:  basename(path),
                size:  byteSizeToReadable(s.size),
                mtime: epochToReadable(s.mtime.getTime()),
                mime:  mime.lookup(path),
                phys:  s.phys
            };
        }
        callback(sTransform(sPub), sTransform(sPriv));
    }
    getStat(pubFile,  function(err, stat){
        sPub = err?null:stat;
        if (sPub!==undefined && sPriv!==undefined) processFiles();
    });
    getStat(privFile, function(err, stat){
        sPriv = err?null:stat;
        if (sPub!==undefined && sPriv!==undefined) processFiles();
    });
}

module.exports = getDirFile;
