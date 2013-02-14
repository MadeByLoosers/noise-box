var dive = require("dive");
var config = require("../../config");
var fs = require("fs");

var sfxDir = config.sfxDir || "./public/sfx";
var cacheTime = 1000*60*5;
var sfx;
var lastAccess;

module.exports = function (cb) {
    if ( sfx && lastAccess && Date.now()<lastAccess+cacheTime ) {
        cb(null,sfx);
    } else {
        sfx = [];
        lastAccess = Date.now();
        dive(sfxDir,{directories:true},function (err,path) {
            var pathParts = path.split("/");
            var name = pathParts.pop();
            if ( fs.lstatSync(path).isDirectory() ) {
                var dir = {
                    name: name,
                    files: []
                }
                sfx.push(dir);
            } else {
                var dirName = pathParts.pop();
                sfx.forEach(function (dir) {
                    if ( dir.name === dirName ) {
                        dir.files.push({
                            filename: name.split(".").shift(),
                            path: "/sfx/"+dirName+"/"+name
                        });
                    }
                });
            }
        },function () {
            cb(null,sfx);
        });
    }
};