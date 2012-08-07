/*
 * Noise Box
 *
 * App
 */
module.exports = function(app) {



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

};