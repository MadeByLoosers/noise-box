/**
 * NoiseBox
 * UserClient.js
 *
 * Host page NoiseBox client.
 */
/*global define $ _ */

define(["constants","AbstractClient","jquery","underscore"], function (Const,AbstractClient) {
    "use strict";

    return AbstractClient.extend({

        init : function () {

            this._super();

            $("#file-list").on("click","a",_.bind(this.onTrackClicked,this));
        },

        onTrackClicked : function (event) {

            event.preventDefault();

            this.emit(Const.USER_CLICKED_TRACK,{track:event.target.href});
        },

        onConnect : function () {

            this._super();

            this.emit(Const.USER_CONNECT);
        }
    });
});