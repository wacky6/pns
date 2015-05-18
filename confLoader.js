"use strict";

var winston = require("winston");
var fs      = require("fs");

var confFilePath = "./conf.conf";

function loadConfig() {
    try{
        var j = JSON.parse(fs.readFileSync(confFilePath));
        if (!j.authAge) j.authAge = 24*60*60*10*1000;
        return j;
    }catch(e) {
        var msg = "Can't Load Configuration: "+e.code;
        winston.error(msg);
        process.exit(1);
    }
}

module.exports = loadConfig();
