/**
 * NoiseBox
 * main.js
 *
 * Clientside JS entry point.
 */

(function () {

    "use strict";

    require.config({

        paths : {
            jquery : "lib/jquery",
            underscore : "lib/underscore",
            sji : "lib/sji",
            socketio : "../socket.io/socket.io",
            constants : "const"
        },
        shim : {
            jquery : {
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