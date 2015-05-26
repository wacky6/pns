// dir listing router
"use strict";

var winston = require("winston");
var fs      = require("fs");
var conf    = require("./confLoader");
var listing = require("./dirListing");
var dirFile = require("./dirFile");
var inspect = require("util").inspect;
var _       = require("underscore");

function toJSRepresentation(j) {
    var opt = {
        showHidden: false,
        depth:  null,
        colors: false
    };
    return inspect(j, opt);
}

function processFile(req, res, next) {
    var path   = decodeURI(req.path);
    var query  = req.query;
    var param  = null;
    var authed = req.session.authed;
    dirFile(path, function(pub, priv) {
        if (authed) {
            param = priv || pub || null;
            if (query["public"]!==undefined)  param=pub;
            if (query["private"]!==undefined) param=priv;
            if (param===priv && priv) param.access="private";
            if (param===pub  && pub)  param.access="public";
            if (pub && priv)  param.bothExist=true; 
        }else{
            if (pub) {
                param = pub;
                param.access="public";
            }
        }
        if (!param) {
            res.render("_dir_file404", {});
        }else{
            if (query["get"]!==undefined)
                res.sendFile(param.phys);
            else if (query["download"]!==undefined)
                res.download(param.phys);
            else   
                res.render("_dir_file", param);
        }
    });
}

function processDir(req, res, next) {
    var path    = req.path;
    var lsJson  = [];
    var overlay = req.session.authed;
    var param   = {
        cd:    toJSRepresentation(path)
    };
    listing(path, overlay, function(err, files) {
        if (err) {
            res.render("_dir404", param);
        }else{
            _.each(files, function(v,k) {
                var j = {
                    name:   k,
                    size:   v.size,
                    mtime:  v.mtime,
                    access: v.overlay?"private":"public"
                };
                lsJson.push(j);
                param.lsJson = toJSRepresentation(lsJson);
            });
            res.render("_dir", param);
        }
    });
}

module.exports = function(req, res, next) {
    var path   = req.path;
    var param  = {};
    console.log("dir: "+path);
    if (path[path.length-1]=='/') 
        processDir(req, res, next);
    else
        processFile(req, res, next);    
}
