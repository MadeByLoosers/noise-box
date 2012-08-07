/*
* Noise-Box Namespace
*/
var NB = {};

var hostName =  $('#room-name').data('room-name');

/**
* Initialize Socket IO.
* returns true|false 
*/
NB.initSocket = function(){

  //Do we have socket io included?
  if(typeof io === 'object'){

    //Connect to local host
  	NB.socket = io.connect('http://'+window.location.hostname+':3000');

    //Default message recieved.
    NB.socket.on('message', function(data){
      console.log('received message: ', data);
    });

    return true;
  }else{

    console.error('socket.io has not loaded correctly.');

    return false;
  }

};

/**
* Entry point for Host page.
*/
NB.initHostPage = function(){

  //Notify backend of new host
  NB.socket.emit('host', { name: hostName });

  //Wait for play commands
  NB.socket.on('play', function(data){
    var path = data.content.path;
    console.log(path);
    //Play
    NB.player.play(path, function(){
      NB.socket.emit('finishedPlay', {path:path});
    });


  });
}


NB.player = (function() {
  'use strict';

  var player = {
    element: document.getElementById('audioPlayer'),
    play: function (fileUrl, completeCallback) {
      this.element.addEventListener('ended', function(){
        completeCallback();
      })
      this.element.src = fileUrl;
      this.element.play();
    }
  };

  return player;

}());


$(document).ready(function(e){
	
  if(NB.initSocket()){

    switch($('body').attr('id')){
      case 'home':

      break;

      case 'host':
        NB.initHostPage();
      break;

      case 'room':
        NB.socket.emit('join', { name: hostName });
      break;

    }
  }
});



