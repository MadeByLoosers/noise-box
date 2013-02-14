/*
 * https://github.com/coolaj86/node-walk
 * https://github.com/leetreveil/node-musicmetadata
 */
var fs = require('fs'),
    walk = require('walk'),
    options,
    walker,
    musicmetadata = require('musicmetadata');

    options = {
      followLinks: false
    };

    //walker = walk.walk("tracks", options);
    walker = walk.walkSync("tracks", options);

    walker.on("names", function (root, nodeNamesArray) {
      //nodeNamesArray.sort(function (a, b) {
      //  if (a > b) return 1;
      //  if (a < b) return -1;
      //  return 0;
      //});
    });

    walker.on("directories", function (root, dirStatsArray, next) {
      console.log("DIR", dirStatsArray.name);
      // dirStatsArray is an array of `stat` objects with the additional attributes
      // * type
      // * error
      // * name
      next();
    });

    walker.on("file", function (root, fileStats, next) {
      console.log("FILE", root, "/", fileStats.name);

      //create a new parser from a node ReadStream
      var parser = new musicmetadata(fs.createReadStream(root + "/" + fileStats.name));

      parser.on('TLEN', function(result) {
        console.log('TLEN', result);
      });

      //listen for the metadata event
      parser.on('metadata', function(result) {
        console.log('METADATA: ', fileStats.name, result);
      });

      console.log('next\n');
      //fs.readFile(fileStats.name, function () {
        // doStuff
        //next();
      //});
    });


    walker.on("errors", function (root, nodeStatsArray, next) {
      next();
    });


    walker.on("end", function () {
        console.log("all done");
    });
