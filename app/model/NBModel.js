var Backbone = require("backbone");
var NBUserCollection = require("./NBUserCollection");
var NBHostCollection = require("./NBHostCollection");
var server = require("./../../server");
var constants = server.constants;

var NBModel = module.exports = Backbone.Model.extend({

    defaults : {
    },

    initialize : function () {
        "use strict";

        this.track = "";
        this.users = new NBUserCollection();
        this.hosts = new NBHostCollection();
    },

    clientExists : function (id) {
        "use strict";

        return this.hostExists(id) || this.userExists(id);
    },

    addHost : function (id,socket) {
        "use strict";

        this.hosts.add({id:id,socket:socket,parentNoiseBoxID:this.id});

        return this.hosts.get(id);
    },

    removeHost : function (id) {
        "use strict";

        this.hosts.remove(this.getHost(id));
    },

    getHost : function (id) {
        "use strict";

        return this.hosts.get(id);
    },

    getHostBySocket : function (socket) {
        "use strict";

        var foundHost;

        this.hosts.each(function (host) {

            if ( host.socket.id === socket.id ) {

                foundHost = host;
            }
        });

        return foundHost;
    },

    hostExists : function (id) {
        "use strict";

        return this.getHost(id) !== undefined;
    },

    addUser : function (id,socket) {
        "use strict";

        this.users.add({id:id,socket:socket,parentNoiseBoxID:this.id});

        return this.users.get(id);
    },

    removeUser : function (id) {
        "use strict";

        this.users.remove(this.getUser(id));
    },

    getUser : function (id) {
        "use strict";

        return this.users.get(id);
    },

    getUserBySocket : function (socket) {
        "use strict";

        var foundUser;

        this.users.each(function (user) {

            if ( user.socket.id === socket.id ) {

                foundUser = user;
            }
        });

        return foundUser;
    },

    userExists : function (id) {
        "use strict";

        return this.getUser(id) !== undefined;
    }
});