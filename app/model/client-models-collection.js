var ClientModelsCollection = function () {

    this.clients = [];
};

ClientModelsCollection.prototype = {

    clients : []
};

ClientModelsCollection.prototype.addClient = function (client) {

    this.clients.push(client);
};

ClientModelsCollection.prototype.removeClient = function (clientID) {

    var i;
    for ( i=0; i<this.clients.length; i=i+1 ) {

        if ( this.clients[i].clientID === clientID ) {

            this.clients.splice(i,1);
        }
    }
};

ClientModelsCollection.prototype.clientExists = function (clientID) {

    return this.getClientByName(clientID) !== undefined;
};

ClientModelsCollection.prototype.getClientByClientID = function(clientID) {

    var i;
    for ( i=0; i<this.clients.length; i=i+1 ) {

        if ( this.clients[i].clientID === clientID ) {

            return this.clients[i];
        }
    }
};

ClientModelsCollection.prototype.getHostByClientID = function(clientID) {

    var client = this.getClientByClientID(clientID);

    return client.host;
};

ClientModelsCollection.prototype.getNumClients = function () {

    return this.clients.length;
};

module.exports = ClientModelsCollection;