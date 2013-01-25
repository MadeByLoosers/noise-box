/**
 * NoiseBox
 * index.js
 *
 * Starts up the server
 */

var NBApp = require("./server");

var port = process.env.PORT || process.argv[2];
var env = process.env.NODE_ENV;

NBApp.startApp(port, env);