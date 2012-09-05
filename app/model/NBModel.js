var Backbone = require("backbone");
var NBUserCollection = require("./NBUserCollection");
var NBHostCollection = require("./NBHostCollection");
var server = require("./../../server");
var constants = server.constants;

var NBModel = module.exports = Backbone.Model.extend({

    defaults : {
    },

    initialize : function () {

        this.track = "";
        this.users = new NBUserCollection();
        this.hosts = new NBHostCollection();
    },

    clientExists : function (id) {

        return this.hostExists(id) || this.userExists(id);
    },

    addHost : function (id,socket) {

        this.hosts.add({id:id,socket:socket,parentNoiseBoxID:this.id});

        return this.hosts.get(id);
    },

    removeHost : function (id) {

        this.hosts.remove(this.getHost(id));
    },

    getHost : function (id) {

        return this.hosts.get(id);
    },

    getHostBySocket : function (socket) {

        var foundHost;

        this.hosts.each(function (host) {

            if ( host.socket.id === socket.id ) {

                foundHost = host;
            }
        });

        return foundHost;
    },

    hostExists : function (id) {

        return this.getHost(id) !== undefined;
    },

    addUser : function (id,socket) {

        this.users.add({id:id,socket:socket,parentNoiseBoxID:this.id});

        return this.users.get(id);
    },

    removeUser : function (id) {

        this.users.remove(this.getUser(id));
    },

    getUser : function (id) {

        return this.users.get(id);
    },

    getUserBySocket : function (socket) {

        var foundUser;

        this.users.each(function (user) {

            if ( user.socket.id === socket.id ) {

                foundUser = user;
            }
        });

        return foundUser;
    },

    userExists : function (id) {

        return this.getUser(id) !== undefined;
    }
});