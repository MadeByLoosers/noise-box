var HostModel = require("./host-model");

var ClientModel = function (clientID,hostModel) {

    this.clientID = clientID;
    this.hostModel = hostModel;

    hostModel.on(HostModel.TRACK_STARTED,this.onHostTrackStarted);
    hostModel.on(HostModel.TRACK_COMPLETE,this.onHostTrackComplete);
    hostModel.on(HostModel.QUEUE_CHANGED,this.onHostQueueChanged);
};

ClientModel.prototype = {

    clientID : 0,
    hostModel : undefined
};

ClientModel.prototype.onHostTrackStarted = function (trackIndex) {

};

ClientModel.prototype.onHostTrackComplete = function (trackIndex) {

};

ClientModel.prototype.onHostQueueChanged = function (queue) {


};

module.exports = ClientModel;