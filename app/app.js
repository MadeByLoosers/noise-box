/*
 * Noise Box
 *
 * App
 */
var _ = require('underscore');

var HostModel = require('./model/host-model');
var ClientModel = require('./model/client-model');
var HostModelsCollection = require('./model/host-models-collection');
var ClientModelsCollection = require('./model/client-models-collection');

module.exports = function(app, io) {

  /*
   * Scratch area
   *
   */

  var hosts = new HostModelsCollection();
  var clients = new ClientModelsCollection();

    var hostTest = new HostModel();

    console.log(hostTest.addTrack);
    console.log(hostTest.on);

  /**
   * Socket testing
   */
  io.sockets.on('connection', function (socket) {
    //testing counter...
    var count = 0;


    socket.on('host', function (data) {
      var host = new HostModel(data.name, socket.id);
      console.log('created room: ' + data.name);

      // store owner id
      host.ownerID = socket.id;
      hosts.addHost(host);

      // test play
      // socket.emit('play', {
      //   content: {path:'/sfx/tv/simpsons_website.wav'}
      // });
    });

    //Host finished playing
    socket.on('finishedPlay', function (data) {

        //Place queue logic here.

        //TESTING CODE
        //Play another if we've tried
        count++;
        if(count  < 2){
          socket.emit('play', {
            content: {path:'/sfx/tv/simpsons_computers.wav'}

          });
        }
    });

    // a new client
    socket.on('join', function (data) {
      var host = hosts.getHostByName(data.name);
      var client;

      // host does not exist, handle error here
      if (typeof host === 'undefined') {
        console.log('room name "' + data.name + '" does not exist');
        return false;
      }

      // add new client to host
      // host.clients.push(new ClientModel(socket.id, host));
      client = new ClientModel(socket.id, host);
      clients.addClient(client);

      // queue change
      client.on(ClientModel.QUEUE_CHANGED, function(queue){
        // socket.emit();
        console.log('ClientModel.QUEUE_CHANGED');
      });


      console.log('joined room: ' + host.name);

      // // get ids of all clients
      // var clientIDs = _.map(host.clients, function(client){
      //   return client.clientID;
      // });

      // tell people you've joined
      socket.emit('message', {
        content: 'you joined the room ' + host.name//,
        // clients: clientIDs
      });

      socket.broadcast.emit('message', {
        content: client.clientID + ' joined the room ' + host.name//,
        // clients: clientIDs
      });
    });

    // a new client
    socket.on('addTrack', function (data) {
      var trackName = data.trackName;
      var clientID = socket.id;
      var host = clients.getHostByClientID(clientID);

      console.log(clientID + ' is adding track ' + trackName);
      console.log('host typeof is ', typeof host);

      host.addTrack(trackName);
    });

  });

};