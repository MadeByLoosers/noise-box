/**
 * NoiseBox
 * HomeClient.js
 *
 * Host page NoiseBox client.
 */

define(["const","AbstractClient","jquery"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        init : function () {

            this._super();

            this.on(Const.SERVER_NOISE_BOX_STATS_UPDATED,this.onNoiseBoxStatsUpdated);
        },

        onConnect : function () {

            this._super();

            this.emit(Const.HOST_CONNECT);
        },

        onNoiseBoxStatsUpdated : function (data) {

            $(".hosts-stats-value").text(data.numHosts);
            $(".users-stats-value").text(data.numUsers);
        }
    });
});