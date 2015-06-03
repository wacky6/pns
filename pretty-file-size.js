"use strict";

const unit = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
const step = 1024;

module.exports = function(sz) {
    var size = parseInt(sz);
    var cnt  = 0;
    if (size===undefined) return "";
    for (cnt=0; size>=step; ++cnt, size/=step);
    return Math.round(size*10)/10 + " " + unit[cnt];
}
