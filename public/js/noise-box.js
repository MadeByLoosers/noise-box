/*
* Noise-Box Namespace
*/
var NB = {};


NB.initSocket = function(){

	var socket = io.connect('http://'+window.location.hostname+':3000');
	  socket.on('message', function (data) {
	    var p = document.createElement('p');
	    p.innerHTML = data.content;
	    document.body.appendChild(p); 

	    console.log(data);
	    // socket.emit('my other event', { my: 'data' });
	});	
};



$(document).ready(function(e){
	
	NB.initSocket();
});



