/*
 * Noise Box
 */

var express = require('express'),
    http = require('http');

var app = module.exports = express();

// import app config
require('./app/env/env')(app, express);
require('./app/routes/routes')(app);
require('./app/app')(app);

// start the app
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
