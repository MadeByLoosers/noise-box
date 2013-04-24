/**
 * NoiseBox
 * AppModel.js
 *
 * Root Backbone Model for the whole app.
 */

var Backbone = require("backbone");
var NBCollection = require("./NBCollection");
var NBHomeModel = require("./NBHomeModel");
var server = require("./../../server");
var constants;

var AppModel = module.exports = Backbone.Model.extend({

    defaults : {

    },

    initialize : function () {

        constants = server.constants;

        this.homeModel = new NBHomeModel();
        this.noiseBoxes = new NBCollection();

        this.noiseBoxes.on("add",function (nbModel) {
            this.trigger(constants.NOISEBOX_ADDED,nbModel);
        },this);

        this.noiseBoxes.on("remove",function (nbModel) {
            this.trigger(constants.NOISEBOX_REMOVED,nbModel);
        },this);
    },

    getHomeModel : function () {
        return this.homeModel;
    },

    getFiles : function () {
        return this.files;
    },

    addNoiseBox : function (id) {

        this.noiseBoxes.add({id:id});

        var nb = this.getNoiseBox(id);

        nb.users.on("add",function (nbUserModel) {
            this.trigger(constants.USER_ADDED,nbUserModel, constants.USER_ADDED);
        },this);

        nb.users.on("change",function (nbUserModel) {
            this.trigger(constants.USER_UPDATED,nbUserModel, constants.USER_UPDATED);
        },this);

        nb.users.on("remove",function (nbUserModel) {
            this.trigger(constants.USER_REMOVED,nbUserModel, constants.USER_REMOVED);
        },this);

        nb.hosts.on("add",function (nbHostModel) {
            this.trigger(constants.HOST_ADDED,nbHostModel);
        },this);

        nb.hosts.on("remove",function (nbHostModel) {
            this.trigger(constants.HOST_REMOVED,nbHostModel);
        },this);

        nb.tracks.on("add",function (nbTrackModel) {
            this.trigger(constants.TRACK_ADDED,nbTrackModel, nb);
        },this);

        nb.tracks.on("remove",function (nbTrackModel) {
            this.trigger(constants.TRACK_REMOVED,nbTrackModel, nb);
        },this);

        nb.log.on("change",function (item, nbLog) {
            this.trigger(constants.LOG_UPDATED, item, nbLog, nb);
        }, this);

        return nb;
    },

    removeNoiseBox : function (id) {

        var nb = this.getNoiseBox(id);

        nb.off();
        nb.users.off();
        nb.hosts.off();

        this.noiseBoxes.remove(nb);
    },

    noiseBoxExists : function (id) {

        return this.getNoiseBox(id) !== undefined;
    },

    getNoiseBox : function (id) {

        return this.noiseBoxes.get(id);
    },

    getNoiseBoxByClientSocketID : function (id) {

        var found;

        this.noiseBoxes.each(function (nb) {

            if ( nb.clientExists(id) ) {

                found = nb;
            }
        });

        return found;
    },

    getNumConnectedClients : function () {

        var numClients = 0;
        var numHosts = 0;
        var numUsers = 0;

        this.noiseBoxes.each(function (nb) {

            numClients = numClients + nb.hosts.length;
            numClients = numClients + nb.users.length;
        });

        return numClients;
    }
});
