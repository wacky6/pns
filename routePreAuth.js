/* pre auth router
 * Check against:
 *   1. valid ssl-client-cert
 *   2. loopback address
 *   3. whitelisted ip range
 */
"use strict";

var conf = require("./confLoader");
var ip   = require("ip");
var whitelistIps = [];

function getIp(req) {
    var a = req.headers['x-forwarded-for'] 
           || req.connection.remoteAddress
           || req.socket.remoteAddress
           || req.connection.socket.remoteAddress;
    var p = a.indexOf(':');
    a = a.replace(/.*:/, "");
    return a;
}

if (conf.whitelistIp) {
    for (var i in conf.whitelistIp) {
        whitelistIps.push(
            ip.cidrSubnet(conf.whitelistIp[i])
        );
    }
}
if (!whitelistIps.length)  whitelistIps=undefined;

var authAge = conf.authAge || 60*60*24*10*1000;

module.exports = function(req, res, next) {
    if (req.session.authed===true) {
        //console.log("already authenticated");
        next();
        return;
    }
    if (req.session.authed===false) {
        //console.log("already unable to authenticate");
        next();
        return;
    }
    // check ssl-client-cert
    if (req.client.authorized) {
        req.session.authed = true;
        req.session.cookie.maxAge = authAge;
        //console.log("preAuth: ssl-client-cert"); 
        next();
        return;
    }
    // check ip whitelist
    if (whitelistIps) {
        var addr = getIp(req);  
        if (addr) {
            for (var i in whitelistIps) {
                var s = ip.subnet(addr, whitelistIps[i].subnetMask);
                if (s.networkAddress == whitelistIps[i].networkAddress) {
                    req.session.authed = true;
                    req.session.cookie.maxAge = null;
                    //console.log("preAuth: ip-range");
                    next();
                    return;
                }
            }
        }
    }
    req.session.authed = false;
    next();
}
