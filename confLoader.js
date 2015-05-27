"use strict";

var winston = require("winston");
var fs      = require("fs");
var _       = require("underscore");

var confFilePath = "./conf.conf";

var defaultConfig = {
    authAge:  60*60*24*10*1000,
    owner:    "Someone",
    cache:    true,
    port:     80,
    compress: true
};

function loadConfig() {
    try{
        var j = JSON.parse(fs.readFileSync(confFilePath));
        j = _.defaults(j,  defaultConfig);
        if (!j.pnsPath) throw new Error("pnsPath not set!");
        j.staticFileOpts = {maxAge: j.cache?1000*60*10:0};
        return j;
    }catch(e) {
        var msg = "Can't Load Configuration: "+e;
        winston.error(msg);
        process.exit(1);
    }
}

module.exports = loadConfig();
