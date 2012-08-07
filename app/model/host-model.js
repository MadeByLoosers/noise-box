var sys = require("sys");
var events = require("events");

var HostModel = function (id) {

    this.id = id;
    this.queue = [];
    this.trackIndex = -1;
    this.clients = [];

    events.EventEmitter.call(this);
};
sys.inherits(HostModel, events.EventEmitter);

HostModel.prototype = {

    id : 0,
    queue : undefined,
    trackIndex : 0
};

HostModel.prototype.addTrack = function (track) {

    this.queue.push(track);
};

HostModel.prototype.notifyTrackStarted = function () {


};

HostModel.prototype.notifyTrackComplete = function () {

};

module.exports = HostModel;

// var host = new HostModel('1');