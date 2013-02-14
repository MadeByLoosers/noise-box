/**
 * NoiseBox
 * AbstractClient.js
 *
 * Abstract parent class for HostClient and HomeClient. Contains shared
 * functionality for these two NoiseBox client types.
 */

define(function (require) {

    var Const = require("constants");
    var $ = require("jquery");
    var _ = require("underscore");

    return Class.extend({

        init : function () {

            this.users = [];
            this.playQueue = [];
            this.clientType = $("body").attr("id");
            this.hostURL = $("body").data("host-ip") || $("body").data("host-name");
            this.noiseBoxID = $("body").data("noise-box-id");
            this.socket = io.connect(this.hostURL);

            console.log("****************");
            console.log("Client init",this.clientType,this.hostURL,this.noiseBoxID===undefined?"":this.noiseBoxID);

            $("#flashMessage p:parent").parent().slideDown(250).delay(5000).slideUp(250);

            this.on(Const.SERVER_SOCKET_CONNECT,this.onConnect);
            this.on(Const.SOCKET_DISCONNECT,this.onDisconnect);

            this.on(Const.SERVER_NOISE_BOX_STATS_UPDATED,this.onNoiseBoxStatsUpdated);
            this.on(Const.SERVER_ADD_TRACK,this.onServerAddTrack);
            this.on(Const.SERVER_REMOVE_TRACK,this.onServerRemoveTrack);

            this.on(Const.USER_CHANGED,this.onUserChanged);

            this.on(Const.LOG_UPDATED,this.onLogUpdated);

            this.on(Const.HOST_TRACK_PLAYING,this.onHostTrackPlaying);
            this.on(Const.HOST_TRACK_COMPLETE,this.onHostTrackComplete);

            this.playQueueEl = $("#play-queue ol");
            this.currentlyPlayingEl = $("#currently-playing p");
            this.userListEl = $("#users");
            this.logEl = $("#log ul");

        },

        onConnect : function () {
            console.log("Socket connected");
        },

        onDisconnect : function () {
            console.log("Socket disconnected");
        },

        /**
         * A track has been added to the NoiseBox.
         */
        onServerAddTrack : function (data) {
            $("<li />")
                .attr("id",data.cid)
                .text(data.user+" added the track "+data.track+" on "+data.datetime)
                .hide()
                .slideDown()
                .appendTo(this.playQueueEl);
        },

        onHostTrackPlaying : function (track) {
            this.currentlyPlayingEl.text(track.track);
        },

        onHostTrackComplete : function (track) {
            this.playQueueEl.find("li#"+track.cid).slideUp().remove();
            this.currentlyPlayingEl.text("");
        },

        onServerRemoveTrack : function (data) {
        },

        onNoiseBoxStatsUpdated : function (data) {
            $(".hosts-stats-value").text(data.numHosts);
            $(".users-stats-value").text(data.numUsers);
        },

        onUserChanged : function(data) {
            switch(data.eventType) {
                case Const.USER_ADDED:
                    this.onUserAdded(data);
                break;
                case Const.USER_UPDATED:
                    this.onUserUpdated(data);
                break;
                case Const.USER_REMOVED:
                    this.onUserRemoved(data);
                break;
            }
        },

        onUserAdded : function(data) {
            if ($("li#"+data.id).length > 0) { return; }
            $("<li />")
                .attr("id", data.id)
                .text(data.username)
                .appendTo(this.userListEl);
        },

        onUserUpdated : function(data) {
            $("li#"+data.id).text(data.username);
        },

        onUserRemoved : function(data) {
            $("li#"+data.id).slideUp().remove();
        },

        onLogUpdated : function (item) {
            var log = "["+item.eventType+"] ";

            if (item && item.detail) {
                log += "["+item.detail+"] ";
            }

            if (item && item.user) {
                log += "["+item.user+"] ";
            }

            log += " ("+item.datetime+")";

            $("<li />")
                .text(log)
                .appendTo(this.logEl);
        },

        /**
         * Helper function for binding callbacks to socket events from the server.
         *
         * @param event Server event name string.
         * @param callback Callback function reference.
         */
        on : function (event,callback) {

            console.log("Listening for '"+event+"'");

            var self = this;

            this.socket.on(event,function (data) {

                console.log("Received '"+event+"'",typeof data === "undefined"?"":JSON.stringify(data));

                callback.call(self,data);
            });
        },

        /**
         * Helper function for sending socket events to the server.
         *
         * @param event Client event name string.
         */
        emit : function (event,data) {

            data = typeof data !== "undefined" ? data : {};

            data = _.extend(data,{
                id : this.noiseBoxID,
                clientType : this.clientType
            });

            console.log("Emitting '"+event+"'",typeof data === "undefined"?"":JSON.stringify(data));

            this.socket.emit(event,data);
        }
    });
});