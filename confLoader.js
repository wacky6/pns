"use strict";

var winston = require("winston");
var fs      = require("fs");
var _       = require("underscore");
var tlsConf = require("./tlsConf");

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
        // check pnsPath
        if (!j.pnsPath) throw new Error("pnsPath not set!");
        // deduce statisFileOpts for express
        j.staticFileOpts = {maxAge: j.cache?1000*60*10:0};
        // deduce HTTP/HTTPS Server option
        if (j.certificate && j.privateKey) {
            var httpsOpts = {};
            httpsOpts.cert = fs.readFileSync(j.certificate);
            httpsOpts.key  = fs.readFileSync(j.privateKey);
            if (j.ca) {
                httpsOpts.ca = fs.readFileSync(j.ca);
                httpsOpts.rejectUnauthorized = j.certOnly?true:false;
            }
            httpsOpts.ciphers        = tlsConf.ciphers;
            httpsOpts.secureProtocol = tlsConf.secureProtocol;
            j.httpsOpts = httpsOpts;
        }
        // warn if user did not set https correctly
        if (!j.httpsOpts && (j.certificate || j.privateKey || j.ca)) {
            winston.warn("https params may be configured incorrectly!!!");
            winston.warn("rfas3 will run, but may not in a way you want!");
        }
        return j;
    }catch(e) {
        var msg = "Can't Load Configuration: "+e;
        winston.error(msg);
        process.exit(1);
    }
}

module.exports = loadConfig();
