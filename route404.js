// 404 router
"use strict";

module.exports = function(req, res, next) {
    res.status(404);
    res.render("404", {title: "Error 404"});
    return;
}
