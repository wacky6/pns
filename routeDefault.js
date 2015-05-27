// default reouter that serves static content
"use strict";
var extname = require("path").extname;
var winston = require("winston");
var conf    = require("./confLoader");

var staticFileOpts = conf.staticFileOpts;

module.exports = function(req, res, next) {
    var path = req.path; 
    if (path=="/") path="/index.jss";
    var ext  = extname(path);
    if (path.indexOf("/_")==0) {
        // escape protected content
        next();
        return;
    }
    if (ext==".jss") {
        res.render(path.substring(1), {});
    }else{
        var phys = __dirname + "/www" + path;
        res.sendFile(phys, staticFileOpts, function(err){
            if(err) next();
        });
    }
}
