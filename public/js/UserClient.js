/**
 * NoiseBox
 * UserClient.js
 *
 * Host page NoiseBox client.
 */

define(["const","AbstractClient","jquery"], function (Const,AbstractClient) {

    return AbstractClient.extend({

        init : function () {

            this._super();
        },

        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});