var util = require("util");
var events = require("events");

var HostModel = function (name,ownerID) {

    this.name = name;
    this.ownerID = ownerID;
    this.queue = [];
    this.clients = [];
    this.trackIndex = 0;
    this.clients = [];

    events.EventEmitter.call(this);
};
util.inherits(HostModel,events.EventEmitter);

HostModel.prototype = {

    name : 0,
    ownerID : 0,
    queue : undefined,
    clients : undefined,
    trackIndex : 0,
    TRACK_COMPLETE : "trackComplete",
    TRACK_STARTED : "trackStarted",
    QUEUE_CHANGED : "queueChanged"
};

HostModel.prototype.addClient = function (clientID) {

    this.clients.push(clientID);
};

HostModel.prototype.removeClient = function (clientID) {

    var i;
    for ( i=0; i<this.clients.length; i=i+1 ) {

        if ( this.clients[i] === clientID ) {

            this.clients.splice(i,1);
        }
    }
};

HostModel.prototype.addTrack = function (track) {

    this.queue.push(track);

    this.emit(HostModel.QUEUE_CHANGED,this.queue);
};

HostModel.prototype.notifyTrackStarted = function () {

    this.emit(HostModel.TRACK_STARTED,this.trackIndex);
};

HostModel.prototype.notifyTrackComplete = function () {

    this.trackIndex = this.trackIndex + 1;

    this.emit(HostModel.TRACK_COMPLETE,this.trackIndex);
};

module.exports = HostModel;