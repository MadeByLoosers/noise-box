var HostModel = require("./host-model");

var ClientModel = function (clientID,hostModel) {

    this.clientID = clientID;
    this.hostModel = hostModel;

    hostModel.on(HostModel.INDEX_CHANGED,this.onHostTrackIndexChanged);
    hostModel.on(HostModel.QUEUE_CHANGED,this.onHostQueueChanged);
};

ClientModel.prototype = {

    clientID : 0,
    hostModel : undefined
};

ClientModel.prototype.onHostTrackIndexChanged = function (trackIndex) {

    // Emit change to client's socket
};

ClientModel.prototype.onHostQueueChanged = function (queue) {

    // Emit change to client's socket
};

module.exports = ClientModel;