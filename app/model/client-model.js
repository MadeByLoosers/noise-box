var util = require("util");
var events = require("events");
//var _ = require("underscore");

function ClientModel (clientID,host) {

    this.clientID = clientID;
    this.host = host;

    host.on(host.QUEUE_CHANGED,this.updateQueue);

    events.EventEmitter.call(this);
}

util.inherits(ClientModel,events.EventEmitter);


ClientModel.prototype.updateQueue = function (queue) {

    // console.log('running onHostQueueChanged with queue: ', queue);
};

//ClientModel = _.extend(ClientModel,events.EventEmitter);
module.exports = ClientModel;