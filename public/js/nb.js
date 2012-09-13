/**
 * NoiseBox
 * nb.js
 *
 * Main NoiseBox client module. Creates an appropriate client class instance to handle the
 * different types of client.
 */
/*global define $ */

define(["HomeClient","HostClient","UserClient","constants","jquery","socketio"], function (HomeClient,HostClient,UserClient,Const) {
    "use strict";

    var init = function () {

        $(function () {

            var client;
            var clientType = $("body").attr("id");

            switch ( clientType ) {

                case Const.TYPE_HOME:
                    client = new HomeClient();
                    break;
                case Const.TYPE_HOST:
                    client = new HostClient();
                    break;
                case Const.TYPE_USER:
                    client = new UserClient();
                    break;
                default:
                    throw(new Error("Client type '"+clientType+"' not recognised"));
            }
        });
    };

    return {

        init : init
    };
});