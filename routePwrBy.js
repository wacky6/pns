"use strict";
module.exports = function(req, res, next){
    res.header("X-Powered-By", "rfas v3 alpha");
    next();
}

