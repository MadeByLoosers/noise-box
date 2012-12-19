/**
 * NoiseBox
 * AbstractClient.js
 *
 * Abstract NoiseBox client. Contains shared functionality used across all types of client, but no
 * type specific implementations. All clients inherit from this object.
 */

define(["constants","jquery","underscore","sji"], function (Const) {

    return Class.extend({

        id : "",
        socket : {},
        clientType : "",
        host : "",
        env : "",

        playQueue : [],
        users : [],

        playQueueEl : null,
        currentlyPlayingEl : null,
        userListEl : null,
        logEl : null,


        /**
         * Constructor.
         */
        init : function () {

            this.clientType = $("body").attr("id");
            this.host = $("body").data("host");
            this.id = $("body").data("noise-box-id");
            this.env = $("body").data("env");
            this.socket = io.connect(this.host);

            console.log("****************");
            console.log("Client init",this.clientType,this.host,this.id===undefined?"":this.id);

            $("#flashMessage p:parent").parent().slideDown(250).delay(5000).slideUp(250);

            this.on(Const.SERVER_SOCKET_CONNECT,this.onConnect);
            this.on(Const.SOCKET_DISCONNECT,this.onDisconnect);

            this.on(Const.SERVER_NOISE_BOX_STATS_UPDATED,this.onNoiseBoxStatsUpdated);
            this.on(Const.SERVER_ADD_TRACK,this.onServerAddTrack);
            this.on(Const.SERVER_REMOVE_TRACK,this.onServerRemoveTrack);

            this.on(Const.USER_ADDED,this.onUserAdded);
            this.on(Const.USER_UPDATED,this.onUserUpdated);
            this.on(Const.USER_REMOVED,this.onUserRemoved);

            this.on(Const.LOG_UPDATED,this.onLogUpdated);

            this.on(Const.HOST_TRACK_PLAYING,this.onHostTrackPlaying);
            this.on(Const.HOST_TRACK_COMPLETE,this.onHostTrackComplete);

            this.playQueueEl = $("#play-queue ol");
            this.currentlyPlayingEl = $("#currently-playing p");
            this.userListEl = $("#users");
            this.logEl = $("#log ul");

        },

        /**
         * Socket connection to server established.
         */
        onConnect : function () {

            console.log("Socket connected");
        },

        /**
         * Socket connection to server terminated.
         */
        onDisconnect : function () {

            console.log("Socket disconnected");
        },


        /*
         * stats logging methods
         */
        onServerAddTrack : function (data) {

            $("<li />")
                .attr("id", data.cid)
                .text(data.user + " added the track " + data.track + " on " + data.datetime)
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
            console.log("* remove track *");
        },

        onNoiseBoxStatsUpdated : function (data) {

            $(".hosts-stats-value").text(data.numHosts);
            $(".users-stats-value").text(data.numUsers);
        },

        onUserAdded : function(data) {
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
                id : this.id,
                clientType : this.clientType
            });

            console.log("Emitting '"+event+"'",typeof data === "undefined"?"":JSON.stringify(data));

            this.socket.emit(event,data);
        }
    });
});