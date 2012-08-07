/*
 * Noise Box
 *
 * Routes
 */

/*
 * Imports
 */
var _ = require('underscore');


/*
 * Default page vars. Override these.
 */
var pageOptions = {
  title:'NoiseBox',
  bodyid:''
};


/*
 * Module
 */
module.exports = function(app) {

  // routes - GET
  app.get('/', index);
  app.get('/host/:id', host);
  app.get('/:id', room);

  // routes - POST
  app.post('/host/', createHost);


/*
 * GET methods
 */

  // get home page
  function index(req, res){

    var options = _.extend(pageOptions, {
      bodyid : 'home'
    });

    res.render('index', pageOptions);
  }


  // get (create) a room host
  function host(req, res){
    var id = req.params.id,
        url = req.headers.host;

    // TODO: if host exists already, redirect
    // TODO: if host doesn't exist, create
    // TODO: connect to websockets

    var options = _.extend(pageOptions, {
      bodyid : 'host',
      url : url,
      id : id
    });

    res.render('host', options);
  }


  // get a room
  function room(req, res){
    var id = req.params.id;

    // TODO: if host doesn't exist, redirect
    // TODO: if host exists, connect to websockets
    // TODO: list available files
    // TODO:

    var fileHelper = require('../../lib/file-helper');
        fileHelper.listFiles("./public/sfx", function(err, files){

          var options = _.extend(pageOptions, {
            bodyid : 'room',
            id : id,
            files : files
          });

          res.render('room', options);
    });
  }



/*
 * POST methods
 */

  // create a new host (if one doesn't already exist)
  function createHost(req, res){
    var id = req.body.id;
    if (id) {
      res.redirect('/host/'+id);
    } else {
      res.redirect('/');
    }
  }

// expose routes
};