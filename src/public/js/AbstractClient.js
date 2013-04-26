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
            this.hostURL = $("body").data("host");
            this.noiseBoxID = $("body").data("noise-box-id");
            this.socket = io.connect(this.hostURL);

            console.log("****************");
            console.log("Client init",this.clientType,this.hostURL,this.noiseBoxID===undefined?"":this.noiseBoxID);

            this.flashMessage();

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
            this.userListEl = $("#users");
            this.logEl = $("#log ul");
            this.currentlyPlayingHeaderEl = $("#currently-playing");

            this.shareLinkEl = $(".share-trigger a");
            this.shareLinkEl.on("click", this.toggleShareLink);

            this.shareEl = $(".share input");
            this.shareEl.on("click", this.selectText);

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

            var $li = $("<li />")
                .text(data.album + " - " + data.trackName)
                .wrapInner("<span/>")
                .attr("id","header-"+data.cid)
                .appendTo(this.currentlyPlayingHeaderEl.find('ul'));

            var liWidth = $li.outerWidth();
            $li.find('span').width(liWidth);

            this.currentlyPlayingHeaderEl.find("h3").css({display:"block"});
        },

        onHostTrackPlaying : function (track) {
        },

        onHostTrackComplete : function (track) {
            var self = this;

            this.playQueueEl.find("li#"+track.cid).slideUp().remove();

            this.currentlyPlayingHeaderEl.find("li#header-"+track.cid)
                .animate({width:0}, 200, function(){
                    $(this).remove();

                    if (self.currentlyPlayingHeaderEl.find("li").length < 1) {
                        self.currentlyPlayingHeaderEl.find("h3").fadeOut();
                    }
                });
        },

        onServerRemoveTrack : function (data) {
        },

        onNoiseBoxStatsUpdated : function (data) {
            var $hostS = $(".hosts-stats-s"),
                $userS = $(".users-stats-s");

            if (data.numHosts === 1) {
                $hostS.css("display","none");
            } else {
                $hostS.css("display","inline");
            }

            if (data.numUsers === 1) {
                $userS.css("display","none");
            } else {
                $userS.css("display","inline");
            }

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

        // if there is a flash message, display it
        flashMessage : function() {
            var $flashMessage = $(".flash-message");
            if ($flashMessage.length > 0) {
                $flashMessage
                    .slideDown(250)
                    .delay(5000)
                    .slideUp(250, function(){
                        $flashMessage.remove();
                    });
            }
        },


        createFlashMessage : function(message) {
            var $flashMessage = $("<div>")
                .attr("class", "flash-message")
                .css("display", "none")
                .html("<p>"+message+"</p>")
                .prependTo("#wrapper");
            this.flashMessage();
        },


        // share link functionality
        toggleShareLink: function(e) {
            e.preventDefault();
            var $this = $(this),
                $share = $(".share");
            $this.toggleClass("active");
            $share.slideToggle();
        },

        selectText: function(e) {
            e.preventDefault();
            this.select();
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