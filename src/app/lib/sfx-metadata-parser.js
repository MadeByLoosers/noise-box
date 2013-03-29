var MusicMetaData = require("musicmetadata");
var config = require("../../config");
var fs = require("fs");
var async = require("async");
var log = require("./log");

var sfxDir = config.sfxDir || "./public/sfx";

/**
 * Loops through an sfx data structure and parses each file for MP3 metadata. If
 * it is found its added to the data for each file.
 */
module.exports = function (sfx,cb) {
    if ( sfx[0].parsed ) {
        cb(null,sfx);
        return;
    }
    var tasks = [];
    sfx.forEach(function (dir) {
        dir.files.forEach(function (file) {
            tasks.push((function (file,dir) {
                return function (cb) {

                    // uncomment if checking files for length
                    parseFile(file,dir,cb);

                    // comment if checking files for length
                    //cb();
                };
            }(file,dir)));
        });
    });
    async.series(tasks,function (err) {
        cb(err,sfx);
    });
    console.log("Parsing metadata");
};

function parseFile (file,dir,cb) {
    try{
        dir.parsed = true;
        var filePath = sfxDir+"/"+dir.name+"/"+file.filename;
        //console.log("Checking metadata for file:", filePath);
        var parser = new MusicMetaData(fs.createReadStream(filePath));
        parser.once("metadata",function (res) {
            file.title = res.title;
            file.artist = res.artist.toString();
            file.album = res.album;
        });
        parser.once("TLEN",function (res) {
            file.duration = res;
        });
        parser.once("done",function (err) {
            //console.log("Done checking:", filePath);
            //if ( err ) log.warn(file.filename+" "+err.toString());
            /*
            NOTE: uncommenting the below line crashes the app on pxg's machine:
            events.js:48
            throw arguments[1]; // Unhandled 'error' event
                           ^
            Error: EBADF, bad file descriptor
            */
            //parser.stream.destroy();
            cb();
        });
    }catch(e){
        console.log(e);
        cb();
        return;
    }
}
