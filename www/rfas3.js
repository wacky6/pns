"use strict";

function Id(id) {
    return document.getElementById(id);
}

function sortAndRenderTable(json) {
    json.sort(sortFunc);
    tbodyRender(Id("lsbody"), json);
}

function setSortTH(node) {
    node.className = "sortBy";
}

var sortReverse = false;
function sortDirWrapper(a,b,cmp) {
    var da = a.name.indexOf('/')!=-1;
    var db = b.name.indexOf('/')!=-1;
    if ( da &&  db) return sortReverse?-cmp(a,b):cmp(a,b);
    if ( da && !db) return -1;
    if (!da &&  db) return 1;
    return sortReverse?-cmp(a,b):cmp(a,b);
}
var sort = {
    name: function (a,b) {
        return sortDirWrapper(a,b, function(a,b) {
            if (a.name<b.name) return -1;
            if (a.name>b.name) return 1;
            return 0;
        })
    },
    size: function (a,b) {
        return sortDirWrapper(a,b, function(a,b) {return a.size-b.size});
    },
    date: function (a,b) {
        return sortDirWrapper(a,b, function(a,b) {return a.mtime-b.mtime});
    },
    nosort: function(a,b) {
        return 0;
    }
}
var sortFunc = sort.nosort;

function setSortFunc(name) {
    console.log("Sort Func set to: "+name);
    if (sortFunc === sort[name]) {
        sortReverse = !sortReverse;
    }else{
        sortReverse = false;
        sortFunc = sort[name];
    }
    Id("th_name").className='';
    Id("th_size").className='';
    Id("th_date").className='';
    Id("th_"+name).className='sort_sel' + (sortReverse?" rev":"");
}

document.addEventListener("DOMContentLoaded", function(e){
    Id("th_name").addEventListener("click", 
        function(){setSortFunc("name");sortAndRenderTable(lsJson)});
    Id("th_size").addEventListener("click", 
        function(){setSortFunc("size");sortAndRenderTable(lsJson)});
    Id("th_date").addEventListener("click", 
        function(){setSortFunc("date");sortAndRenderTable(lsJson)});
    setSortFunc("name");
    sortAndRenderTable(lsJson);
});