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
        if(fileList[i]['name'] === dir){
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

    var options = {
        followLinks: false
    };

    var baseName = rootDir;
    var walker = walk.walk(baseName, options);

    walker.on("file", function (root, fileStats, next) {

        // ignore .files
        if (fileStats.name.indexOf(".") === 0) {
            next();
        }

        // prep file name and path
        var filePath = path.join(root, fileStats.name),
        dir = path.basename(root),
        filename = fileStats.name
            .replace(/_/g, ' ')                     // replace underscores with spaces
            .replace(/\.[^.]*$/, '');               // remove file extention

        filePath = filePath.replace("public/", ""); // remove public from dir

        var file = {path: filePath, filename: filename};

        // if dir is not in the filelist add it
        var i = dirExists(fileList, dir);
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
    walker.on("end", function(){
        fileList.reverse();
    });
    return fileList;
};


module.exports = {
    listFiles: walk
};
