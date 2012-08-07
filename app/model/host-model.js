var sys = require("sys");
var events = require("events");

var HostModel = function (id, ownerID) {

    this.id = id;
    this.owner = ownerID;
    this.queue = [];
    this.trackIndex = -1;
    this.clients = [];

    events.EventEmitter.call(this);
};
sys.inherits(HostModel, events.EventEmitter);

HostModel.prototype = {

    id : 0,
    queue : undefined,
    clients : undefined,
    trackIndex : 0,
    INDEX_CHANGED : "indexChanged",
    QUEUE_CHANGED : "queueChanged"
};

HostModel.prototype.removeClient = function () {

}

HostModel.prototype.addTrack = function (track) {

    this.queue.push(track);

    this.emit(HostModel.QUEUE_CHANGED, this.queue);
};

HostModel.prototype.notifyTrackStarted = function () {

};

HostModel.prototype.notifyTrackComplete = function () {

    this.trackIndex = this.trackIndex + 1;

    this.emit(HostModel.INDEX_CHANGED, this.trackIndex);
};

module.exports = HostModel;