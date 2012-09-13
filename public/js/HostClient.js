/**
 * NoiseBox
 * HomeClient.js
 *
 * Host page NoiseBox client.
 */
/*global define $ */

define(["constants","AbstractClient","jquery"], function (Const,AbstractClient) {
    "use strict";

    return AbstractClient.extend({

        audioElement : {},

        init : function () {

            this._super();

            this.on(Const.SERVER_NOISE_BOX_STATS_UPDATED,this.onNoiseBoxStatsUpdated);
            this.on(Const.SERVER_PLAY_TRACK_REQUEST,this.onServerPlayTrackRequest);

            this.audioElement = $("#audio-player").get(0);
        },

        onConnect : function () {

            this._super();

            this.emit(Const.HOST_CONNECT);
        },

        onServerPlayTrackRequest : function (data) {

            this.audioElement.src = data.track;
            this.audioElement.play();
        },

        onNoiseBoxStatsUpdated : function (data) {

            $(".hosts-stats-value").text(data.numHosts);
            $(".users-stats-value").text(data.numUsers);
        }
    });
});