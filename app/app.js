/*
 * Noise Box
 *
 * App
 */
var _ = require('underscore');

var HostModel = require('./model/host-model');
var ClientModel = require('./model/client-model');

module.exports = function(app, io) {

  /*
   * Scratch area
   *
   */

  var hosts = [];

  // // create room
  // var Room = function(){
  //     this.clients = []; // socket.io can manage connections...
  //     this.playqueue = [];
  //     this.history = [];
  // };
  // Room.prototype.addTrack = function() {
  //   // add track to play queue
  // };
  // // etc



  // // add a room
  // var room = new Room();
  // rooms['test'] = room;


  /**
   * Socket testing
   */
  io.sockets.on('connection', function (socket) {
    // a new host

    //testing counter...
    var count = 0;


    socket.on('host', function (data) {
      console.log('a room was hosted', data.name);

      var host = new HostModel(data.name);
      console.log('created room: ' + data.name);
      // store owner id
      host.ownerID = socket.id; 
      hosts.push(host);

      socket.emit('play', {
        content: {path:'/sfx/tv/simpsons_website.wav'}

      });
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
      console.log('a room was joined', data.name);
      var host = _.find(hosts, function(host) {
        return host.name = data.name;
      });

      // add new client to host
      host.clients.push(new ClientModel(socket.id, host));

      // get ids of all clients
      var clientIDs = _.map(host.clients, function(client){ 
        return client.clientID; 
      });

      // send a message out
      socket.emit('message', { 
        content: 'you joined the room ' + host.name,
        clients: clientIDs
      });

      socket.broadcast.emit('message', { 
        content: socket.id + ' joined the room ' + host.name,
        clients: clientIDs
      });



    });

  });

};