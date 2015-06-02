// capabilitys router
// kill less-conforming browsers
//
"use strict";

var extname = require('path').extname;

var whitelist = [
    "Chrome",
    "Safari",
    "Firefox",
    "Chromium"
];

var whitelistExtension = [
    '.css',
    '.js',
    '.png'
];

module.exports = function(req,res,next) {
    var u = req.headers['user-agent'];
    var flag=false;
    var ext = extname(req.path);
    
    if (!flag) for (var i in whitelistExtension) {
        if (ext==whitelistExtension[i]) {
            flag=true;
            break;
        }
    }
    
    if (!flag) for (var i in whitelist) {
        if (u.indexOf(whitelist[i])!=-1) {
            flag=true;
            break;
        }
    }
    
    if (!flag) {
        res.render("browser_cap", {title: "Browser Capability Notice"});
        return;
    }
    next();
}
