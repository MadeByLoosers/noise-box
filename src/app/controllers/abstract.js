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
var moment = require("./../lib/moment");

var AbstractController = {

    /**
     * A NoiseBox track has been added, so loop through the box's hosts and tell them to
     * each add the track.
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    trackAdded : function (nbTrackModel, nb) {

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.SERVER_ADD_TRACK,{
                track: nbTrackModel.get("track"),
                user: nbTrackModel.get("user"),
                datetime: nbTrackModel.get("datetime"),
                cid: nbTrackModel.cid
            });
        });

        nb.users.each(function (user) {
            user.get("socket").emit(constants.SERVER_ADD_TRACK,{
                track: nbTrackModel.get("track"),
                user: nbTrackModel.get("user"),
                datetime: nbTrackModel.get("datetime"),
                cid: nbTrackModel.cid
            });
        });
    },


    /**
     * A NoiseBox track has been removed, so loop through the box's hosts and tell them to
     * each remove the track.
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    trackRemoved : function (nbTrackModel, nb) {

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.SERVER_REMOVE_TRACK,{track:nbTrackModel.get("track")});
        });

        nb.users.each(function (user) {

            user.get("socket").emit(constants.SERVER_REMOVE_TRACK,{track:nbTrackModel.get("track")});
        });
    },


    /**
     * A NoiseBox track is playing, so loop through the box's hosts and tell them
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    trackPlaying : function (data) {

        var nb = model.getNoiseBox(data.id);

        if ( !nb ) { return; }

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.HOST_TRACK_PLAYING,data);
        });

        nb.users.each(function (user) {

            user.get("socket").emit(constants.HOST_TRACK_PLAYING,data);
        });
    },


    /**
     * A NoiseBox track is playing, so loop through the box's hosts and tell them
     *
     * @param nbTrackModel The NBTrackModel instance which has its track property
     * @param nb The NBModel instance
     */
    trackComplete : function (data) {

        var nb = model.getNoiseBox(data.id);

        if ( !nb ) { return; }

        var track = nb.tracks.get(data.cid);
        if (!track) {
            track = nb.tracks.getByCid(data.cid);
        }
        track.set("played", true);

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.HOST_TRACK_COMPLETE, data);
        });

        nb.users.each(function (user) {

            user.get("socket").emit(constants.HOST_TRACK_COMPLETE, data);
        });
    },



    /**
     * A NoiseBox client (user or host) has been added or removed so we need to loop through all the
     * hosts for the client's NoiseBox and tell them to update their stats.
     *
     * @param nbClient NBHost or NBUser instance that has been added or removed.
     */
    updateNoiseBoxStats : function (nbClient) {

        var nb = model.getNoiseBox(nbClient.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.hosts.each(function (host) {

            host.get("socket").emit(constants.SERVER_NOISE_BOX_STATS_UPDATED,{numHosts:nb.hosts.length,numUsers:nb.users.length});
        });

        nb.users.each(function (user) {

            user.get("socket").emit(constants.SERVER_NOISE_BOX_STATS_UPDATED,{numHosts:nb.hosts.length,numUsers:nb.users.length});
        });
    },


    /**
     * When a NoiseBox host is added, list any users who are already connected
     *
     * @param nbClient NBHost instance that has been added
     */
    listUsers : function (nbHost) {

        var nb = model.getNoiseBox(nbHost.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.users.each(function (user) {
            nbHost.get("socket").emit(constants.USER_CHANGED, {
                username: user.get("username"),
                id: user.get("id"),
                eventType:constants.USER_ADDED
            });
        });
    },


    /**
     * A NoiseBox user has been added/updated/removed so we need to update the username list
     *
     * @param nbClient NBUser instance that has been added/updated/removed
     */
    userChanged : function (nbUser, eventType) {

        var nb = model.getNoiseBox(nbUser.get("parentNoiseBoxID"));

        if ( !nb ) { return; }

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.USER_CHANGED, {
                username: nbUser.get("username"),
                id: nbUser.get("id"),
                eventType: eventType
            });
        });

        nb.users.each(function (user) {
            user.get("socket").emit(constants.USER_CHANGED, {
                username: nbUser.get("username"),
                id: nbUser.get("id"),
                eventType: eventType
            });
        });
    },


    /**
     * A NoiseBox log has been updated, so emit the latest log changes
     *
     * @param item the log item
     * @param nbLog NBLog instance that has been updated
     * @param nb NB instance
     */
    logUpdated : function (item, nbLog, nb) {

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.LOG_UPDATED, item);
        });

        nb.users.each(function (user) {
            user.get("socket").emit(constants.LOG_UPDATED, item);
        });
    },


    /**
     * A Chat message has been added, add it to the log
     *
     */
    chatMessageSent : function (data) {

        var nb = model.getNoiseBox(data.user.id),
            item;

        if ( !nb ) { return; }

        item = {
            user : data.user.username,
            detail: data.message,
            eventType: "chat",
            datetime: moment().format("YYYY-MM-DD hh:mm:ss")
        };

        nb.hosts.each(function (host) {
            host.get("socket").emit(constants.LOG_UPDATED, item);
        });

        nb.users.each(function (user) {
            user.get("socket").emit(constants.LOG_UPDATED, item);
        });
    },


    /**
     * Validate a NoiseBox id.
     */
    isValidNoiseBoxID : function (id) {

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