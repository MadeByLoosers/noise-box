/**
 * NoiseBox
 * nb.js
 *
 * Main NoiseBox client module. Creates an appropriate client class instance to handle the
 * different types of client.
 */

define(["HomeClient","AbstractClient","constants","zepto","socketio"], function (HomeClient,AbstractClient,Const) {

    var init = function () {

        $(function () {

            console.log("nb.init",$("body").attr("id"));

            var client;
            var clientType = $("body").attr("id");

            switch ( clientType ) {

                case Const.TYPE_HOME:
                    client = new HomeClient();
                    break;
                case Const.TYPE_HOST:
                    break;
                case Const.TYPE_USER:
                    break;
                default:
                    console.log("Error: client type \""+clientType+"\" not recognised");
                    break;
            }
        });
    };

    return {

        init : init
    };
});