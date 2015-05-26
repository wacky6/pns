// compression middleware wrapper
"use strict";

var compression = require("compression");

var compressFilter = function(req, res) {
    if (req.headers["x-no-compress"]) return false;
    return compression.filter(req, res);
}

module.exports = compression({filter: compressFilter});