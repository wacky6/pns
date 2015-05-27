"use strict";

// table row renderer, return a <tr> element
function textTD(text, className) {
    var td = document.createElement("td");
    td.appendChild(document.createTextNode(text));
    if (className) td.className = className;
    return td;
}

function hrefTD(text, href, className) {
    var td = document.createElement("td");
    var a  = document.createElement("a");
    a.href = href;
    a.appendChild(document.createTextNode(text));
    td.appendChild(a);
    if (className) td.className = className;
    return td;
}

function byteSizeToReadable(size) {
    var unit = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    var step = 1024;
    var cnt  = 0;
    if (size===undefined) return "";
    for (cnt=0; size>=step; ++cnt, size/=step);
    return Math.round(size*10)/10 + " " + unit[cnt];
}

function epochToReadable(epoch) {
    if (epoch===undefined) return "";
    var d = new Date(epoch);
    var s = "";
    s += d.getFullYear()+"/"+d.getMonth()+"/"+d.getDay();
    s += " ";
    s += d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    return s;
}

window.trRender = function(ent) {
    // TR.[type].[access] { TD.fname,   TD.size,   TD.mtime }
    var tr = document.createElement("tr");
    var isDir = ent.name?ent.name.indexOf("/")!=-1:false;
    tr.className += isDir?"dir":"file";
    tr.className += " "+ent.access;
    var displayName = ent.name?ent.name:"";
    var href        = ent.name?ent.name:"#";
    var displaySize = byteSizeToReadable(ent.size);
    var displayTime = epochToReadable(ent.mtime);
    tr.appendChild(hrefTD(displayName, href, "name"));
    tr.appendChild(textTD(displaySize, "size"));
    tr.appendChild(textTD(displayTime, "time"));
    return tr;
}

window.tbodyRender = function(tbody, json) {
    tbody.innerHTML = "";
    var parentDir   = {name: "../", access:"parent"};
    tbody.appendChild(trRender(cd!="/"?parentDir:{access:"parent"}));
    json.forEach(function(e) {
        tbody.appendChild(trRender(e));
    });
}
