var util = require("util");
var events = require("events");

var HostModel = function (name,ownerID) {

    this.name = name;
    this.ownerID = ownerID;
    this.queue = [];
    this.clients = [];
    this.trackIndex = 0;

    events.EventEmitter.call(this);
};

HostModel.prototype = {

    TRACK_COMPLETE : "trackComplete",
    TRACK_STARTED : "trackStarted",
    QUEUE_CHANGED : "queueChanged",

    name : "Unnamed Room",
    ownerID : "undefined ownerID",
    queue : [],
    clients : [],
    trackIndex : -1
};

util.inherits(HostModel,events.EventEmitter);

HostModel.prototype.addClient = function (client) {

    this.clients.host = this;
    this.clients.push(client);
};

HostModel.prototype.removeClient = function (clientID) {

    var i;
    for ( i=0; i<this.clients.length; i=i+1 ) {

        if ( this.clients[i].clientID === clientID ) {

            this.clients.splice(i,1);
        }
    }
};

HostModel.prototype.addTrack = function (track) {

    this.queue.push(track);
console.log('running hostmodel.addTrack');
util.inspect(this.queue);
console.log(HostModel.QUEUE_CHANGED);

    this.emit(HostModel.QUEUE_CHANGED,this.queue);
};

HostModel.prototype.queueChanged = function (queue) {

	console.log('running queueChanged');
	util.inspect(queue);

	// send queue to clients

};

HostModel.prototype.notifyTrackStarted = function () {

    this.emit(HostModel.TRACK_STARTED,this.trackIndex);
};

HostModel.prototype.notifyTrackComplete = function () {

    this.trackIndex = this.trackIndex + 1;

    this.emit(HostModel.TRACK_COMPLETE,this.trackIndex);
};

HostModel.prototype.toString = function() {

    var s = "[object HostModel]";

    //s = s + "  name : "+name;

};

module.exports = HostModel;