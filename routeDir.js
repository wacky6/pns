// dir listing router
"use strict";

var winston = require("winston");
var fs      = require("fs");
var conf    = require("./confLoader");

var pubDir  = conf.pubDir;
var privDir = conf.privDir;

function getListing(path) {

}

module.exports = function(req, res, next) {
    var path = req.path;
    var param = {};
    if (req.session.authed===true) {
        // give listing for public and private files
        res.render("_dir_authed.jss", param);
    }else{
        // give listing for public files
        res.render("_dir_unauth.jss", param);
    }
}
