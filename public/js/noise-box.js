/*
* Noise-Box Namespace
*/
var NB = {};


NB.initSocket = function(){

	NB.socket = io.connect('http://'+window.location.hostname+':3000');

  NB.socket.on('message', function(data){
    console.log('received message: ', data);
  });

};



$(document).ready(function(e){
	
  NB.initSocket();

  switch($('body').attr('id')){
    case 'home':

    break;

    case 'host':
      NB.socket.emit('host', { name: 'test' });
    break;

    case 'room':
      NB.socket.emit('join', { name: 'test '});
    break;

  }

	
});



