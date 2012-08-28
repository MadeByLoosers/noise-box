/**
 * NoiseBox
 * HomeClient.js
 *
 * Class definition for a home page client defined as a RequireJS module.
 */

define(["constants","AbstractClient","zepto"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        init : function () {

            this._super();

            console.log("HomeClient.init");

            this.on(Const.SERVER_SOCKET_CONNECT,this.onHomeSocketConnect);
            this.on(Const.SERVER_APP_STATS_UPDATED,this.onServerStatsUpdated);
        },

        onHomeSocketConnect : function (data) {

            this.emit(Const.HOME_CONNECT);
        },

        onServerStatsUpdated : function (data) {

            $(".noise-boxes-stats-value").text(data.numNoiseBoxes);
            $(".clients-stats-value").text(data.numClients);
        }
    });
});