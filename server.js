/*
 * Noise Box
 */


var express = require('express'),
    http = require('http');

var app = module.exports = express();

// io needs an http server instance: http://bit.ly/vxOxL5
var server = http.createServer(app),
    io = require('socket.io').listen(server);

// import app config
require('./app/env/env')(app, express);
require('./app/routes/routes')(app);
require('./app/app')(app, io);

// start the app
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
