// Load the http module to create an http server.
var http = require('http');
var path = require('path')

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.end("Hello Walk\n");
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
//console.log("Server running at http://127.0.0.1:8000/");
// fileList = [
// {
//   name : "misc",
//   files : [
//     { path: "/misc/a.mp3", filename: "a" },
//     { path: "/misc/b.mp3", filename: "b" }
//   ]
// },
// {
//   name : "tv",
//   files : [
//     { path: "/tv/a.mp3", filename: "a" },
//     { path: "/tv/b.mp3", filename: "b" }
//   ]
// }
// ];
var fileList = [];

// start walk code
var walk = require('walk'),
    fs = require('fs');

options = {
    followLinks: false
};

baseName = "public/sfx";
walker = walk.walk(baseName, options);

function dirExists(fileList, dir){
    // loop fileList
    for (var i=0; i<fileList.length; i++){
        if(fileList[i]['name'] == dir){
            return i;
        }
    }
    return false;
}

walker.on("file", function (root, fileStats, next) {
    filePath = path.join(root, fileStats.name);
    dir = path.basename(root);

    file = {path: filePath, filename: fileStats.name};
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

walker.on("end", function () {
    console.log(fileList);
});
