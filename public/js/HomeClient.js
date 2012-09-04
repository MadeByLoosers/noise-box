/**
 * NoiseBox
 * HomeClient.js
 *
 * Home page NoiseBox client.
 */

define(["const","AbstractClient","jquery"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        init : function () {

            this._super();

            this.on(Const.SERVER_APP_STATS_UPDATED,this.onServerStatsUpdated);
        },

        onConnect : function () {

            this._super();

            this.emit(Const.HOME_CONNECT);
        },

        onServerStatsUpdated : function (data) {

            $(".noise-boxes-stats-value").text(data.numNoiseBoxes);
            $(".clients-stats-value").text(data.numClients);
        }
    });
});