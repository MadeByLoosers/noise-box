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
  // global host and client collections
  var hosts = new HostModelsCollection();
  var clients = new ClientModelsCollection();

  // event setup
  io.sockets.on('connection', function (socket) {
    //testing counter...
    var count = 0;

    // host created
    socket.on('host', function (data) {
      createHost(data.name, socket.id);
    });

    // host finished playing
    socket.on('finishedPlay', function (data) {
      finishedPlay();
    });

    // client joins a host
    socket.on('join', function (data) {
      addClient(data.name, socket.id);
    });

    // client adds a track to the queue
    socket.on('addTrack', function (data) {
      addTrack(data.trackName, socket.id);
    });

  });



  /**
   * Create a new host
   * @param  {string} hostName The unique name for this host
   * @param  {string} clientID A reference to the owner of this host
   */
  var createHost = function(hostName, ownerID){
    var host = new HostModel(hostName, ownerID);
    console.log('created room: ' + hostName);

    // store owner id
    host.ownerID = ownerID;
    hosts.addHost(host);
  }


  // when a host has finished playing
  var finishedPlay = function(){

      //Place queue logic here.

      //TESTING CODE
      //Play another if we've tried
      count++;
      if(count  < 2){
        socket.emit('play', {
          content: {path:'/sfx/tv/simpsons_computers.wav'}

        });
      }
  }


  // add a track to a queue
  var addTrack = function(trackName, clientID){
      var host = clients.getHostByClientID(clientID);

      console.log(clientID + ' is adding track ' + trackName);
      console.log('host typeof is ', typeof host);

      host.addTrack(trackName);
  }


  // add a client to a host
  var addClient = function (hostName, clientID) {
    var host = hosts.getHostByName(hostName);
    var message = clientID + ' joined the room: ' + hostName;
    var client;

    // host does not exist, handle error here
    if (typeof host === 'undefined') {
      console.log('room name "' + hostName + '" does not exist');
      return false;
    }

    // add new client to host
    client = new ClientModel(clientID, host);
    clients.addClient(client);

    // queue change
    client.on(ClientModel.QUEUE_CHANGED, function(queue){
      console.log('ClientModel.QUEUE_CHANGED');
    });

    console.log(message);

    // announce new client
    io.sockets.emit('message', {
      content: message
    });
  }

};