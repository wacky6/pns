// capabilitys router
// kill less-conforming browsers
//
"use strict";

var whitelist = [
    "Chrome",
    "Safari",
    "Firefox",
    "Chromium"
];

module.exports = function(req,res,next) {
    var u = req.headers['user-agent'];
    var flag=false;
    for (var i in whitelist) {
        if (u.indexOf(whitelist[i])!=-1) {
            flag=true;
            break;
        }
    }
    if (flag) next();
    res.render("browser_cap", {title: "Browser Capability Notice"});
}
