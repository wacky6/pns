"use strict";

var conf = require("./confLoader");

var staticFileOpts = conf.staticFileOpts;

var defaultIcon = __dirname+"/www/icon/_blank.png";

module.exports = function(req, res, next) {
    function sendDefaultIcon(err) {
        function nextRouter(err){ if (err) next() }
        if (err) res.sendFile(defaultIcon, staticFileOpts, nextRouter);
    }
    var iconPath = __dirname+"/www/icon"+req.path+".png";
    res.sendFile(iconPath, staticFileOpts, sendDefaultIcon);
}
