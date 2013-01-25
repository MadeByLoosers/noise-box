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
var files = [];
var dirs = [];

// start walk code
var walk = require('walk'),
    fs = require('fs');

options = {
    followLinks: false
};

// get the dirs
walker = walk.walk("./public/sfx", options);
walker.on('directory', function(root, stat, next) {
    dirs.push(root + '/' + stat.name);
    next();
});


walker.on('end', function() {
    // loop over dirs
    console.log(dirs.length);
    for (var i=0; i<dirs.length; i++){
        //TODO: for each dir get it's list of files

        // add to filelist to object with name of dir and files
        console.log('in loop ' + i + dirs.length);
        name = path.basename(dirs[i]);

        fileList.push({
            'name' : name,
            'files' : []
        });
    }
    console.log(fileList);
    console.log('after loop ' + dirs.length);
});
