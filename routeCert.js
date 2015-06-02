"use strict";

var conf = require("./confLoader");
var normalize = require("path").normalize;

var staticFileOpts = conf.staticFileOpts;
var certPath;

if (conf.showCert)
    certPath = normalize(conf.showCert);

module.exports = function(req,res,next) {
    if (conf.showCert && req.path=='/') 
        res.sendFile(certPath, staticFileOpts, function(err){if(err)next()});  
    else
        next();
}
