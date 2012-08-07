/*
* Noise-Box Namespace
*/
var NB = {};


NB.initSocket = function(){

	NB.socket = io.connect('http://'+window.location.hostname+':3000');
	 
 //      socket.emit('join', { name: <%= id %> });

 //      socket.on('message', function(data){
 //        console.log('received message: ', data);
 //      });


 //      /// HOST
 //      var socket = io.connect('http://mikebook.local:3000');
 //        socket.emit('host', { name: <%= id %> });
 //      });
};



$(document).ready(function(e){
	
  NB.initSocket();

  switch($('body').attr('id')){
    case 'home':

    break;

    case 'host':

    break;

    case 'room':

    break;

  }

	
});



