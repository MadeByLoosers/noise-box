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
  var walk = function(dir, done, isRoot) {

    // cache results...
    var results = [];

    // loop through dir
    fs.readdir(dir, function(err, list) {

      // stop on errors
      if (err) {
        return done(err);
      }

      // loop through all directories and files
      var pending = list.length;
      if (!pending) {
        return done(null, results);
      }
      list.forEach(function(file) {

        // ignore . files
        if (file.charAt(0) === ".") {
          if (!--pending) {
            done(null, results);
          }

        // not a hidden file
        } else {

          file = dir + '/' + file;

          // do stuff with file...
          fs.stat(file, function(err, stat) {

            // dir, recurse
            if (stat && stat.isDirectory()) {
              walk(file, function(err, res) {
                var dirName = file.split('/').pop();
                results.push({
                  name: dirName,
                  files: res
                });
                if (!--pending) {
                  done(null, results);
                }
              });

            // file, add to list
            } else {

              // create clean file name for public consumption
              var filename = file
                .split('/').pop()               // remove path
                .replace(/(_|-)/g, ' ')         // replace hyphens and underscores with spaces
                .replace(/(.*)\.[^.]+$/, "$1"); // remove file extension

              // create file details
              results.push({
                path: file.replace('/public', ''), // remove 'public' from URLs
                filename: filename
              });

              if (!--pending) done(null, results);
            }
          }); // end fs.stat
        } // end hidden files if
      }); // end list.forEach
    }); // end fs.readdir
  };


module.exports = {
  listFiles: walk
};