/**
 * NoiseBox
 * main.js
 *
 * RequireJS entry point.
 */

(function () {

    "use strict";

    require.config({

        paths : {
            zepto : "lib/zepto",
            underscore : "lib/underscore",
            sji : "lib/sji",
            socketio : "../socket.io/socket.io",
            constants : "/js/const"
        },
        shim : {
            zepto : {
                exports : "$"
            },
            socketio : {
                exports : "io"
            },
            sji : {
                exports : "Class"
            },
            underscore : {
                exports : "_"
            },
            constants : {
                exports : "Const"
            }
        }
    });

    require(["nb"],function (nb) {

        nb.init();
    });
}());