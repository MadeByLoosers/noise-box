/**
 * NoiseBox
 * HomeClient.js
 *
 * Host page NoiseBox client.
 */

define(["constants","AbstractClient","jquery"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        audioElement : null,

        playQueue : [],

        users : [],

        currentTrack : null,

        playQueueEl : null,
        currentlyPlayingEl : null,
        userListEl : null,

        init : function () {

            this._super();

            this.on(Const.SERVER_NOISE_BOX_STATS_UPDATED,this.onNoiseBoxStatsUpdated);
            this.on(Const.SERVER_ADD_TRACK,this.onServerAddTrack);
            this.on(Const.SERVER_REMOVE_TRACK,this.onServerRemoveTrack);

            this.on(Const.USER_ADDED,this.onUserAdded);
            this.on(Const.USER_UPDATED,this.onUserUpdated);
            this.on(Const.USER_REMOVED,this.onUserRemoved);

            this.playQueueEl = $("#play-queue ol");
            this.currentlyPlayingEl = $("#currently-playing p");
            this.userListEl = $("#users");
        },

        onConnect : function () {

            this._super();

            this.emit(Const.HOST_CONNECT);
        },

        onServerAddTrack : function (data) {

            this.playQueue.push(data);
            this.play();

            $("<li />")
                .attr("id", data.cid)
                .text(data.track)
                .hide()
                .slideDown()
                .appendTo(this.playQueueEl);
        },

        onServerRemoveTrack : function (data) {
            console.log("* remove track *");
        },

        onTrackComplete : function () {

            this.playQueueEl.find("li#"+this.currentTrack.cid).slideUp().remove();
            this.currentlyPlayingEl.text("");

            this.currentTrack = null;

            if (this.playQueue.length > 0) {
                this.play();
            }
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

        play : function() {

            if (!this.currentTrack) {

                this.currentTrack = this.playQueue.shift();

                // need to create a new audio element each time
                // can't just change the src of an existing element
                if (!!this.audioElement) {
                    this.audioElement.off('ended');
                    this.audioElement.remove();
                }

                this.audioElement = $("<audio />")
                    .attr("id", "audio-player")
                    .attr("preload", "auto")
                    .attr("src", this.currentTrack.track)
                    .appendTo("body");

                this.audioElement[0].play();

                this.audioElement.on('ended', $.proxy(this.onTrackComplete, this) );

                this.currentlyPlayingEl.text(this.currentTrack.track);
            }
        }
    });
});