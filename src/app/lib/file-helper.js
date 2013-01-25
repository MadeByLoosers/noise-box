/*
* File helper
*/

/*
* module imports
*/
var fs = require('fs');


/*

example file list

fileList = [
{
name : "misc",
files : [
{ path: "/misc/a.mp3", filename: "a" },
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


/*
* List available files...
* adapted from http://stackoverflow.com/a/5827895
*/
var walk = function(dir) {
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
    return files;
};


module.exports = {
    listFiles: walk
};
