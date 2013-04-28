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
    require("timeago");

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

            this.playQueueEl = $("#play-queue ul");
            this.userListEl = $("#users ul");
            this.logEl = $("#log ul");
            this.currentlyPlayingHeaderEl = $("#currently-playing");

            this.shareLinkEl = $(".share-trigger a");
            this.shareLinkEl.on("click", this.toggleShareLink);

            this.shareEl = $(".share input");
            this.shareEl.on("click", this.selectText);

            // start relative time count
            timeAgo.init();

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

            var $li, $icon, $headerLi;

            $icon = this.createIcon("track");

            $li = $("<li />")
                .attr("id",data.cid)
                .addClass("log")
                .html(data.album+" - "+data.trackName)
                .prepend($icon)
                .hide()
                .slideDown()
                .appendTo(this.playQueueEl);

            $headerLi = $("<li />")
                .text(data.album + " - " + data.trackName)
                .wrapInner("<span/>")
                .attr("id","header-"+data.cid)
                .appendTo(this.currentlyPlayingHeaderEl.find('ul'));

            var liWidth = $headerLi.outerWidth();
            $headerLi.find('span').width(liWidth);

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
            var $i, $li, $icon;

            $icon = this.createIcon("user");

            $li = $("<li />")
                .attr("id", data.id)
                .addClass("log")
                .prepend($icon)
                .text(data.username)
                .appendTo(this.userListEl);
        },

        onUserUpdated : function(data) {
            var $li, $icon;

            $li = $("li#"+data.id);
            $li.text(data.username);

            if ($li.find('i').length < 1) {
                $icon = this.createIcon("user");
                $li.prepend($icon);
            }
        },

        onUserRemoved : function(data) {
            $("li#"+data.id).slideUp().remove();
        },

        onLogUpdated : function (item) {
            var logMessage, $li, $icon;

            switch(item.eventType) {
                case "user-added":
                    logMessage = "<strong>" + item.user + "</strong> joined the room";
                    break;
                case "username-updated":
                    logMessage = item.user + " is now known as <strong>" + item.detail + "</strong>";
                    break;
                case "user-removed":
                    logMessage = item.user + " left the room";
                    break;
                case "track-added":
                    logMessage = item.user + " added the track <strong>" + item.detail + "</strong>";
                    break;
                case "track-complete":
                    logMessage = item.detail + " finished playing";
                    break;
                case "track-removed":
                    logMessage = item.detail + " was removed from the playlist";
                    break;
                case "chat":
                    logMessage = item.user + " says: &ldquo;" + item.detail + "&rdquo;";
                    break;
                case "host-added":
                    logMessage = "A host has been added";
                    break;
                case "host-removed":
                    logMessage = "A host has been removed";
                    break;
            }

            logMessage += ' <span class="datetime" data-datetime="'+item.datetime+'">0s</span>';

            $icon = this.createIcon(item.eventType);

            $li = $("<li />")
                .addClass("log")
                .html(logMessage)
                .prepend($icon)
                .appendTo(this.logEl);

            timeAgo.add($li.find('span'));

            // scroll the log to the bottom if we're nearly there anyway...
            var $scrollable = this.logEl.closest('.scrollable');
            if (this.logEl.outerHeight() - $scrollable.scrollTop() - $scrollable.outerHeight() < 150) {
                $scrollable.animate({ scrollTop: this.logEl.outerHeight() }, 250);
            }
        },


        createIcon : function(type) {
            var icon = "icon-",
                $icon;

            switch(type) {
                case "user":
                case "user-added":
                case "username-updated":
                case "user-removed":
                    icon += "user";
                    break;

                case "track":
                case "track-added":
                case "track-complete":
                case "track-removed":
                    icon += "music";
                    break;

                case "chat":
                    icon += "comment-alt";
                    break;

                case "host-added":
                case "host-removed":
                    icon += "desktop";
                    break;
            }

            $icon = $("<i /> ")
                .addClass(icon);

            return $icon;
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