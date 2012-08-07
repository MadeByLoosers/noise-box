var partials = require('express-partials')
/*
 * Noise Box
 *
 * Environmental config
 */
module.exports = function(app, express) {

  // main environmental config
  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/../views');
    app.use(partials());
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('noiZeb0x'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(__dirname + '/../../public'));
  });

  // ...
  app.configure('development', function(){
    app.use(express.errorHandler());
  });

};