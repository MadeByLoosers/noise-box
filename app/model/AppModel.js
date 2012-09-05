/**
 * NoiseBox
 * AppModel.js
 *
 * Root Backbone Model for the whole app.
 */

var Backbone = require("backbone");
var NBCollection = require("./NBCollection");
var NBHomeCollection = require("./NBHomeCollection");
var server = require("./../../server");
var constants;

var AppModel = module.exports = Backbone.Model.extend({

    defaults : {

    },

    initialize : function () {

        constants = server.constants;

        this.noiseBoxes = new NBCollection();
        this.homeClients = new NBHomeCollection();

        this.noiseBoxes.on("add",function (nbModel) {
            this.trigger(constants.NOISEBOX_ADDED,nbModel);
        },this);

        this.noiseBoxes.on("remove",function (nbModel) {
            this.trigger(constants.NOISEBOX_REMOVED,nbModel);
        },this);

        this.homeClients.on("add",function (homeClientModel) {
            this.trigger(constants.HOME_ADDED,homeClientModel);
        },this);

        this.homeClients.on("remove",function (homeClientModel) {
            this.trigger(constants.HOME_REMOVED,homeClientModel);
        },this);
    },

    addHomeClient : function (id,socket) {

        this.homeClients.add({id:id,socket:socket});
    },

    removeHomeClient : function (id) {

        this.homeClients.remove(this.getHomeClient(id));
    },

    getHomeClient : function (id) {

        return this.homeClients.get(id);
    },

    homeClientExists : function (id) {

        return this.getHomeClient(id) !== undefined;
    },

    addNoiseBox : function (id) {

        this.noiseBoxes.add({id:id});

        var noiseBox = this.getNoiseBox(id);

        noiseBox.users.on("add",function (nbUserModel) {
            this.trigger(constants.USER_ADDED,nbUserModel);
        },this);

        noiseBox.users.on("remove",function (nbUserModel) {
            this.trigger(constants.USER_REMOVED,nbUserModel);
        },this);

        noiseBox.hosts.on("add",function (nbHostModel) {
            this.trigger(constants.HOST_ADDED,nbHostModel);
        },this);

        noiseBox.hosts.on("remove",function (nbHostModel) {
            this.trigger(constants.HOST_REMOVED,nbHostModel);
        },this);

        noiseBox.on("change:track",function (nbModel) {
            this.trigger(constants.TRACK_CHANGED,nbModel);
        },this);

        return noiseBox;
    },

    removeNoiseBox : function (id) {

        var noiseBox = this.getNoiseBox(id);

        noiseBox.off();
        noiseBox.users.off();
        noiseBox.hosts.off();

        this.noiseBoxes.remove(noiseBox);
    },

    noiseBoxExists : function (id) {

        return this.getNoiseBox(id) !== undefined;
    },

    getNoiseBox : function (id) {

        return this.noiseBoxes.get(id);
    },

    getNoiseBoxByClientSocketID : function (id) {

        var found;

        this.noiseBoxes.each(function (noiseBox) {

            if ( noiseBox.clientExists(id) ) {

                found = noiseBox;
            }
        });

        return found;
    },

    getNumConnectedClients : function () {

        var numClients = this.homeClients.length;

        var numHosts = 0;
        var numUsers = 0;

        this.noiseBoxes.each(function (noiseBox) {

            numClients = numClients + noiseBox.hosts.length;
            numClients = numClients + noiseBox.users.length;
        });

        return numClients;
    }
});