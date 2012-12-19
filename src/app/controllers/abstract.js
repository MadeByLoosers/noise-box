/**
 * NoiseBox
 * abstract.js
 *
 * Abstract route controller for host and user routes.
 */

var server = require("./../../server");
var app = server.app;
var io = server.io;
var model = server.model;
var constants = server.constants;
var templateOptions = require("./../middleware/template-options");
var stats = require("./../middleware/stats");

var AbstractController = function () {

    // Start listening for updates from the model:

    model.on(constants.USER_ADDED,updateNoiseBoxStats);
    model.on(constants.USER_REMOVED,updateNoiseBoxStats);
    model.on(constants.USER_ADDED,userChanged);
    model.on(constants.USER_UPDATED,userChanged);
    model.on(constants.USER_REMOVED,userChanged);
    model.on(constants.HOST_ADDED,updateNoiseBoxStats);
    model.on(constants.HOST_ADDED,listUsers);
    model.on(constants.HOST_REMOVED,updateNoiseBoxStats);
    model.on(constants.TRACK_ADDED,trackAdded);
    model.on(constants.TRACK_REMOVED,trackRemoved);
    model.on(constants.LOG_UPDATED,logUpdated);



    /**
     * A NoiseBox track has been added, so loop through the box's hosts and tell them to
     * each add the track.
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    function trackAdded (nbTrackModel, nb) {

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.SERVER_ADD_TRACK,{
                track: nbTrackModel.get("track"),
                user: nbTrackModel.get("user"),
                datetime: nbTrackModel.get("datetime"),
                cid: nbTrackModel.cid
            });
        });
    }



    /**
     * A NoiseBox track has been removed, so loop through the box's hosts and tell them to
     * each remove the track.
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    function trackRemoved (nbTrackModel, nb) {

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.SERVER_REMOVE_TRACK,{track:nbTrackModel.get("track")});
        });
    }


    /**
     * A NoiseBox client (user or host) has been added or removed so we need to loop through all the
     * hosts for the client's NoiseBox and tell them to update their stats.
     *
     * @param nbClient NBHost or NBUser instance that has been added or removed.
     */
    function updateNoiseBoxStats (nbClient) {

        var nb = model.getNoiseBox(nbClient.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.SERVER_NOISE_BOX_STATS_UPDATED,{numHosts:nb.hosts.length,numUsers:nb.users.length});
        });
    }


    /**
     * When a NoiseBox host is added, list any users who are already connected
     *
     * @param nbClient NBHost instance that has been added
     */
    function listUsers (nbHost) {

        var nb = model.getNoiseBox(nbHost.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.users.each(function (user) {
            nbHost.get("socket").emit(constants.USER_ADDED, {username: user.get("username"), id: user.get("id")});
        });
    }


    /**
     * A NoiseBox user has been added/updated/removed so we need to update the username list
     *
     * @param nbClient NBUser instance that has been added/updated/removed
     */
    function userChanged (nbUser, eventType) {

        var nb = model.getNoiseBox(nbUser.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.hosts.each(function (host) {
            host.get("socket").emit(eventType, {username: nbUser.get("username"), id: nbUser.get("id")});
        });
    }


    /**
     * A NoiseBox log has been updated, so emit the latest log changes
     *
     * @param item the log item
     * @param nbLog NBLog instance that has been updated
     * @param nb NB instance
     */
    function logUpdated (item, nbLog, nb) {

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.LOG_UPDATED, item);
        });
    }


    /**
     * Validate a NoiseBox id.
     */
    function isValidNoiseBoxID (id) {

        var valid = true;

        if ( typeof id !== "string" ) {
            valid = false;
        }

        if ( id === "" ) {
            valid = false;
        }

        if ( id.length > 20 ) {
            valid = false;
        }

        if ( !id.match(/^[a-zA-Z0-9]+$/) ) {
            valid = false;
        }

        return valid;
    }
};

module.exports = AbstractController;