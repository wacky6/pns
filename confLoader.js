"use strict";

var winston = require("winston");
var fs      = require("fs");
var _       = require("underscore");

var confFilePath = "./conf.conf";

/* configuration: {
    authAge:     num of millisecond that a authToken is considered valid
    owner:       owner's name
    cache:       enable caching, affect swig template and static files
    port:        port, default: http/80, https/443
    compress:    enable compression
    certificate: path to https certificate, must be used with privateKey
    privateKey:  path to https privateKey, must be used with certificate
    ca:          path to CA that is used to authenticate clients,
                 valid if certificate, privateKey are set
    certOnly:    only accept clients with valid certificates
    showCert:    show certificate download on index,
                 valid if certificate, privateKey are set
}
*/

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
        var portSet = j.port!==undefined;
        _.defaults(j, defaultConfig);
        // check pnsPath
        if (!j.pnsPath) throw new Error("pnsPath not set!");
        // deduce statisFileOpts for express
        j.staticFileOpts = {maxAge: j.cache?1000*60*10:0};
        // deduce HTTP/HTTPS Server option
        if (j.certificate && j.privateKey) {
            var httpsOpts = {};
            httpsOpts.cert = fs.readFileSync(j.certificate);
            httpsOpts.key  = fs.readFileSync(j.privateKey);
            httpsOpts.certPath = __dirname + "/" + j.certificate;
            if (j.ca) {
                httpsOpts.ca = fs.readFileSync(j.ca);
                httpsOpts.rejectUnauthorized = j.certOnly?true:false;
            }
            j.httpsOpts = httpsOpts;
            if (!portSet) j.port=443;
            if (j.showCert===undefined) j.showCert=true;
        }
        // warn if user did not set https correctly
        if (!j.httpsOpts && (j.certificate || j.privateKey || j.ca || j.showCert)) {
            winston.warn("https params may be configured incorrectly!!!");
            winston.warn("rfas3 will run, but may not in a way you want!");
        }
        // report important fields
        if (!j.cache)    winston.warn("production: cache is disabled.");
        if (!j.compress) winston.warn("production: compression is disabled.");
        if (j.ca)        winston.warn("https: will only accept clients with certificates!");
        return j;
    }catch(e) {
        var msg = "Can't Load Configuration: "+e;
        winston.error(msg);
        process.exit(1);
    }
}

module.exports = loadConfig();
