/**
 * NoiseBox
 * AppModel.js
 *
 * Root Backbone Model for the whole app.
 */

var Backbone = require("backbone");
var NBCollection = require("./NBCollection");
var NBHomeClientCollection = require("./NBHomeClientCollection");

var AppModel = module.exports = Backbone.Model.extend({

    defaults : {

    },

    initialize : function () {

        this.noiseBoxes = new NBCollection();
        this.homeClients = new NBHomeClientCollection();
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

    addNoiseBox : function (name) {

        this.noiseBoxes.add({name:name});

        return this.getNoiseBox(name);
    },

    noiseBoxExists : function (name) {

        return this.getNoiseBox(name) !== undefined;
    },

    getNoiseBox : function (name) {

        var results = this.noiseBoxes.where({name:name});

        return results[0];
    },

    getNoiseBoxBySocketID : function (id) {

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