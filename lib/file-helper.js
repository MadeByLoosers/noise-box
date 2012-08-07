/*
 * File helper
 */
  var fs = require('fs');

  // files to ignore
  var ignoredFiles = [
    '.DS_Store'
  ];

  // list files
  function listFiles(dir, callback) {
    // TODO: list recursive directories
    // TODO: ignore files starting with .
    // TODO: prettify file names (replace underscores, remove file extensions)

    fs.readdir(dir, function (err, files) {
      callback(files);
    });
  }



module.exports = {
  listFiles: listFiles
};