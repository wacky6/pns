"use strict";

var winston = require("winston");
var express = require("express");
var app     = require("express")();
var swig    = require("swig");
var xxhash  = require("xxhash");
var session = require("express-session");
var sess_fs = require("session-file-store");
var conf    = require("./confLoader");
var rtDir   = require("./routeDir");
var rtCode  = require("./routeCode");
var rtPwrBy = require("./routePwrBy");
var rtDef   = require("./routeDefault");
var rtPAuth = require("./routePreAuth");
var rt404   = require("./route404");
app.engine("jss", swig.renderFile);
app.set("view engine", "jss");
app.set("views", __dirname + "/www");
if (conf.cache===false) {
    app.set("view cache", false);
    swig.setDefaults({cache: false});
}

var cookieOpt = {
    secure: false    // in development, HTTPS is not used
};
var sessStoreOpt = {
    path:    "/tmp/rfas3/.session",
    ttl:     conf.authAge/1000 || 24*60*60*10,
    retries: 3
};

swig.setDefaults({locals:{owner:conf.owner||"Someone"}});
app.set("etag", function(b,e) {return xxhash.hash(b, 0xAE95A20A)});
app.disable("x-powered-by");
app.use(rtPwrBy);
app.use(session({
    cookie: cookieOpt,
    secret: conf.sessionSecret || "rfas3a",
    name:   "sess_id",
    // store: new sess_fs(sessStoreOpt)
    resave: false,
    saveUninitialized: false
}));
app.use(rtPAuth);
app.use("/dir",  rtDir);
//app.use("/code", rtCode);
app.use("/",     rtDef);
app.use(rt404);

app.listen(conf.port);
winston.info("rfas3 listen on: "+conf.port);