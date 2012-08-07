var util = require("util");
var events = require("events");

var HostModel = require("./host-model");

var ClientModel = function (clientID,host) {

    this.clientID = clientID;
    this.host = host;

    host.on(HostModel.TRACK_STARTED,this.onHostTrackStarted);
    host.on(HostModel.TRACK_COMPLETE,this.onHostTrackComplete);
    host.on(HostModel.QUEUE_CHANGED,this.onHostQueueChanged);

    events.EventEmitter.call(this);
};

ClientModel.prototype = {

    QUEUE_CHANGED : "queueChanged",

    clientID : 0,
    hostModel : {}
};

ClientModel.prototype.onHostQueueChanged = function (queue) {

    this.emit(ClientModel.QUEUE_CHANGED,queue);
};

util.inherits(HostModel,events.EventEmitter);
module.exports = ClientModel;