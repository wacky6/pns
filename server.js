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

app.engine("jss", swig.renderFile);
app.set("view engine", "jss");
app.set("views", __dirname + "/www");
if (conf.cache===false) {
    app.set("view cache", false);
    swig.setDefaults({cache: false});
}
if (conf.compress) app.use(compress);
app.use(session);
swig.setDefaults({locals:{owner:conf.owner}});
app.disable("x-powered-by");
app.use(rtPwrBy);

// rfas routers
app.use(rtCaps);
app.use(rtPAuth);
app.use("/dir",  rtDir);
app.use("/code", rtCode);
app.use("/icon", rtIcon);
app.use("/",     rtDef);
app.use(rt404);


app.listen(conf.port);
winston.info("rfas3 listen on: "+conf.port);
