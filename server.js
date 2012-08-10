/**
 * NoiseBox
 * server.js
 *
 * Application entry point.
 */

var express = require("express");
var http = require("http");
var app = module.exports = express();
var server = http.createServer(app);

var io = require("socket.io").listen(server);
io.set("log level",1);

require("./app/env/env")(app,express);

var controller = require("./app/noise-box-controller")(io);
require("./app/routes/routes")(app,controller.getAppModel());

server.listen(app.get("port"),function () {

  console.log("Listening on port " + app.get("port"));
});