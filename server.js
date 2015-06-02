"use strict";

var winston   = require("winston");
var express   = require("express");
var app       = require("express")();
var swig      = require("swig");
var session   = require("./session");
var compress  = require("./compression");
var conf      = require("./confLoader");
var rtDir   = require("./routeDir");
var rtCode  = require("./routeCode");
var rtPwrBy = require("./routePwrBy");
var rtDef   = require("./routeDefault");
var rtPAuth = require("./routePreAuth");
var rt404   = require("./route404");
var rtIcon  = require("./routeIcon");
var rtCaps  = require("./routeCaps");
var rtCert  = require("./routeCert");

app.engine("jss", swig.renderFile);
app.set("view engine", "jss");
app.set("views", __dirname + "/www");
if (conf.cache===false) {
    app.set("view cache", false);
    swig.setDefaults({cache: false});
}

var swigDefault = { owner: conf.owner };
if (conf.httpsOpts) swigDefault.showCert=conf.showCert;
if (conf.compress) app.use(compress);
app.use(session);
swig.setDefaults({locals:swigDefault});
app.disable("x-powered-by");
app.use(rtPwrBy);

// rfas routers
app.use(rtCaps);
app.use(rtPAuth);
app.use("/dir",  rtDir);
app.use("/code", rtCode);
app.use("/icon", rtIcon);
app.use("/cert", rtCert);
app.use("/",     rtDef);
app.use(rt404);

try {
    if (conf.httpsOpts) {
        require("https").createServer(conf.httpsOpts, app).listen(conf.port);
        winston.info("rfas listen on: https / "+conf.port);
    }else{
        require("http").createServer(app).listen(conf.port);
        winston.info("rfas3 listen on: http / "+conf.port);
    }
}catch(e) {
    winston.error("rfas listen fail, port: "+conf.port+", "+e);
}
