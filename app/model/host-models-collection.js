var _ = require("underscore");

var HostModelsCollection = function () {

    this.hosts = [];
};

HostModelsCollection.prototype = {

    hosts : []
}

HostModelsCollection.prototype.addHost = function (host) {

    this.hosts.push(host);
};

HostModelsCollection.prototype.removeHost = function (name) {

    var i;
    for ( i=0; i<this.hosts.length; i=i+1 ) {

        if ( this.hosts[i].name === name ) {

            this.hosts.splice(i,1);
        }
    }
};

HostModelsCollection.prototype.hostExists = function (name) {

    return this.getHostByName(name) !== undefined;
};

HostModelsCollection.prototype.getHostByName = function(name) {

   return _.find(this.hosts,function (host) {

       return host.name === name;
   });
};

HostModelsCollection.prototype.getNumHosts = function () {

    return this.hosts.length;
};

module.exports = HostModelsCollection;