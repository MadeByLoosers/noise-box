/*
 * Noise Box
 *
 * App
 */
module.exports = function(app, io) {



  /*
   * Scratch area
   *
   */

  var rooms = {};


  // create room
  var Room = function(){
      this.clients = []; // socket.io can manage connections...
      this.playqueue = [];
      this.history = [];
  };
  Room.prototype.addTrack = function() {
    // add track to play queue
  };
  // etc



  // add a room
  var room = new Room();
  rooms['test'] = room;


  /**
   * Socket testing
   */
  io.sockets.on('connection', function (socket) {

    // send a message out
    socket.emit('message', { content: 'you joined the room' });
    socket.broadcast.emit('message', { content: 'someone else joined the room' });

    // add a track to the queue
    socket.on('addTrack', function (data) {
      console.log('a track was added');
    });

  });

};