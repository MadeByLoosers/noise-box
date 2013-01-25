/*
* File helper
*/

/*
* module imports
*/
//var fs = require('fs');
var http = require('http');
var path = require('path');

/*

example file list

    files = [
        {
            name : "misc",
            files : [
                { path: "/misc/a.mp3", filename: "aaasdfafa" },
                { path: "/misc/b.mp3", filename: "b" }
            ]
        },
        {
            name : "tv",
            files : [
                { path: "/tv/a.mp3", filename: "a" },
                { path: "/tv/b.mp3", filename: "b" }
            ]
        }
    ];
*/

function dirExists(fileList, dir){
    // loop fileList
    for (var i=0; i<fileList.length; i++){
        if(fileList[i]['name'] == dir){
            return i;
        }
    }
    return false;
}

/*
* List available files...
*/
var walk = function(rootDir) {
    var fileList = [];

    // start walk code
    var walk = require('walk'),
        fs = require('fs');

    options = {
        followLinks: false
    };

    baseName = rootDir;
    walker = walk.walk(baseName, options);

    walker.on("file", function (root, fileStats, next) {
        filePath = path.join(root, fileStats.name);
        dir = path.basename(root);
        file = {path: filePath, filename: fileStats.name};

        // if dir is not in the filelist add it
        i = dirExists(fileList, dir);
        if(i === false){
            fileList.push({
                name: dir,
                files: [file]
            });
        }else{
            fileList[i]['files'].push(file);
        }
        next();
    });
    return fileList;
};


module.exports = {
    listFiles: walk
};
