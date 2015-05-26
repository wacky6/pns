// wrapper for express-session
"use strict";

var conf        = require("./confLoader");
var session     = require("express-session");
var sessionFS   = require("session-file-store");

var sessStoreOpt = {
    path:    "/tmp/rfas3/.session",
    ttl:     conf.authAge/1000,
    retries: 3
};

// TODO: change to auto config based on http/https
var cookieOpt = {secure: false};

module.exports = session({
    cookie: cookieOpt,
    secret: conf.sessionSecret || "rfas3a",
    name:   "sess_id",
    // store: new sessionFS(sessStoreOpt)
    resave: false,
    saveUninitialized: false
});