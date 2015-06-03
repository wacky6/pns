// dir listing router
"use strict";

var winston = require("winston");
var fs      = require("fs");
var conf    = require("./confLoader");
var listing = require("./dirListing");
var dirFile = require("./dirFile");
var inspect = require("util").inspect;
var _       = require("underscore");
var extname = require("path").extname;

function processFile(req, res, next) {
    var path   = decodeURI(req.path);
    var query  = req.query;
    var param  = null;
    var authed = req.session.authed;
    var baseQuery = "?";
    var ext    = extname(path);
    if (ext.indexOf('.')!=-1) ext=ext.substr(1);
    if (query['public']!==undefined)  baseQuery = "?public&";
    if (query['private']!==undefined) baseQuery = "?private&";
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
            res.render("dir_file404", {});
        }else{
            param.baseQuery = baseQuery;
            param.extname   = ext;
            if (query["get"]!==undefined || query["view"]!==undefined)
                res.sendFile(param.phys, function(err){if(err) next()});
            else if (query["download"]!==undefined)
                res.download(param.phys, function(err){if(err) next()});
            else   
                res.render("dir_file", param);
        }
    });
}

function processDir(req, res, next) {
    var path    = decodeURI(req.path);
    var overlay = req.session.authed;
    var param   = {
        isRoot: path=='/'
    };
    listing(path, overlay, function(err, files) {
        if (err) {
            res.render("dir404", param);
        }else{
            param.ls = [];
            _.each(files, function(v,k) {
                var j = {
                    name:   k,
                    size:   v.size,
                    mtime:  v.mtime,
                    access: v.overlay?"private":"public",
                    type:   v.type
                };
                param.ls.push(j);
            });
            res.render("dir", param);
        }
    });
}

module.exports = function(req, res, next) {
    var path   = req.path;
    var param  = {};
    if (path[path.length-1]=='/') 
        processDir(req, res, next);
    else
        processFile(req, res, next);    
}
