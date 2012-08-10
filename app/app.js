/*
 * Noise Box
 *
 * App
 */
var _ = require('underscore');
var AppModel = require("./model/AppModel");

var HostModel = require('./model/host-model');
var ClientModel = require('./model/client-model');
var HostModelsCollection = require('./model/host-models-collection');
var ClientModelsCollection = require('./model/client-models-collection');

module.exports = function(app, io) {

    var appModel = new AppModel();



  // global host and client collections
  var hosts = new HostModelsCollection();
  var clients = new ClientModelsCollection();

  // event setup
  io.sockets.on('connection', function (socket) {
    //testing counter...
    var count = 0;

    // host created
    socket.on('host', function (data) {
      createHost(data.name, socket);
    });

    // host finished playing
    socket.on('finishedPlay', function (data) {
      finishedPlay(data.name, socket);
    });

    // client joins a host
    socket.on('join', function (data) {
      addClient(data.name, socket);
    });

    // client adds a track to the queue
    socket.on('addTrack', function (data) {
      addTrack(data.trackName, socket);
    });

  });



  /**
   * Create a new host
   * @param  {string} hostName The unique name for this host
   * @param  {string} clientID A reference to the owner of this host
   */
  var createHost = function(hostName, socket){
    var host = new HostModel(hostName, socket.id);
    console.log('created room: ' + hostName);

    host.on('play', function(queue){
      console.log('triggered host play message with queue: ', queue);
      var data = {
        path: queue[0]
      }

      socket.emit('play', data);
    })

    // store owner id
    host.ownerID = socket.id;
    hosts.addHost(host);
  }


  // when a host has finished playing
  var finishedPlay = function(hostName, socket){
    var host = hosts.getHostByName(hostName);

    // remove first item from array
    host.queue.shift();

    if (host.queue.length > 0) {
      host.emit('play',host.queue);
    }
      //Place queue logic here.

      // //TESTING CODE
      // //Play another if we've tried
      // count++;
      // if(count  < 2){
      //   socket.emit('play', {
      //     path:'/sfx/tv/simpsons_computers.wav'
      //   });
      // }
  }


  // add a track to a queue
  var addTrack = function(trackName, socket){
      var host = clients.getHostByClientID(socket.id);

      console.log(socket.id + ' is adding track ' + trackName);
      console.log('host typeof is ', typeof host);

      host.addTrack(trackName);
  }


  // add a client to a host
  var addClient = function (hostName, socket) {
    var host = hosts.getHostByName(hostName);
    var message = socket.id + ' joined the room: ' + hostName;
    var client;

    // host does not exist, handle error here
    if (typeof host === 'undefined') {
      console.log('room name "' + hostName + '" does not exist');
      return false;
    }

    // add new client to host
    client = new ClientModel(socket.id, host);
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